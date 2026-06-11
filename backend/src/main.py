from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.apis.auth_api import router as auth_router

app = FastAPI(
    title="MEDICORE API",
    description="Backend de Gestión Hospitalaria en Arquitectura Multicapa",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos las rutas del módulo de autenticación
app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"status": "online", "modulo": "MEDICORE API"}