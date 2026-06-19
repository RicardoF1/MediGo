from src.repository.paciente_repository import (
    obtener_perfil_paciente, 
    actualizar_perfil_paciente
)
from src.schema.paciente_schema import PerfilPacienteUpdate

class PacienteService:

    def obtener_perfil_clinico(self, id_usuario_paciente: int) -> dict:
        """
        Solicita al repositorio los datos cruzados del paciente desde Supabase.
        """
        # 🔄 CORREGIDO: Llamada directa a la función importada
        return obtener_perfil_paciente(id_usuario_paciente)

    def modificar_perfil_clinico(self, id_usuario_paciente: int, data: PerfilPacienteUpdate) -> dict:
        """
        Modifica la información correspondiente en las tablas core y de negocio.
        """
        # 🔄 CORREGIDO: Llamada directa a la función importada
        return actualizar_perfil_paciente(id_usuario_paciente, data)