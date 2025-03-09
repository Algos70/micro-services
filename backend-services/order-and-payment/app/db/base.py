""" Database base class """
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import SQLALCHEMY_DATABASE_URL

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True  # Helps to test connections before using them
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
