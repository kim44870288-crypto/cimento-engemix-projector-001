"""Tests for /whatsapp fix: public config endpoint + admin config update + activity tracking."""
import os
import time
import pytest
import requests

from dotenv import load_dotenv
load_dotenv("/app/frontend/.env")
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
assert BASE_URL, "REACT_APP_BACKEND_URL missing"
ADMIN_EMAIL = "donas@gmail.com"
ADMIN_PASSWORD = "Seinao@123"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=15,
    )
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data
    return data["token"]


@pytest.fixture(scope="module")
def original_config(admin_token):
    r = requests.get(
        f"{BASE_URL}/api/admin/config",
        headers={"Authorization": f"Bearer {admin_token}"},
        timeout=15,
    )
    assert r.status_code == 200
    return r.json()


class TestPublicConfig:
    def test_public_config_no_auth(self):
        r = requests.get(f"{BASE_URL}/api/config/public", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "whatsapp_number" in data
        assert "whatsapp_message" in data
        assert isinstance(data["whatsapp_number"], str)
        assert isinstance(data["whatsapp_message"], str)


class TestAdminConfigUpdateReflectsPublic:
    def test_update_number_and_message_reflects_in_public(self, admin_token, original_config):
        new_number = "+55 (11) 98765-4321"
        new_message = "Olá TEST! Quero um orçamento com acentuação çãá."
        r = requests.put(
            f"{BASE_URL}/api/admin/config",
            json={"whatsapp_number": new_number, "whatsapp_message": new_message},
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=15,
        )
        assert r.status_code == 200, r.text

        # verify persistence via public
        r2 = requests.get(f"{BASE_URL}/api/config/public", timeout=15)
        assert r2.status_code == 200
        data = r2.json()
        # backend may store as-is or clean; either way the value should map to same digits
        digits = "".join(c for c in data["whatsapp_number"] if c.isdigit())
        assert digits == "5511987654321"
        assert data["whatsapp_message"] == new_message

        # restore
        requests.put(
            f"{BASE_URL}/api/admin/config",
            json={
                "whatsapp_number": original_config.get("whatsapp_number", "554121122023"),
                "whatsapp_message": original_config.get(
                    "whatsapp_message", "Olá! Gostaria de solicitar um orçamento."
                ),
            },
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=15,
        )


class TestActivityTracking:
    def test_track_whatsapp_open_appears_in_activity(self, admin_token):
        # Fire track event as the frontend does
        r = requests.post(
            f"{BASE_URL}/api/track/event",
            json={"type": "whatsapp_open", "page": "/whatsapp", "session_id": "test-session-xyz", "meta": {"source": "open_app"}},
            timeout=15,
        )
        assert r.status_code in (200, 201, 204), r.text
        time.sleep(1.0)

        r2 = requests.get(
            f"{BASE_URL}/api/admin/activity?limit=50",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=15,
        )
        assert r2.status_code == 200
        items = r2.json()
        # items may be list or object
        if isinstance(items, dict):
            items = items.get("items") or items.get("data") or []
        types = [i.get("type") for i in items if isinstance(i, dict)]
        assert "whatsapp_open" in types, f"whatsapp_open not found in activity types: {types[:10]}"
