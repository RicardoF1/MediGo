from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.database import supabase  # Importamos el cliente conectado

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

@app.get("/")
def test_supabase_connection():
    try:
        # Intentamos hacer una consulta rápida a la tabla roles
        response = supabase.table("roles").select("*").execute()
        
        return {
            "status": "Conexión Exitosa con Supabase 🚀",
            "datos_recibidos": response.data
        }
    except Exception as e:
        return {
            "status": "Error de Conexión ❌",
            "detalle": str(e)
        }