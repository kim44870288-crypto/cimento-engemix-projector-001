"""Backend tests for Engemix Admin API"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://link-cleaner.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "donas@gmail.com"
ADMIN_PASS = "Seinao@123"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS}, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "token" in data and data["user"]["email"] == ADMIN_EMAIL
    return data["token"]


@pytest.fixture
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Auth ----------
class TestAuth:
    def test_login_bad_credentials(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=10)
        assert r.status_code == 401

    def test_me_requires_token(self):
        r = requests.get(f"{API}/auth/me", timeout=10)
        assert r.status_code in (401, 403)

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"


# ---------- Public tracking + config ----------
class TestPublic:
    def test_track_event(self):
        r = requests.post(f"{API}/track/event", json={
            "type": "pageview", "page": "/home", "session_id": f"TEST_{uuid.uuid4()}"
        }, timeout=10)
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_public_config(self):
        r = requests.get(f"{API}/config/public", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert "whatsapp_number" in data and "whatsapp_message" in data


# ---------- Leads ----------
class TestLeads:
    def test_create_lead_and_persist(self, auth_headers):
        payload = {"telefone": "11999999999", "nome": "TEST_LeadUser", "cidade": "SP"}
        r = requests.post(f"{API}/leads", json=payload, timeout=10)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["ok"] and d["id"]
        lead_id = d["id"]

        # Verify appears in admin listing
        r2 = requests.get(f"{API}/admin/leads", headers=auth_headers, timeout=10)
        assert r2.status_code == 200
        ids = [x["id"] for x in r2.json()["items"]]
        assert lead_id in ids

        # Update status
        r3 = requests.patch(f"{API}/admin/leads/{lead_id}",
                            headers=auth_headers, json={"status": "contatado"}, timeout=10)
        assert r3.status_code == 200

        # Verify persisted
        r4 = requests.get(f"{API}/admin/leads", headers=auth_headers, timeout=10)
        item = next(x for x in r4.json()["items"] if x["id"] == lead_id)
        assert item["status"] == "contatado"

    def test_lead_missing_required(self):
        r = requests.post(f"{API}/leads", json={"cidade": "SP"}, timeout=10)
        assert r.status_code == 422


# ---------- Admin data ----------
class TestAdmin:
    def test_stats(self, auth_headers):
        r = requests.get(f"{API}/admin/stats", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        d = r.json()
        for k in ["events", "leads", "events_24h", "leads_24h", "pageviews_24h",
                  "whatsapp_clicks_24h", "visitors_24h"]:
            assert k in d["totals"], f"missing {k}"
        assert isinstance(d["series_24h"], list) and len(d["series_24h"]) == 24
        assert "top_pages" in d and "by_type" in d

    def test_activity(self, auth_headers):
        r = requests.get(f"{API}/admin/activity?limit=10", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        d = r.json()
        assert "items" in d and "server_time" in d
        # since filter
        r2 = requests.get(f"{API}/admin/activity?since={d['server_time']}",
                          headers=auth_headers, timeout=10)
        assert r2.status_code == 200

    def test_presence(self, auth_headers):
        # generate an event with a session first
        sid = f"TEST_PRES_{uuid.uuid4()}"
        requests.post(f"{API}/track/event", json={"type": "pageview", "page": "/home", "session_id": sid}, timeout=10)
        time.sleep(0.5)
        r = requests.get(f"{API}/admin/presence", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        d = r.json()
        assert "online" in d and "sessions" in d
        assert any(s["_id"] == sid for s in d["sessions"])

    def test_config_update_reflects_public(self, auth_headers):
        # capture original
        orig = requests.get(f"{API}/admin/config", headers=auth_headers, timeout=10).json()
        try:
            new_num = "5511987654321"
            new_msg = "TEST_msg_" + uuid.uuid4().hex[:6]
            r = requests.put(f"{API}/admin/config", headers=auth_headers,
                             json={"whatsapp_number": new_num, "whatsapp_message": new_msg}, timeout=10)
            assert r.status_code == 200
            pub = requests.get(f"{API}/config/public", timeout=10).json()
            assert pub["whatsapp_number"] == new_num
            assert pub["whatsapp_message"] == new_msg
        finally:
            requests.put(f"{API}/admin/config", headers=auth_headers,
                         json={"whatsapp_number": orig["whatsapp_number"],
                               "whatsapp_message": orig["whatsapp_message"]}, timeout=10)

    def test_admin_endpoints_require_auth(self):
        for path in ["/admin/stats", "/admin/activity", "/admin/presence",
                     "/admin/leads", "/admin/config"]:
            r = requests.get(f"{API}{path}", timeout=10)
            assert r.status_code in (401, 403), f"{path} -> {r.status_code}"
