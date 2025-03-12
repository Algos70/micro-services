"""Configuration settings for the application."""

DATABASE_USER = "root"
DATABASE_PASSWORD = "root"
DATABASE_HOST = "localhost"  # 'localhost' works if you're connecting from the host
DATABASE_NAME = "orders_db"

SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}/{DATABASE_NAME}"
)