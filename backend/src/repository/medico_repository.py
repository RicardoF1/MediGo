from src.core.database import supabase
from src.schema.medico_schema import EstadoCitaUpdate
from typing import List

class MedicoRepository:
    
    def obtener_citas_por_medico(self, id_usuario_medico: int) -> List[dict]:
        """
        1. Busca el id_medico correspondiente al id_usuario logueado.
        2. Trae sus citas cruzando los datos del paciente y el estado de la cita.
        """
        # Primero obtenemos el id_medico usando el id_usuario del token
        medico_res = supabase.table("medicos") \
            .select("id_medico") \
            .eq("id_usuario", id_usuario_medico) \
            .execute()
            
        if not medico_res.data:
            return []
            
        id_medico = medico_res.data[0]["id_medico"]

        # Traemos las citas cruzando relaciones con la sintaxis de Supabase
        respuesta = supabase.table("citas") \
            .select("""
                id_cita,
                fecha,
                hora,
                motivo,
                id_paciente,
                pacientes (
                    usuarios (
                        nombre
                    )
                ),
                estados_cita (
                    nombre_estado
                )
            """) \
            .eq("id_medico", id_medico) \
            .order("fecha") \
            .execute()

        # Aplanamos el JSON estructurado para cumplir con el esquema del Frontend
        citas_formateadas = []
        for item in respuesta.data:
            paciente_data = item.get("pacientes", {})
            usuario_data = paciente_data.get("usuarios", {}) if paciente_data else {}
            nombre_paciente = usuario_data.get("nombre", "Paciente Desconocido") if usuario_data else "Paciente Desconocido"
            
            estado_data = item.get("estados_cita", {})
            nombre_estado = estado_data.get("nombre_estado", "PENDIENTE") if estado_data else "PENDIENTE"

            # === TRADUCCIÓN CLAVE PARA EL FRONTEND ===
            # Si en la base de datos dice COMPLETADA, se lo enviamos a Angular como ATENDIDA
            if nombre_estado == "COMPLETADA":
                nombre_estado = "ATENDIDA"

            citas_formateadas.append({
                "id_cita": item["id_cita"],
                "id_paciente": item["id_paciente"],
                "paciente_nombre": nombre_paciente,
                "fecha": item["fecha"],
                "hora": str(item["hora"]),  
                "estado": nombre_estado, # Aquí ya viaja "ATENDIDA" impecable
                "motivo": item["motivo"] or "Sin motivo especificado"
            })
            
        return citas_formateadas

    def actualizar_estado_cita(self, id_cita: int, data: EstadoCitaUpdate) -> dict:
        """
        Actualiza el id_estado y retorna la cita completamente aplanada con 
        los nombres de las relaciones para que el Frontend se refresque al instante.
        """
        # 1. Ejecutamos la actualización del catálogo
        supabase.table("citas") \
            .update({"id_estado": data.id_estado}) \
            .eq("id_cita", id_cita) \
            .execute()
            
        # 2. Recuperamos esa única cita con sus cruzamientos limpios
        respuesta = supabase.table("citas") \
            .select("""
                id_cita,
                fecha,
                hora,
                motivo,
                id_paciente,
                pacientes (
                    usuarios (
                        nombre
                    )
                ),
                estados_cita (
                    nombre_estado
                )
            """) \
            .eq("id_cita", id_cita) \
            .execute()

        if not respuesta.data:
            return {}

        item = respuesta.data[0]
        
        # Aplanamos exactamente igual que en listar para mantener la consistencia
        paciente_data = item.get("pacientes", {})
        usuario_data = paciente_data.get("usuarios", {}) if paciente_data else {}
        nombre_paciente = usuario_data.get("nombre", "Paciente Desconocido") if usuario_data else "Paciente Desconocido"
        
        estado_data = item.get("estados_cita", {})
        nombre_estado = estado_data.get("nombre_estado", "PENDIENTE") if estado_data else "PENDIENTE"

        if nombre_estado == "COMPLETADA":
            nombre_estado = "ATENDIDA"

        return {
            "id_cita": item["id_cita"],
            "id_paciente": item["id_paciente"],
            "paciente_nombre": nombre_paciente,
            "fecha": item["fecha"],
            "hora": str(item["hora"]),
            "estado": nombre_estado,
            "motivo": item["motivo"] or "Sin motivo especificado"
        }