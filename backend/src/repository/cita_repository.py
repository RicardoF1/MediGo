from src.core.database import supabase
from src.schema.cita_schema import ReservaCitaRequest

class CitaRepository:

    def listar_especialidades(self) -> list:
        """Trae el catálogo de especialidades disponibles."""
        res = supabase.table("especialidades").select("id_especialidad, nombre_especialidad").execute()
        return [
            {"idEspecialidad": x["id_especialidad"], "nombreEspecialidad": x["nombre_especialidad"]}
            for x in res.data
        ]

    def listar_medicos_por_especialidad(self, id_especialidad: int) -> list:
        """Trae médicos activos de una especialidad con su consultorio y datos de usuario."""
        res = supabase.table("medicos") \
            .select("""
                id_medico,
                consultorio,
                usuarios (nombre)
            """) \
            .eq("id_especialidad", id_especialidad) \
            .eq("activo_para_citas", True) \
            .execute()

        medicos_mapeados = []
        for m in res.data:
            user_data = m.get("usuarios", {}) or {}
            medicos_mapeados.append({
                "idMedico": m["id_medico"],
                "nombre": user_data.get("nombre", "Especialista"),
                "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200",
                # Simulamos turnos por ahora o puedes leerlos si tienes tabla de horarios
                "disponibilidad": ["08:00", "09:30", "11:00", "14:30", "16:00"] 
            })
        return medicos_mapeados

    def obtener_id_paciente_por_usuario(self, id_usuario: int) -> int:
        respuesta = supabase.table("pacientes").select("id_paciente").eq("id_usuario", id_usuario).execute()
        return respuesta.data[0].get("id_paciente") if respuesta.data else None

    def crear_reserva_cita(self, id_paciente: int, datos: ReservaCitaRequest) -> int:
        # 1. Buscamos el ID real de 'PENDIENTE' en la tabla maestra
        estado_res = supabase.table("estados_cita") \
            .select("id_estado_cita") \
            .eq("nombre_estado", "PENDIENTE") \
            .execute()
            
        if not estado_res.data:
            raise Exception("El estado 'PENDIENTE' no está registrado en estados_cita.")
            
        id_estado_pendiente = estado_res.data[0].get("id_estado_cita")

        # 2. Insertamos usando la estructura exacta de tu tabla 'citas'
        respuesta = supabase.table("citas") \
            .insert({
                "id_paciente": id_paciente,
                "id_medico": datos.medicoId,
                "fecha": str(datos.fecha),
                "hora": datos.hora,          # Enviará el formato de hora (ej: "10:00")
                "motivo": datos.motivoConsulta, 
                "id_estado": id_estado_pendiente 
            }) \
            .execute()

        if not respuesta.data:
            raise Exception("Error interno al insertar fila en la tabla citas.")
            
        return respuesta.data[0].get("id_cita")