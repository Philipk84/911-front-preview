# FitCampus 911 - Frontend React

Frontend construido con React, Vite, JavaScript y Material UI para consumir el API REST del proyecto 911.

## Estilo visual

El diseño copia la identidad que ya tenía el backend en Thymeleaf:

- Fuente Montserrat.
- Fondo azul/lila pastel.
- Login con franjas laterales rosadas y amarillas.
- Tarjetas crema `#FAF4E4`.
- Botones verdes `#9EB16F`.
- Acciones rosadas `#F3C1D9`.
- Decoraciones SVG reutilizadas desde `src/main/resources/static/img` del backend.

## Estructura

```txt
src/
  api/client.js
  auth/AuthContext.jsx
  components/
    Navbar/Navbar.jsx
    ProtectedRoute/ProtectedRoute.jsx
    Decor/Decor.jsx
    Entity/
  config/entities.js
  hooks/
  pages/
    LoginPage.jsx
    DashboardLayout.jsx
    DashboardPage.jsx
    EntityPage.jsx
  services/
  utils/
```

## Variables de entorno

Copia `.env.example` como `.env`.

Para desplegar como el ejemplo compartido:

```env
VITE_APP_BASE_PATH=/iaslab/compu2/911/
VITE_ROUTER_BASENAME=/iaslab/compu2/911
VITE_API_BASE_URL=/iaslab/compu2/911-api
```

Para correr local contra Spring Boot:

```env
VITE_APP_BASE_PATH=/
VITE_ROUTER_BASENAME=/
VITE_API_BASE_URL=http://localhost:8080/exercise
```

## Ejecutar

```bash
npm install
npm run dev
```

## Compilar

```bash
npm run build
```

## Login

El login consume:

```txt
POST /api/public/auth/login
```

El token se guarda en `localStorage` como `fitcampus_session` y se envía en cada petición con:

```txt
Authorization: Bearer <accessToken>
```


## Login REST

El backend no recibe `username`; recibe `email` y `password` en este endpoint:

```http
POST <VITE_API_BASE_URL>/api/public/auth/login
```

Body correcto:

```json
{
  "email": "hernando.ospina@fitcampus.co",
  "password": "admin123"
}
```

Si el servidor responde `401`, significa credenciales incorrectas para el login. El frontend ya muestra ese caso como `Correo o contraseña incorrectos`, no como sesión expirada.

Si estás en local, usa:

```env
VITE_API_BASE_URL=http://localhost:8080/exercise
```

Si estás desplegando detrás de Nginx como en el ejemplo, usa la ruta proxy que apunte al backend real:

```env
VITE_API_BASE_URL=/iaslab/compu2/911-api
```
