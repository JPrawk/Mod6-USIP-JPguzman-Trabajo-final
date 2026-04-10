# 📝 Proyecto TODO - Vue 3 + JSON Server Auth

## 📌 Descripción

Este proyecto forma parte del módulo de **Vue 3** del Diplomado Fullstack.  
Tiene como objetivo desarrollar una aplicación web moderna tipo **TODO**, donde los usuarios puedan gestionar tareas de manera eficiente.

La aplicación permite realizar operaciones CRUD, autenticación de usuarios y consumo de API, aplicando buenas prácticas de desarrollo frontend.

---

## 🎯 Objetivos del Proyecto

- Aplicar conceptos de Vue 3 (Composition API / Options API)
- Consumir APIs REST usando Axios
- Implementar autenticación con JSON Server Auth
- Gestionar rutas públicas y protegidas
- Utilizar variables de entorno
- Desarrollar una interfaz moderna y responsiva

---

## 🧩 Funcionalidades

### 🔐 Autenticación
- Registro de usuarios
- Inicio de sesión
- Manejo de token (JWT)
- Protección de rutas

### 📋 Gestión de tareas (TODO)
- Crear tarea
- Listar tareas
- Editar tarea
- Eliminar tarea


### 🔎 Búsqueda y filtros
- Buscador de tareas por titulo y contenido
- Filtro por completado

### 🧭 Navegación
- Rutas públicas y privadas
- Ruta dinámica 

---

## 🛠️ Tecnologías utilizadas

- Vue 3
- Vite
- Axios
- Vue Router
- JSON Server Auth
- CSS / SCSS

---

## ⚙️ Configuración del entorno

Crear un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=http://localhost:3000
```

---

## 💻 Instalación del proyecto

```
npm install
```

---

## 🚀 Ejecución en desarrollo

```
npm run dev
```

---

## 🏗️ Compilación para producción

```
npm run build
```

---

## 🗄️ Backend (JSON Server Auth)

El proyecto incluye un archivo `db.json` que simula la base de datos.

### Instalar json server version 0.17.1

```
npm install -g  json-server@0.17.1
```

```
npm install -g json-server-auth@2.1.0
```

### ▶️ Ejecutar backend

```
json-server-auth db.json --port 3000 -r routes.json
```

---


## 📚 Recomendaciones

### IDE
- VS Code + extensión Vue (Volar)
- Deshabilitar Vetur

### Navegador
- Vue Devtools
- Activar Custom Object Formatter

---

## 👨‍💻 Autor

Proyecto desarrollado como parte del Diplomado Fullstack.


