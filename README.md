# Taller 02 - Int. al Desarrollo Web/Móvil

## Integrantes

* Juan Alvarado
* Harold Ramos
* Cristian Pérez
* Gabriel Astudillo



Aplicación web full stack: \*\*ICPC Tracker\*\*, un registro personal de problemas de programación competitiva (Codeforces, LeetCode, CSES, etc.).



\## Tecnologías

\- \*\*Frontend:\*\* Angular + Angular Material

\- \*\*Backend:\*\* FastAPI (Python)

\- \*\*Base de datos:\*\* PostgreSQL con SQLAlchemy (ORM)

\- \*\*Autenticación:\*\* JWT, contraseñas con bcrypt



\## Requisitos previos



| Herramienta | Versión mínima | Instalación | Comprobar |

|---|---|---|---|

| Git | cualquiera reciente | https://git-scm.com | `git --version` |

| Python | 3.10 (recomendada) | https://www.python.org/downloads | `python --version` |

| PostgreSQL | 14 (recomendada) | https://www.postgresql.org/download | `psql --version` |

| Node.js | 22.12 | https://nodejs.org (versión LTS) | `node --version` |

| Angular CLI | 22 | `npm install -g @angular/cli` | `ng version` |



Notas:

\- Al instalar PostgreSQL se pide una contraseña para el usuario `postgres`. Anótala: se usa en el `.env`.

\- Si `psql` no se reconoce en la terminal, usa "SQL Shell (psql)" desde el buscador de Windows.



\## Estructura del proyecto



```

WebMovil-Taller2/

├── backend/

│   ├── requirements.txt

│   ├── .env                  (local, NO se sube al repo)

│   └── app/

│       ├── main.py

│       ├── database/

│       ├── models/

│       ├── schemas/

│       ├── services/

│       └── routers/

├── frontend/

│   └── src/app/

│       ├── components/

│       ├── pages/

│       ├── services/

│       ├── guards/

│       ├── interceptors/

│       └── models/

└── README.md

```



\## 1. Base de datos



1\. Abre \*\*SQL Shell (psql)\*\* y presiona Enter cuando te pregunten: `Server`, `Database`, `Port` y `Username` para dejar los valores por defecto.

2\. Escribe tu contraseña de PostgreSQL (no se ve al escribir).

3\. Crea la base de datos:



```sql

CREATE DATABASE tracker;

```



4\. Comprueba que existe con `\\\\l` (debe aparecer `tracker`).



Las tablas (`users` y `problems`) se crean automáticamente al iniciar el backend.



Para revisar los datos guardados: para entrar a la base de datos "\\c tracker" y luego "SELECT \* FROM problems;" para ver los problemas creados



\## 2. Backend



Desde la raíz del repo:



bash

cd backend

python -m venv venv

venv\\Scripts\\activate

pip install -r requirements.txt



En Linux/Mac, la activación es `source venv/bin/activate`.



\### Variables de entorno



Crea el archivo `.env` dentro de backend (junto a `requirements.txt`)
con este contenido:



```

DATABASE\\\_URL=postgresql+psycopg2://postgres:(TU\\\_CLAVE)@localhost:5432/tracker

JWT\\\_SECRET=PEGA\\\_AQUI\\\_UN\\\_SECRETO\\\_ALEATORIO(64 caracteres aleatorios hexadecimal)

JWT\\\_EXPIRE\\\_MINUTES=60

```



\- Reemplaza (TU\_CLAVE) por la contraseña de PostgreSQL (sin parentesis ni espacios).

\- Genera el secreto con:



```bash

python -c "import secrets; print(secrets.token\\\_hex(32))"

```



El archivo `.env` no debe subirse nunca al repositorio.



\### Ejecutar



```bash

uvicorn app.main:app --reload

```



\- API: http://localhost:8000

\- Documentación interactiva: http://localhost:8000/docs



\### Librerías del backend (`requirements.txt`)



| Librería | Uso |

|---|---|

| fastapi | Framework de la API REST |

| uvicorn\[standard] | Servidor para ejecutar FastAPI |

| sqlalchemy | ORM para acceder a la base de datos |

| psycopg2-binary | Driver de PostgreSQL |

| pydantic\[email] | Validación de datos y emails |

| python-dotenv | Lectura del archivo `.env` |

| bcrypt | Hash seguro de contraseñas |

| PyJWT | Creación y validación de tokens JWT |



\## 3. Frontend



En \*\*otra terminal\*\*, desde la raíz del repo:



```bash

cd frontend

npm install

ng serve

```



La aplicación queda disponible en http://localhost:4200





\## 4. Uso



1\. Mantén el backend (puerto 8000) y el frontend (puerto 4200) corriendo al mismo tiempo.

2\. Entra a http://localhost:4200 y crea una cuenta en \*\*Registro\*\*.

3\. En \*\*Problemas\*\* puedes agregar, editar, eliminar y filtrar por plataforma y estado.

4\. En \*\*Estadísticas\*\* se ve el resumen de tus problemas.



\## Endpoints principales



| Método | Ruta | Descripción | Requiere token |

|---|---|---|---|

| POST | `/auth/register` | Registrar usuario | No |

| POST | `/auth/login` | Iniciar sesión (devuelve JWT) | No |

| GET | `/problems` | Listar problemas (filtros: `plataforma`, `estado`) | Sí |

| GET | `/problems/{id}` | Obtener un problema | Sí |

| POST | `/problems` | Crear problema | Sí |

| PUT | `/problems/{id}` | Modificar problema | Sí |

| DELETE | `/problems/{id}` | Eliminar problema | Sí |



\## Solución de problemas



| Error | Causa probable |

|---|---|

| `password authentication failed` | La clave en `DATABASE\\\_URL` está mal |

| `database "tracker" does not exist` | Falta crear la base de datos (sección 1) |

| `'ng' no se reconoce` | Falta instalar Angular CLI |

| Error de CORS en el navegador | El backend no está corriendo o el frontend no usa el puerto 4200 |

