from src.core.database import supabase
from typing import List, Optional

class UsuarioRepository:
    def listar_todos(self) -> List[dict]:
        # Trae todos los usuarios registrados
        resultado = supabase.table("usuarios") \
            .select("id_usuario, nombre, correo, id_rol, activo, creado_en") \
            .order("id_usuario", desc=False) \
            .execute()
        return resultado.data

    def buscar_por_correo(self, correo: str) -> Optional[dict]:
        resultado = supabase.table("usuarios") \
            .select("*") \
            .eq("correo", correo) \
            .execute()
        if len(resultado.data) == 0:
            return None
        return resultado.data[0]

    def crear_usuario(self, datos_usuario: dict) -> dict:
        # Inserta el nuevo usuario
        resultado = supabase.table("usuarios") \
            .insert(datos_usuario) \
            .select("id_usuario, nombre, correo, id_rol, activo, creado_en") \
            .execute()
        return resultado.data[0]