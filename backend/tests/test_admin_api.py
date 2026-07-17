"""Backend tests for Engemix Admin API - Iteration 7 (new features)"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "donas@gmail.com"
ADMIN_PASS = "Seinao@123"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS}, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Health ----------
class TestHealth:
    def test_root(self):
        r = requests.get(f"{API}/", timeout=10)
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_login_ok(self, token):
        assert isinstance(token, str) and len(token) > 20


# ---------- Auth ----------
class TestAuth:
    def test_login_bad(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=10)
        assert r.status_code == 401

    def test_me_requires_token(self):
        r = requests.get(f"{API}/auth/me", timeout=10)
        assert r.status_code in (401, 403)

    def test_me(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL


# ---------- Public tracking ----------
class TestPublic:
    def test_track_and_public_config(self):
        r = requests.post(f"{API}/track/event", json={
            "type": "pageview", "page": "/home", "session_id": f"TEST_{uuid.uuid4()}"
        }, timeout=10)
        assert r.status_code == 200
        r2 = requests.get(f"{API}/config/public", timeout=10)
        assert r2.status_code == 200
        assert "whatsapp_number" in r2.json()


# ---------- Stats with period ----------
class TestStatsPeriod:
    def test_stats_24h(self, auth_headers):
        r = requests.get(f"{API}/admin/stats?period=24h", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["period"] == "24h"
        assert len(d["series"]) == 24
        # HH:00 label format
        assert ":" in d["series"][0]["label"]
        t = d["totals"]
        assert "conversion_rate" in t and isinstance(t["conversion_rate"], (int, float))
        assert "wa_click_rate" in t and isinstance(t["wa_click_rate"], (int, float))

    def test_stats_7d(self, auth_headers):
        r = requests.get(f"{API}/admin/stats?period=7d", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["period"] == "7d"
        assert len(d["series"]) == 7
        assert "/" in d["series"][0]["label"]  # DD/MM

    def test_stats_30d(self, auth_headers):
        r = requests.get(f"{API}/admin/stats?period=30d", headers=auth_headers, timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert len(d["series"]) == 30


# ---------- Leads CRUD + new endpoints ----------
class TestLeads:
    def test_list_shape(self, auth_headers):
        r = requests.get(f"{API}/admin/leads", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        d = r.json()
        assert "items" in d and "count" in d
        assert isinstance(d["count"], int)

    def test_create_patch_valid(self, auth_headers):
        payload = {"telefone": "11999999999", "nome": "TEST_LeadUser", "cidade": "SP"}
        r = requests.post(f"{API}/leads", json=payload, timeout=10)
        assert r.status_code == 200
        lead_id = r.json()["id"]

        # Valid status
        r2 = requests.patch(f"{API}/admin/leads/{lead_id}", headers=auth_headers,
                            json={"status": "contatado"}, timeout=10)
        assert r2.status_code == 200
        assert r2.json()["status"] == "contatado"

        # Verify persisted
        r3 = requests.get(f"{API}/admin/leads", headers=auth_headers, timeout=10)
        item = next(x for x in r3.json()["items"] if x["id"] == lead_id)
        assert item["status"] == "contatado"

        # Cleanup
        rd = requests.delete(f"{API}/admin/leads/{lead_id}", headers=auth_headers, timeout=10)
        assert rd.status_code == 200

    def test_patch_invalid_status(self, auth_headers):
        # Create
        r = requests.post(f"{API}/leads", json={"telefone": "1", "nome": "TEST_x"}, timeout=10)
        lead_id = r.json()["id"]
        try:
            r2 = requests.patch(f"{API}/admin/leads/{lead_id}", headers=auth_headers,
                                json={"status": "invalido"}, timeout=10)
            assert r2.status_code == 422
            r3 = requests.patch(f"{API}/admin/leads/{lead_id}", headers=auth_headers,
                                json={"foo": "bar"}, timeout=10)
            assert r3.status_code == 422
        finally:
            requests.delete(f"{API}/admin/leads/{lead_id}", headers=auth_headers, timeout=10)

    def test_delete_lead_and_404(self, auth_headers):
        r = requests.post(f"{API}/leads", json={"telefone": "1", "nome": "TEST_del"}, timeout=10)
        lead_id = r.json()["id"]
        r2 = requests.delete(f"{API}/admin/leads/{lead_id}", headers=auth_headers, timeout=10)
        assert r2.status_code == 200
        assert r2.json().get("ok") is True
        # second delete -> 404
        r3 = requests.delete(f"{API}/admin/leads/{lead_id}", headers=auth_headers, timeout=10)
        assert r3.status_code == 404

    def test_export_csv(self, auth_headers):
        # ensure at least one lead
        r0 = requests.post(f"{API}/leads", json={"telefone": "11", "nome": "TEST_exp", "cidade": "SP"}, timeout=10)
        lead_id = r0.json()["id"]
        try:
            r = requests.get(f"{API}/admin/leads/export", headers=auth_headers, timeout=15)
            assert r.status_code == 200
            ct = r.headers.get("Content-Type", "")
            assert "text/csv" in ct
            cd = r.headers.get("Content-Disposition", "")
            assert "attachment" in cd and "orcamentos_engemix" in cd
            body = r.text
            # header PT-BR
            first = body.splitlines()[0]
            for col in ["Data", "Nome", "Telefone", "Email", "Cargo", "Tipo de obra",
                        "CEP", "Cidade", "Estado", "Volume", "Status"]:
                assert col in first
        finally:
            requests.delete(f"{API}/admin/leads/{lead_id}", headers=auth_headers, timeout=10)


# ---------- Presence with $sort ----------
class TestPresence:
    def test_presence_order(self, auth_headers):
        sid = f"TEST_PRES_{uuid.uuid4()}"
        # Emit two events with different pages
        requests.post(f"{API}/track/event", json={"type": "pageview", "page": "/home", "session_id": sid}, timeout=10)
        time.sleep(1.1)
        requests.post(f"{API}/track/event", json={"type": "pageview", "page": "/orcamento", "session_id": sid}, timeout=10)
        time.sleep(0.5)
        r = requests.get(f"{API}/admin/presence", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        d = r.json()
        s = next((x for x in d["sessions"] if x["_id"] == sid), None)
        assert s is not None
        # Since $sort by created_at asc + $last => should give the latest page /orcamento
        assert s["last_page"] == "/orcamento"
        assert "ip" in s and "user_agent" in s


# ---------- Auth-required ----------
class TestAuthRequired:
    def test_all_admin_require_auth(self):
        for path in ["/admin/stats", "/admin/activity", "/admin/presence",
                     "/admin/leads", "/admin/leads/export", "/admin/config"]:
            r = requests.get(f"{API}{path}", timeout=10)
            assert r.status_code in (401, 403), f"{path} -> {r.status_code}"
