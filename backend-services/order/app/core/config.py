"""Configuration settings for the application."""

DATABASE_USER = "myuser"
DATABASE_PASSWORD = "mypassword"
DATABASE_HOST = "localhost"  # 'localhost' works if you're connecting from the host
DATABASE_NAME = "orders_db"

SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}/{DATABASE_NAME}"
)