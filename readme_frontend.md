# MediCore: Sistema de Gestión de Citas Médicas
### Frontend Application · Angular Architecture

Este repositorio contiene el desarrollo del cliente web (Frontend) para **MediCore**, una plataforma orientada a la automatización, centralización y optimización del ciclo de atención al paciente en centros de salud. El sistema mitiga los problemas del registro manual mediante una interfaz intuitiva, reactiva y multi-rol.

---

## 🛠️ Stack Tecnológico y Estándares

El núcleo del frontend ha sido construido bajo las especificaciones técnicas modernas del ecosistema de desarrollo web:

| Componente | Tecnología | Propósito / Beneficio |
| :--- | :--- | :--- |
| **Framework Base** | Angular (v19+) | Arquitectura escalable mediante *Standalone Components* |
| **Manejo de Estado** | Angular Signals API | Reactividad nativa, óptimo rendimiento y eliminación de Zone.js |
| **Estilos y Layout** | Bootstrap 5 + SCSS | Diseño responsivo, consistencia visual y rejilla adaptativa profesional |
| **Componentes de UI** | @ng-bootstrap/ng-bootstrap | Componentes interactivos nativos integrados al ciclo de vida de Angular |
| **Control de Código** | Git & GitHub | Flujo de trabajo ordenado mediante metodología *Git Flow* |

---

## 📂 Arquitectura de Directorios (Clean Architecture)

El proyecto adopta un patrón de diseño modular por responsabilidades y desacoplado del backend, adaptando los principios de la arquitectura limpia en componentes independientes:

```text
src/app/
│
├── core/                           # Lógica global e invariable de la aplicación
│   ├── guards/                     # Guardianes de rutas para protección de accesos por rol
│   ├── interceptors/               # Interceptores HTTP (Gestión de Tokens y Headers)
│   ├── models/                     # Interfaces y tipos de datos TypeScript globales
│   └── services/                   # Servicios globales con Signals (ej. AuthService)
│
├── shared/                         # Componentes y utilitarias transversales reutilizables
│   ├── components/                 # Componentes genéricos de UI (Tablas, Modales, Botones)
│   └── pipes/                      # Transformadores de datos visuales de uso común
│
└── features/                       # Módulos de negocio divididos por contexto y actor
    ├── auth/                       # Flujos de Autenticación (Login, Registro)
    ├── paciente/                   # Dashboard del Paciente, Reserva de Citas e Historial
    ├── medico/                     # Agenda Médica, Gestión de Turnos y Registro de Diagnósticos
    └── admin/                      # Centro de Control, Gestión de Usuarios y Reportes



""## ⚙️ Requisitos del Sistema y Configuración

Siga los pasos a continuación para clonar, instalar y desplegar el entorno de desarrollo localmente.

### Prerrequisitos
* **Node.js**: Versión LTS estable recomendada (`>= 18.x.x` o `>= 20.x.x`)
* **Angular CLI**: Instalado de forma global en el sistema (`npm install -g @angular/cli`)

### Instrucciones de Despliegue

1. **Clonar el repositorio localmente:**
   ```bash
   git clone [https://github.com/TU_USUARIO/medicore-frontend.git](https://github.com/TU_USUARIO/medicore-frontend.git)
   cd medicore-frontend

2. **Instalar el árbol de dependencias del proyecto:**
   ```bash
   npm install

3. **Ejecutar el servidor de desarrollo local:**
   ```bash
   ng serve

4. **Acceso a la aplicación:**
   ```bash
   http://localhost:4200