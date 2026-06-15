from src.repository.paciente_repository import PacienteRepository
from src.schema.paciente_schema import PerfilPacienteUpdate

class PacienteService:
    
    def __init__(self):
        self.paciente_repository = PacienteRepository()

    def obtener_perfil_clinico(self, id_usuario_paciente: int) -> dict:
        """
        Solicita al repositorio los datos cruzados del paciente desde Supabase.
        """
        return self.paciente_repository.obtener_perfil_paciente(id_usuario_paciente)

    def modificar_perfil_clinico(self, id_usuario_paciente: int, data: PerfilPacienteUpdate) -> dict:
        """
        Modifica la información correspondiente en las tablas core y de negocio.
        """
        return self.paciente_repository.actualizar_perfil_paciente(id_usuario_paciente, data)