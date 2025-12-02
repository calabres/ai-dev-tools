from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import time
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

import os

# Configuración de Base de Datos
# Por defecto usa SQLite, pero permite sobreescribir con variable de entorno (para Docker/Postgres)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Modelo de Base de Datos
class DBLeaderboardEntry(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    score = Column(Integer)

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuración de CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic (para la API)
class UserLogin(BaseModel):
    username: str

class User(BaseModel):
    id: int
    username: str

class ScoreSubmission(BaseModel):
    username: str
    score: int

class LeaderboardEntry(BaseModel):
    username: str
    score: int

    class Config:
        from_attributes = True

# Dependencia para obtener la sesión de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/login", response_model=User)
async def login(user_login: UserLogin):
    # Simular delay de red
    # time.sleep(0.5) 
    return User(id=int(time.time()), username=user_login.username)

@app.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(db: Session = Depends(get_db)):
    # Obtener todos los registros, ordenar por puntaje descendente
    entries = db.query(DBLeaderboardEntry).order_by(DBLeaderboardEntry.score.desc()).limit(10).all()
    return entries

@app.post("/score")
async def submit_score(submission: ScoreSubmission, db: Session = Depends(get_db)):
    # Crear nuevo registro
    db_entry = DBLeaderboardEntry(username=submission.username, score=submission.score)
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return {"message": "Score submitted successfully"}
