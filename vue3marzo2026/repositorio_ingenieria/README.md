# Repositorio de Ingeniería — Trabajo Final Módulo 6

Aplicación web desarrollada con **Vue 3 + Vite** como trabajo final del Módulo 6 del Diplomado Fullstack USIP.

Permite gestionar proyectos de ingeniería eléctrica y sus documentos técnicos por etapa, con flujo de aprobación, buscador, filtros y autenticación de usuarios.

---

## Tecnologías

- Vue 3 (Composition API, `<script setup>`)
- Vite
- Vue Router 4 (rutas dinámicas, protección de rutas)
- Axios
- JSON Server + JSON Server Auth
- Bootstrap 5
- Variables de entorno (`.env`)

---

## Entidades del sistema

| Entidad | Descripción |
|---------|-------------|
| **Proyectos** | Proyectos de ingeniería eléctrica |
| **Documentos** | Planos y documentos técnicos por etapa |
| **Etapas** | Fases del proyecto (Diseño, Adquisición, Montaje, etc.) |
| **Estados** | Flujo de aprobación de documentos |

---

## Requisitos previos

- Node.js `>= 20.19.0` o `>= 22.12.0`
- npm

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/JPrawk/Mod6-USIP-JPguzman-Trabajo-final.git
cd Mod6-USIP-JPguzman-Trabajo-final/vue3marzo2026/repositorio_ingenieria
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la carpeta `repositorio_ingenieria/`:

```
VITE_API_URL=http://localhost:3000
VITE_TIMEOUT=3000
```

### 4. Ejecutar el proyecto

El comando `npm run dev` levanta simultáneamente el **frontend (Vite)** y el **servidor backend** usando `concurrently`:

```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3000](http://localhost:3000)

---

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia frontend + backend juntos |
| `npm run server` | Solo el backend (JSON Server) en puerto 3000 |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Vista previa del build de producción |

---

## Usuario de prueba

El archivo `db.json` incluye un usuario administrador para comenzar:

| Campo | Valor |
|-------|-------|
| Email | `admin@email.com` |
| Password | `123456` |

---

## Funcionalidades implementadas

- **CRUD completo** de Proyectos y Documentos
- **Relación** entre entidades: Proyectos → Documentos → Etapas
- **Filtro** de documentos por etapa y por estado
- **Buscador** de proyectos (nombre/cliente) y documentos (título/proyecto)
- **Ruta dinámica**: `/proyectos/:id/documentos/:docId/editar`
- **Variables de entorno**: `VITE_API_URL`, `VITE_TIMEOUT`
- **Autenticación**: registro, login, token JWT, logout
- **Protección de rutas**: `meta: { requiresAuth: true }` + `router.beforeEach`
- **Diseño responsivo** con Bootstrap 5

---

## Autor

**Juan P. Guzman** — Diplomado Fullstack USIP, Módulo 6
