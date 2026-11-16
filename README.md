# Juguetería Mágica — PWA

Aplicación web progresiva para administrar una tienda de juguetes. Incluye autenticación con correo/contraseña y Google, cuatro módulos CRUD y sincronización en tiempo real con Cloud Firestore.

## Módulos
- **Productos:** nombre, descripción, precio, existencia y categoría.
- **Categorías:** nombre y descripción.
- **Proveedores:** nombre/empresa, teléfono, correo y dirección.
- **Tareas:** título, descripción, fecha límite y estado completado.

## Requisitos
- Node.js 20 o superior (recomendado).
- Una cuenta de Google.
- Firebase en el plan gratuito **Spark**. No se requiere registrar tarjeta para estos servicios.

## 1. Crear y configurar Firebase
1. Entra a [Firebase Console](https://console.firebase.google.com/) y crea un proyecto en el plan Spark.
2. Agrega una aplicación web (icono `</>`), registra el nombre y copia la configuración del SDK.
3. En **Authentication → Sign-in method**, habilita **Correo electrónico/contraseña** y **Google**.
4. En **Firestore Database**, crea la base de datos en modo producción.
5. En la configuración de la app web copia los valores a un archivo `.env` en la raíz. Usa `.env.example` como guía. No subas `.env` a GitHub.
6. En Authentication → Settings → Authorized domains agrega el dominio local `localhost` y, después del despliegue, el dominio de Firebase Hosting.

Variables necesarias: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.

## 2. Ejecutar localmente
```bash
npm install
cp .env.example .env
# Edita .env y pega los valores de tu aplicación Firebase
npm run dev
```
Abre la URL que indique Vite (normalmente http://localhost:5173).

## 3. Reglas de seguridad
Las reglas están en `firestore.rules`. La estructura guarda datos bajo `usuarios/{uid}/{coleccion}/{documento}`. Las reglas permiten el acceso solo cuando `request.auth.uid == userId`; nunca se habilita lectura o escritura pública.

Publica las reglas:
```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

## 4. Desplegar en Firebase Hosting
```bash
npm run build
firebase init hosting
```
Al inicializar Hosting selecciona el proyecto creado, indica `dist` como directorio público, configura como aplicación de una sola página (rewrite a `index.html`) y no sobrescribas `index.html`. El archivo `firebase.json` incluido ya contiene la configuración esperada.

Vincula el proyecto si aún no lo hiciste:
```bash
firebase use --add
```
Finalmente:
```bash
firebase deploy
```
La URL aparecerá en la salida de Firebase CLI, normalmente `https://TU-PROJECT-ID.web.app`.

## 5. Probar sincronización en tiempo real
1. Abre la app en dos pestañas o ventanas.
2. Inicia sesión con la misma cuenta en ambas.
3. Crea o edita un registro en una pestaña.
4. Comprueba que el cambio aparece automáticamente en la otra, sin recargar.

Para comprobar aislamiento, inicia sesión con otra cuenta: no debe ver los registros de la primera.

## 6. Instalar como PWA
La app incluye manifest y service worker generados por `vite-plugin-pwa`. Ejecuta `npm run build` y despliega en Hosting (HTTPS). En Chrome/Edge usa el icono de instalación de la barra de direcciones o el menú **Instalar aplicación**.

## Estructura principal
```text
src/
  components/   # Layout, rutas protegidas y CRUD reutilizable
  data/         # Definición de campos de los cuatro módulos
  pages/        # Login y Dashboard
  state/        # Contexto de autenticación
  firebase.js   # Inicialización Firebase
  App.jsx
  main.jsx
public/
  toy.svg
firestore.rules
firebase.json
vite.config.js
```

## Consideraciones del plan Spark
Este proyecto utiliza Firebase Authentication, Cloud Firestore y Firebase Hosting. Mantén el proyecto en Spark y revisa los límites gratuitos vigentes en Firebase Console. No agregues un método de pago ni cambies a Blaze para realizar la práctica.

## Evidencias para la entrega
- URL pública de Firebase Hosting.
- URL del repositorio GitHub/GitLab.
- Captura de **Firestore → Rules** mostrando las reglas publicadas.
- Video de máximo 3 minutos: login, alta/edición/eliminación en CRUD, cambio en tiempo real en dos pestañas y PWA instalada.
