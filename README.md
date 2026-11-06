# ICPC Tracker

**Taller 02 — Introducción al Desarrollo Web/Móvil**

ICPC Tracker es una aplicación web *full stack* para llevar un registro personal de problemas de programación competitiva de plataformas como Codeforces, LeetCode y CSES. Permite organizar los problemas registrados, consultar su estado y visualizar un resumen del progreso.

El proyecto separa el frontend desarrollado con Angular del backend construido con FastAPI. Ambos se comunican mediante una API REST, mientras que PostgreSQL almacena la información de forma persistente.

## Integrantes

- Juan Alvarado
- Harold Ramos
- Cristian Pérez
- Gabriel Astudillo

## Funcionalidades

- Registro e inicio de sesión de usuarios mediante autenticación JWT.
- Gestión de problemas: crear, consultar, editar y eliminar registros.
- Filtrado de problemas por plataforma y estado.
- Visualización de estadísticas sobre los problemas registrados.
- Acceso a funcionalidades protegidas mediante autenticación.

## Tecnologías

| Capa | Tecnologías |
| --- | --- |
| Frontend | Angular, Angular Material, TypeScript |
| Backend | Python, FastAPI |
| Base de datos | PostgreSQL |
| Persistencia | SQLAlchemy (ORM) |
| Autenticación | JWT y bcrypt para el hash de contraseñas |

## Estructura del proyecto

```text
WebMovil-Taller2/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── routers/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   └── src/
│       └── app/
│           ├── components/
│           ├── pages/
│           ├── services/
│           ├── guards/
│           ├── interceptors/
│           └── models/
└── README.md
```

El archivo `backend/.env` contiene la configuración local y no debe incluirse en el repositorio.

## Requisitos previos

Antes de ejecutar el proyecto, instala las siguientes herramientas:

- [Git](https://git-scm.com/).
- [Python](https://www.python.org/downloads/) 3.10 o superior.
- [PostgreSQL](https://www.postgresql.org/download/) 14 o superior.
- [Node.js](https://nodejs.org/) 22.12 o una versión compatible con el Angular del proyecto (incluye npm).

No es necesario instalar Angular CLI de forma global: se puede ejecutar la versión del proyecto mediante `npx`.

## Instalación y ejecución

### 1. Obtener el proyecto

Reemplaza `URL_DEL_REPOSITORIO` por la dirección de GitHub y clona el proyecto:

```bash
git clone URL_DEL_REPOSITORIO
cd WebMovil-Taller2
```

Si ya tienes el proyecto descargado, abre una terminal en su directorio raíz y continúa con el siguiente paso.

### 2. Configurar la base de datos

Asegúrate de que PostgreSQL esté en ejecución. Abre **SQL Shell (psql)** o conéctate mediante:

```bash
psql -U postgres
```

Crea la base de datos:

```sql
CREATE DATABASE tracker;
```

Las tablas `users` y `problems` se crean automáticamente al iniciar el backend, según la configuración descrita para el proyecto.

### 3. Configurar y ejecutar el backend

Desde la raíz del proyecto:

```bash
cd backend
python -m venv venv
```

Activa el entorno virtual según tu sistema operativo:

**Windows (PowerShell):**

```powershell
venv\Scripts\Activate.ps1
```

**Linux/macOS:**

```bash
source venv/bin/activate
```

Instala las dependencias:

```bash
python -m pip install -r requirements.txt
```

Copia el archivo de ejemplo para crear `backend/.env`:

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

**Linux/macOS:**

```bash
cp .env.example .env
```

Configura las variables de entorno en el archivo `.env`:

```dotenv
DATABASE_URL=postgresql+psycopg2://postgres:TU_PASSWORD@localhost:5432/tracker
JWT_SECRET=TU_SECRETO_ALEATORIO
JWT_EXPIRE_MINUTES=60
```

- `DATABASE_URL`: conexión a PostgreSQL. Reemplaza `TU_PASSWORD` por tu contraseña local; si contiene caracteres especiales, codifícalos para usarlos en una URL.
- `JWT_SECRET`: clave secreta utilizada para firmar los tokens JWT. Genera una clave aleatoria con el siguiente comando:

  ```bash
  python -c "import secrets; print(secrets.token_hex(32))"
  ```

- `JWT_EXPIRE_MINUTES`: tiempo de vigencia del token, expresado en minutos.

Inicia el servidor desde la carpeta `backend`:

```bash
uvicorn app.main:app --reload
```

El backend estará disponible en:

- **API:** http://localhost:8000
- **Documentación interactiva (Swagger UI):** http://localhost:8000/docs

### 4. Configurar y ejecutar el frontend

Abre **otra terminal** y, desde la raíz del proyecto, ejecuta:

```bash
cd frontend
npm install
npx ng serve
```

Abre la aplicación en **http://localhost:4200**. Para utilizarla, mantén en ejecución tanto el frontend como el backend.

## Uso de la aplicación

1. Ingresa a `http://localhost:4200` y registra una cuenta.
2. Inicia sesión con tus credenciales.
3. En la sección **Problemas**, agrega, consulta, edita o elimina registros. También puedes filtrarlos por plataforma y estado.
4. En **Estadísticas**, consulta el resumen de tus problemas registrados.

## API REST

Los siguientes son los endpoints principales descritos para el backend:

| Método | Endpoint | Descripción | Autenticación |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Registrar un usuario | No |
| `POST` | `/auth/login` | Iniciar sesión y obtener un JWT | No |
| `GET` | `/problems` | Listar problemas y aplicar filtros | Sí |
| `GET` | `/problems/{id}` | Consultar un problema | Sí |
| `POST` | `/problems` | Registrar un problema | Sí |
| `PUT` | `/problems/{id}` | Actualizar un problema | Sí |
| `DELETE` | `/problems/{id}` | Eliminar un problema | Sí |

Puedes explorar la documentación y probar las operaciones desde **http://localhost:8000/docs** con el backend en ejecución.

## Problemas frecuentes

| Problema | Qué revisar |
| --- | --- |
| `password authentication failed` | Comprueba el usuario y la contraseña de `DATABASE_URL`. |
| `database "tracker" does not exist` | Crea la base de datos indicada en el paso 2. |
| `psql` no se reconoce | Abre SQL Shell (psql) o agrega PostgreSQL al `PATH`. |
| `ng` no se reconoce | Ejecuta `npm install` en `frontend` y utiliza `npx ng serve`. |
| Error de CORS o conexión a la API | Comprueba que FastAPI esté en el puerto 8000 y que la configuración de comunicación con Angular sea correcta. |

## Seguridad

No subas al repositorio archivos `.env`, contraseñas reales, secretos JWT ni otras credenciales. Para compartir la configuración necesaria, utiliza únicamente `backend/.env.example` con valores de ejemplo.
