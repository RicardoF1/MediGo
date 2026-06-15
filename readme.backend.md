# 🩺 MediGo API - Backend Server

Este es el núcleo del servidor para el **Sistema de Gestión Hospitalaria MediGo**, desarrollado con **FastAPI** y configurado bajo una arquitectura limpia y desacoplada de tres capas: **API ➔ Service ➔ Repository**.

La persistencia de datos está centralizada en **Supabase (PostgreSQL)**, estructurada y normalizada rigurosamente hasta la **Tercera Forma Normal (3FN)**.

---

## 🛠️ Stack Tecnológico

* **Runtime / Engine:** Python 3.11+ gestionado eficientemente con [uv](https://github.com/astral-sh/uv).
* **Framework Web:** FastAPI (Asíncrono, nativo con tipado estricto y alto rendimiento).
* **Base de Datos / BaaS:** Supabase + PostgreSQL.
* **Autenticación:** JWT (PyJWT) con criptografía de credenciales vía Bcrypt.
* **Validación de Datos:** Pydantic v2.

---

## 📂 Arquitectura del Proyecto

El backend se rige bajo una separación estricta de responsabilidades para garantizar el mantenimiento y la escalabilidad del sistema:

```text
backend/
├── src/
│   ├── apis/          # Capa de Controladores HTTP (Endpoints, Rutas y Dependencias)
│   │   ├── auth_api.py
│   │   ├── medico_api.py
│   │   └── usuario_api.py
│   ├── core/          # Configuraciones Globales, Conexiones y Seguridad Core
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   ├── repository/    # Capa de Acceso a Datos (Consultas directas a Supabase)
│   │   ├── auth_repository.py
│   │   ├── medico_repository.py
│   │   └── usuario_repository.py
│   ├── schema/        # Esquemas de Pydantic (Validación y tipado de payloads de entrada/salida)
│   │   ├── auth_schema.py
│   │   ├── medico_schema.py
│   │   └── usuario_schema.py
│   ├── services/      # Capa de Servicios (Lógica de negocio y validación de Reglas TI)
│   │   ├── auth_service.py
│   │   ├── medico_service.py
│   │   └── usuario_service.py
│   └── main.py        # Punto de entrada de la aplicación y montaje de routers globales
├── pyproject.toml     # Declaración de dependencias y empaquetamiento del proyecto
└── uv.lock            # Lockfile optimizado y congelado por el gestor uv
```

---

## 🗄️ Estructura del Modelo Relacional (Supabase / 3FN)

El sistema opera sobre PostgreSQL mapeando las relaciones físicas mediante llaves foráneas para evitar la redundancia de datos:

### Tablas Catálogo / Maestros:

* **roles:** Define los accesos del ecosistema ('ADMINISTRADOR', 'MEDICO', 'PACIENTE').
* **especialidades:** Mapea las ramas de atención médica (ej: 'Medicina General').
* **estados_cita:** Controla los estados transaccionales ('PENDIENTE', 'COMPLETADA', 'CANCELADA').

### Tabla Core de Autenticación:

* **usuarios:** Almacena el correo, estados de activación y contraseñas cifradas.

### Entidades Especializadas (Extensiones Relacionales 1:1):

* **medicos:** Enlazado a usuarios y especialidades. Registra la colegiatura profesional (CMP) y consultorio.
* **pacientes:** Enlazado a usuarios. Registra DNI, fecha de nacimiento, teléfono e historial clínico único.

### Tabla Transaccional:

* **citas:** Vincula pacientes, médicos y estados. Cuenta con una restricción técnica de unicidad (`uq_medico_fecha_hora`) para impedir cruces de agenda en el mismo espacio de tiempo.

### Módulo de Vigilancia TI:

* **auditoria_accesos:** Registro inmutable de IPs, eventos de autenticación (LOGIN_EXITOSO, LOGIN_FALLIDO) y marcas de tiempo.

---

## 🚀 Configuración y Despliegue Local

### 1. Instalar el Gestor de Paquetes uv

Asegúrate de contar con uv instalado para garantizar el aprovisionamiento instantáneo del entorno virtual de Python.

```bash
# Instalación en Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex

# Instalación en macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

### 2. Variables de Entorno (.env)

Crea un archivo llamado `.env` en la raíz del directorio `backend/` e introduce tus credenciales correspondientes:

```env
SUPABASE_URL="https://tu-proyecto.supabase.co"
SUPABASE_KEY="tu-anon-key-de-supabase-aqui"
JWT_SECRET="tu-clave-secreta-altamente-segura-para-firmar-tokens"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

### 3. Sincronizar e Instalar el Entorno

```bash
uv sync
```

---

### 4. Lanzar el Servidor en Desarrollo

```bash
uv run uvicorn src.main:app --reload
```

El servidor estará disponible en:
👉 http://127.0.0.1:8000

---

## 📑 Documentación de la API (OpenAPI)

Accede a la documentación interactiva:

* **Swagger UI:** http://127.0.0.1:8000/docs
* **ReDoc:** http://127.0.0.1:8000/redoc

---

## 🛡️ Control de Acceso y Seguridad de Endpoints

Los módulos restringidos están protegidos mediante `HTTPBearer` de FastAPI.

Cada petición debe incluir el token JWT:

```plaintext
Authorization: Bearer <TU_TOKEN_JWT_GENERADO_EN_EL_LOGIN>
```

El servidor utiliza `SecurityHandler.decodificar_jwt` para:

* Validar expiración del token
* Extraer el ID del usuario
* Aislar consultas por sesión
* Evitar accesos no autorizados

Esto garantiza que ningún usuario pueda acceder o modificar información que no le pertenece.
