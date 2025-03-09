from fastapi import FastAPI, Depends
from app.db.dependencies import get_db
from sqlalchemy.orm import Session

app = FastAPI()


@app.get("/")
async def root(db: Session = Depends(get_db)):
    return {"message": "Hello World"}