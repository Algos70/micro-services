"""Configuration settings for the application."""
import os

DATABASE_USER = os.getenv("DATABASE_USER",default="root")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD",default="root")
DATABASE_HOST = os.getenv("DATABASE_HOST",default="localhost")  # 'localhost' works if you're connecting from the host
DATABASE_NAME = os.getenv("DATABASE_NAME",default="orders_db")

SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}/{DATABASE_NAME}"
)

AUTHERIZATION_SERVER_URL = os.getenv("AUTHERIZATION_SERVER_URL",default="http://localhost")
AUTHORIZATION_SERVER_PORT = os.getenv("AUTHORIZATION_SERVER_PORT",default=5206)
AUTHORIZATION_SERVER_CUSTOMER_ENDPOINT = "/customer-policy"
AUTHORIZATION_SERVER_VENDOR_ENDPOINT = "/vendor-policy"
AUTHORIZATION_SERVER_ADMIN_ENDPOINT = "/admin-policy"