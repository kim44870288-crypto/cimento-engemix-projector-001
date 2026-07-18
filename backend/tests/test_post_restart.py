"""Post-restart health verification tests."""
import os
import requests
import pytest

BASE = os.environ.get("REACT_APP_BACKEND_URL", "https://link-cleaner.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "donas@gmail.com"
ADMIN_PASS = "Seinao@123"


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{BASE}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS}, timeout=15)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data
    assert data["user"]["email"] == ADMIN_EMAIL
    return data["token"]


@pytest.fixture
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


def test_health():
    r = requests.get(f"{BASE}/api/", timeout=10)
    assert r.status_code == 200
    j = r.json()
    assert j.get("message") == "Engemix API"
    assert j.get("ok") is True


def test_public_config():
    r = requests.get(f"{BASE}/api/config/public", timeout=10)
    assert r.status_code == 200
    j = r.json()
    assert "whatsapp_number" in j


def test_auth_me(auth_headers):
    r = requests.get(f"{BASE}/api/auth/me", headers=auth_headers, timeout=10)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


def test_admin_leads_persisted(auth_headers):
    r = requests.get(f"{BASE}/api/admin/leads", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    data = r.json()
    leads = data.get("items", data) if isinstance(data, dict) else data
    assert isinstance(leads, list)
    # Container restart persistence check
    assert len(leads) >= 3, f"expected >=3 leads, got {len(leads)}"
    names = [l.get("nome") or l.get("name", "") for l in leads]
    print(f"Leads found: {names}")
    for expected in ["Test User", "Teste QA", "teste"]:
        assert expected in names, f"missing {expected}"


def test_admin_stats(auth_headers):
    r = requests.get(f"{BASE}/api/admin/stats", headers=auth_headers, timeout=10)
    assert r.status_code == 200
    j = r.json()
    assert isinstance(j, dict)


def test_admin_activity(auth_headers):
    r = requests.get(f"{BASE}/api/admin/activity?limit=10", headers=auth_headers, timeout=10)
    assert r.status_code == 200
    data = r.json()
    items = data.get("items", data) if isinstance(data, dict) else data
    assert isinstance(items, list)


def test_admin_config(auth_headers):
    r = requests.get(f"{BASE}/api/admin/config", headers=auth_headers, timeout=10)
    assert r.status_code == 200
    j = r.json()
    assert "whatsapp_number" in j


def test_create_lead_regression(auth_headers):
    payload = {
        "nome": "TEST_PostRestart",
        "telefone": "11999998888",
        "email": "test_postrestart@example.com",
        "cargo": "QA",
    }
    r = requests.post(f"{BASE}/api/leads", json=payload, timeout=15)
    assert r.status_code in (200, 201), f"{r.status_code} {r.text}"

    # verify appears in admin
    r2 = requests.get(f"{BASE}/api/admin/leads", headers=auth_headers, timeout=15)
    assert r2.status_code == 200
    data = r2.json()
    leads = data.get("items", data) if isinstance(data, dict) else data
    assert any((l.get("nome") or l.get("name")) == "TEST_PostRestart" for l in leads)
