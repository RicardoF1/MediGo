from src.repository.medico_repository import (
    obtener_citas_por_medico,
    actualizar_estado_cita,
    obtener_perfil_medico,
    actualizar_perfil_medico
)
from src.schema.medico_schema import EstadoCitaUpdate, PerfilMedicoUpdate
from typing import List

class MedicoService:
    # ❌ BORRAMOS: El método __init__ y self.medico_repository ya no son necesarios

    def listar_agenda_medico(self, id_usuario_medico: int) -> List[dict]:
        # Capa lógica para el listado de citas usando la función directa
        return obtener_citas_por_medico(id_usuario_medico)

    def modificar_estado_cita(self, id_cita: int, data: EstadoCitaUpdate) -> dict:
        # Capa lógica para transiciones de estados clínicos usando la función directa
        return actualizar_estado_cita(id_cita, data) 

    # ===  PERFIL MÉDICO ===

    def obtener_perfil_clinico(self, id_usuario_medico: int) -> dict:
        """
        Solicita al repositorio el perfil aplanado del médico.
        Aquí podrías formatear textos adicionales si fuera necesario.
        """
        return obtener_perfil_medico(id_usuario_medico)

    def modificar_perfil_clinico(self, id_usuario_medico: int, data: PerfilMedicoUpdate) -> dict:
        """
        Procesa la actualización de datos personales y profesionales del médico.
        """
        return actualizar_perfil_medico(id_usuario_medico, data)