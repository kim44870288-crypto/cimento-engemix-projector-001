from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import bcrypt
import jwt
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# JWT
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGO = "HS256"
JWT_EXPIRE_HOURS = 24

app = FastAPI(title="Engemix Admin API")
api = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)


# ---------- Utils ----------
def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(pw: str, h: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), h.encode("utf-8"))
    except Exception:
        return False


def create_token(email: str) -> str:
    payload = {
        "sub": email,
        "role": "admin",
        "exp": now_utc() + timedelta(hours=JWT_EXPIRE_HOURS),
        "iat": now_utc(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


async def get_current_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Não autenticado")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sessão expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
    email = payload.get("sub")
    user = await db.admin_users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    return {"email": user["email"], "role": user.get("role", "admin")}


# ---------- Models ----------
class LoginBody(BaseModel):
    email: EmailStr
    password: str


class TrackBody(BaseModel):
    model_config = ConfigDict(extra="allow")
    type: str
    page: Optional[str] = None
    session_id: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None


class LeadCreate(BaseModel):
    telefone: str
    nome: str
    cargo: Optional[str] = ""
    email: Optional[str] = ""
    tipo_obra: Optional[str] = ""
    cep: Optional[str] = ""
    cidade: Optional[str] = ""
    estado: Optional[str] = ""
    volume: Optional[str] = ""


class ConfigUpdate(BaseModel):
    whatsapp_number: Optional[str] = None
    whatsapp_message: Optional[str] = None


# ---------- Root ----------
@api.get("/")
async def root():
    return {"message": "Engemix API", "ok": True}


# ---------- Public: Config ----------
@api.get("/config/public")
async def get_public_config():
    doc = await db.config.find_one({"_id": "site"}) or {}
    return {
        "whatsapp_number": doc.get("whatsapp_number", "554121122023"),
        "whatsapp_message": doc.get(
            "whatsapp_message", "Olá! Gostaria de solicitar um orçamento."
        ),
    }


# ---------- Public: Tracking ----------
@api.post("/track/event")
async def track_event(body: TrackBody, request: Request):
    doc = {
        "_id": str(uuid.uuid4()),
        "type": body.type,
        "page": body.page or "",
        "session_id": body.session_id or "",
        "meta": body.meta or {},
        "ip": request.client.host if request.client else "",
        "user_agent": request.headers.get("user-agent", "")[:250],
        "created_at": now_utc().isoformat(),
    }
    await db.events.insert_one(doc)
    return {"ok": True}


# ---------- Public: Leads ----------
@api.post("/leads")
async def create_lead(body: LeadCreate, request: Request):
    doc = body.model_dump()
    doc["_id"] = str(uuid.uuid4())
    doc["status"] = "novo"
    doc["ip"] = request.client.host if request.client else ""
    doc["created_at"] = now_utc().isoformat()
    await db.leads.insert_one(doc)
    # Also track as event
    await db.events.insert_one(
        {
            "_id": str(uuid.uuid4()),
            "type": "lead_created",
            "page": "/orcamento",
            "session_id": "",
            "meta": {"nome": body.nome, "cidade": body.cidade},
            "ip": doc["ip"],
            "user_agent": request.headers.get("user-agent", "")[:250],
            "created_at": doc["created_at"],
        }
    )
    return {"ok": True, "id": doc["_id"]}


# ---------- Auth ----------
@api.post("/auth/login")
async def login(body: LoginBody):
    email = body.email.lower().strip()
    user = await db.admin_users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    token = create_token(email)
    return {"token": token, "user": {"email": email, "role": user.get("role", "admin")}}


@api.get("/auth/me")
async def me(current=Depends(get_current_admin)):
    return current


# ---------- Admin: Stats ----------
@api.get("/admin/stats")
async def stats(current=Depends(get_current_admin)):
    now = now_utc()
    day_ago = (now - timedelta(hours=24)).isoformat()
    week_ago = (now - timedelta(days=7)).isoformat()

    total_events = await db.events.count_documents({})
    total_leads = await db.leads.count_documents({})
    events_24h = await db.events.count_documents({"created_at": {"$gte": day_ago}})
    leads_24h = await db.leads.count_documents({"created_at": {"$gte": day_ago}})
    pageviews_24h = await db.events.count_documents(
        {"type": "pageview", "created_at": {"$gte": day_ago}}
    )
    wa_clicks_24h = await db.events.count_documents(
        {"type": "whatsapp_click", "created_at": {"$gte": day_ago}}
    )

    # Distinct visitors 24h by session_id
    session_pipeline = [
        {"$match": {"created_at": {"$gte": day_ago}, "session_id": {"$ne": ""}}},
        {"$group": {"_id": "$session_id"}},
        {"$count": "n"},
    ]
    sess = await db.events.aggregate(session_pipeline).to_list(1)
    visitors_24h = sess[0]["n"] if sess else 0

    # Series per hour (last 24h)
    series = []
    for i in range(23, -1, -1):
        start = now - timedelta(hours=i + 1)
        end = now - timedelta(hours=i)
        count = await db.events.count_documents(
            {
                "type": "pageview",
                "created_at": {"$gte": start.isoformat(), "$lt": end.isoformat()},
            }
        )
        series.append({"hour": end.strftime("%H:00"), "views": count})

    # Top pages
    top_pipeline = [
        {"$match": {"type": "pageview", "created_at": {"$gte": week_ago}}},
        {"$group": {"_id": "$page", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 6},
    ]
    top = await db.events.aggregate(top_pipeline).to_list(6)

    # Events by type (7d)
    type_pipeline = [
        {"$match": {"created_at": {"$gte": week_ago}}},
        {"$group": {"_id": "$type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    by_type = await db.events.aggregate(type_pipeline).to_list(20)

    return {
        "totals": {
            "events": total_events,
            "leads": total_leads,
            "events_24h": events_24h,
            "leads_24h": leads_24h,
            "pageviews_24h": pageviews_24h,
            "whatsapp_clicks_24h": wa_clicks_24h,
            "visitors_24h": visitors_24h,
        },
        "series_24h": series,
        "top_pages": [{"page": t["_id"] or "-", "count": t["count"]} for t in top],
        "by_type": [{"type": t["_id"], "count": t["count"]} for t in by_type],
    }


# ---------- Admin: Activity ----------
@api.get("/admin/activity")
async def activity(limit: int = 50, since: Optional[str] = None, current=Depends(get_current_admin)):
    q: Dict[str, Any] = {}
    if since:
        q["created_at"] = {"$gt": since}
    docs = (
        await db.events.find(q, {"_id": 0})
        .sort("created_at", -1)
        .limit(min(limit, 200))
        .to_list(limit)
    )
    return {"items": docs, "server_time": now_utc().isoformat()}


# Presence: sessions active in last 3 minutes
@api.get("/admin/presence")
async def presence(current=Depends(get_current_admin)):
    cutoff = (now_utc() - timedelta(minutes=3)).isoformat()
    pipeline = [
        {"$match": {"created_at": {"$gte": cutoff}, "session_id": {"$ne": ""}}},
        {
            "$group": {
                "_id": "$session_id",
                "last_seen": {"$max": "$created_at"},
                "last_page": {"$last": "$page"},
                "ip": {"$last": "$ip"},
                "user_agent": {"$last": "$user_agent"},
                "events": {"$sum": 1},
            }
        },
        {"$sort": {"last_seen": -1}},
        {"$limit": 100},
    ]
    sessions = await db.events.aggregate(pipeline).to_list(100)
    return {"online": len(sessions), "sessions": sessions}


# ---------- Admin: Leads ----------
@api.get("/admin/leads")
async def list_leads(limit: int = 100, current=Depends(get_current_admin)):
    docs = (
        await db.leads.find({}, {"_id": 1, "telefone": 1, "nome": 1, "cargo": 1, "email": 1,
                                 "tipo_obra": 1, "cep": 1, "cidade": 1, "estado": 1,
                                 "volume": 1, "status": 1, "created_at": 1})
        .sort("created_at", -1)
        .limit(min(limit, 500))
        .to_list(limit)
    )
    for d in docs:
        d["id"] = d.pop("_id")
    return {"items": docs}


@api.patch("/admin/leads/{lead_id}")
async def update_lead(lead_id: str, body: Dict[str, Any], current=Depends(get_current_admin)):
    allowed = {k: v for k, v in body.items() if k in {"status"}}
    if not allowed:
        raise HTTPException(status_code=400, detail="Nada a atualizar")
    r = await db.leads.update_one({"_id": lead_id}, {"$set": allowed})
    if r.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead não encontrado")
    return {"ok": True}


# ---------- Admin: Config ----------
@api.get("/admin/config")
async def get_config(current=Depends(get_current_admin)):
    doc = await db.config.find_one({"_id": "site"}) or {}
    return {
        "whatsapp_number": doc.get("whatsapp_number", "554121122023"),
        "whatsapp_message": doc.get(
            "whatsapp_message", "Olá! Gostaria de solicitar um orçamento."
        ),
    }


@api.put("/admin/config")
async def update_config(body: ConfigUpdate, current=Depends(get_current_admin)):
    upd = {k: v for k, v in body.model_dump().items() if v is not None}
    if not upd:
        raise HTTPException(status_code=400, detail="Nada a atualizar")
    upd["updated_at"] = now_utc().isoformat()
    await db.config.update_one({"_id": "site"}, {"$set": upd}, upsert=True)
    return {"ok": True, **upd}


# ---------- Startup ----------
@app.on_event("startup")
async def startup():
    # Indexes
    await db.admin_users.create_index("email", unique=True)
    await db.events.create_index("created_at")
    await db.events.create_index("type")
    await db.events.create_index("session_id")
    await db.leads.create_index("created_at")

    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "").lower().strip()
    admin_pass = os.environ.get("ADMIN_PASSWORD", "")
    if admin_email and admin_pass:
        existing = await db.admin_users.find_one({"email": admin_email})
        if not existing:
            await db.admin_users.insert_one(
                {
                    "email": admin_email,
                    "password_hash": hash_password(admin_pass),
                    "role": "admin",
                    "created_at": now_utc().isoformat(),
                }
            )
        elif not verify_password(admin_pass, existing["password_hash"]):
            await db.admin_users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_pass)}},
            )

    # Seed default config
    cfg = await db.config.find_one({"_id": "site"})
    if not cfg:
        await db.config.insert_one(
            {
                "_id": "site",
                "whatsapp_number": "554121122023",
                "whatsapp_message": "Olá! Gostaria de solicitar um orçamento de concreto.",
                "updated_at": now_utc().isoformat(),
            }
        )


@app.on_event("shutdown")
async def shutdown():
    client.close()


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
