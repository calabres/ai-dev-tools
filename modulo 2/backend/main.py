from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import time

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

# Modelos
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

# Datos en memoria (simulando base de datos)
leaderboard_data = [
    {"username": "SnakeMaster", "score": 300},
    {"username": "PythonDev", "score": 250},
    {"username": "Viper", "score": 100}
]

@app.post("/login", response_model=User)
async def login(user_login: UserLogin):
    # Simular delay de red
    # time.sleep(0.5) 
    return User(id=int(time.time()), username=user_login.username)

@app.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard():
    # Ordenar por puntaje descendente
    return sorted(leaderboard_data, key=lambda x: x['score'], reverse=True)

@app.post("/score")
async def submit_score(submission: ScoreSubmission):
    leaderboard_data.append(submission.dict())
    # Mantener solo los top 10 (opcional, pero buena práctica)
    leaderboard_data.sort(key=lambda x: x['score'], reverse=True)
    if len(leaderboard_data) > 10:
        leaderboard_data.pop()
    return {"message": "Score submitted successfully"}
