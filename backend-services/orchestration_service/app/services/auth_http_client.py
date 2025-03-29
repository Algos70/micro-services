"""
http client for authentication service
"""
import httpx

class AuthHttpClient:
    def verify_customer(self, customer_id: str) -> bool:
        try:
            resp = httpx.post("http://auth-service/auth/verify", json={"customer_id": customer_id})
            return resp.status_code == 200
        except Exception:
            return False
