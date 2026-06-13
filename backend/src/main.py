from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.apis.auth_api import router as auth_router
from src.apis.usuario_api import router as usuario_router  
from src.apis.medico_api import router as medico_router
from src.apis.paciente_api import router as paciente_router
from src.apis.cita_api import router as cita_router

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

# Registro de rutas
app.include_router(auth_router)
app.include_router(usuario_router)  
app.include_router(medico_router)
app.include_router(paciente_router)
app.include_router(cita_router)

@app.get("/")
def read_root():
    return {"status": "online", "modulo": "MEDICORE API"}