from main import SessionLocal, DBLeaderboardEntry, engine, Base

# Asegurar que las tablas existan
Base.metadata.create_all(bind=engine)

db = SessionLocal()

initial_data = [
    {"username": "SnakeMaster", "score": 300},
    {"username": "PythonDev", "score": 250},
    {"username": "Viper", "score": 100},
    {"username": "Ana", "score": 450},
    {"username": "Carlos", "score": 320},
    {"username": "Elena", "score": 150}
]

print("Agregando datos de prueba...")
for entry in initial_data:
    db_entry = DBLeaderboardEntry(username=entry["username"], score=entry["score"])
    db.add(db_entry)

db.commit()
db.close()
print("¡Datos agregados correctamente!")
