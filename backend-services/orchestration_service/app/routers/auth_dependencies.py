"""Authentication dependencies for routers."""
from fastapi import HTTPException, Request, Depends
from services.auth_http_client import get_auth_service, AuthenticationService
from logger import logger
# In your router dependencies:

from fastapi import Request, Depends

async def authenticate_user(
    request: Request,
    auth_service: AuthenticationService = Depends(get_auth_service)
):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # try each role; only catch 401s
    for role, method in [
        ("customer", auth_service.authenticate_customer),
        ("vendor",   auth_service.authenticate_vendor),
        ("admin",    auth_service.authenticate_admin),
    ]:
        try:
            await method(token)
            logger.info(f"Authenticated as {role}")
            return role
        except HTTPException as http_exc:
            # only retry on 401; any other status should bubble up
            if http_exc.status_code == 401:
                continue
            raise

    # if none succeeded
    raise HTTPException(status_code=401, detail="Invalid authentication token")