import os
from fastapi import FastAPI, Depends
from db.dependencies import get_db
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
from db.base import engine, Base
from entity import payment
from api.endpoints import payments


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    print("Database connected")
    yield  

app = FastAPI(lifespan=lifespan)
app.include_router(payments.router)

@app.get("/")
async def root(db: Session = Depends(get_db)):
    return {"message": "Hello World"}