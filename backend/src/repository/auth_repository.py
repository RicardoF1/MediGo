from src.core.database import supabase
from typing import Optional

class AuthRepository:
    def obtener_usuario_por_correo(self, correo: str) -> Optional[dict]:
        # Consultamos la tabla usuarios, uniendo la tabla roles para traer el texto del rol
        resultado = supabase.table("usuarios") \
            .select("id_usuario, nombre, correo, password_hash, activo, roles(nombre_rol)") \
            .eq("correo", correo) \
            .eq("activo", True) \
            .execute()
        
        if len(resultado.data) == 0:
            return None
            
        return resultado.data[0]