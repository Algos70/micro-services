"""Configuration settings for the application."""

DATABASE_USER = "root"
DATABASE_PASSWORD = "root"
DATABASE_HOST = "localhost"  # 'localhost' works if you're connecting from the host
DATABASE_NAME = "payments_db"

SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}/{DATABASE_NAME}"
)

AUTHERIZATION_SERVER_URL = "http://localhost"
AUTHORIZATION_SERVER_PORT = 5206
AUTHORIZATION_SERVER_CUSTOMER_ENDPOINT = "/customer-policy"
AUTHORIZATION_SERVER_VENDOR_ENDPOINT = "/vendor-policy"
AUTHORIZATION_SERVER_ADMIN_ENDPOINT = "/admin-policy"