# Davivienda Fan Shop – Frontend (Angular)

Aplicación SPA en Angular para la tienda de fanáticos de Davivienda. Incluye sitio público, flujo de carrito y checkout, y un panel de administración con gestión de productos, configuración de tasa de conversión y administración de puntos.

## Tecnologías
- Angular 12, RxJS 6
- SweetAlert2 para notificaciones
- Interceptor HTTP con JWT (Bearer) y guards de rutas

## Requisitos
- Node.js 14.x y npm 6.x (ver `engines` en `package.json`)
- Angular CLI 12 (`npm i -g @angular/cli@12` opcional)
- Backend expuesto vía REST (ver `apiUrl`)

## Configuración
Edita los entornos para apuntar al backend:
- Desarrollo: `src/environments/environment.ts` → `apiUrl: 'http://localhost:3010/api'`
- Producción: `src/environments/environment.prod.ts` → `apiUrl: 'https://api.tu-dominio.com'`

## Instalación y ejecución
1. Instalar dependencias: `npm install`
2. Desarrollo: `npm start` y abrir `http://localhost:4200/`
3. Compilar producción: `npm run build`
4. Pruebas unitarias: `npm test`

## Estructura relevante
- `src/app/core` – servicios, modelos, guards e interceptores
  - `services/` (`auth`, `product`, `cart`, `ordenes`, `puntos`, `configuracion`, `usuarios`)
  - `guards/` (`auth.guard`, `admin.guard`)
  - `interceptors/` (`auth.interceptor`)
- `src/app/features/public` – vistas públicas (inicio/checkout/confirmación)
- `src/app/features/admin` – panel admin (login, productos, tasa, puntos)
- `src/app/features/user` – dashboard de usuario

## Rutas principales
- Público: `/` (inicio), `/checkout`, `/confirmacion/:id`
- Admin: `/admin/login`, `/admin` (dashboard), `/admin/configuracion/(tasa|puntos)`
- Usuario: `/usuario/dashboard`

## Flujos clave
- Carrito: `CartService` (estado reactivo + persistencia local con fallback)
- Checkout: con puntos o dinero; tasa configurable vía `ConfiguracionService`
- Autenticación: `AuthService` maneja token/usuario; `AuthInterceptor` agrega `Authorization`
- Administración: CRUD de productos (subida de imágenes), ajuste de tasa y puntos

## Estándares de código
- Métodos documentados con comentarios JSDoc breves en español
- Servicios y componentes con nombres autoexplicativos y tipados estrictos

## Notas
- Asegúrate de que el `apiUrl` apunte a tu backend antes de probar el checkout
- Los toasts y diálogos usan SweetAlert2; ajusta mensajes/tiempos si lo requieres
