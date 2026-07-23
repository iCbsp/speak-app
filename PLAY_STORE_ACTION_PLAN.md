# Plan de acción: mantener la cuenta de Google Play Developer (2026)

Última actualización: 2026-07-23

## Contexto
- Cuenta de Play Console: Carlos Santiago Portas.
- Motivo del aviso recibido: **inactividad** de la cuenta (no se ha publicado/mantenido ninguna app), no un tema de política de target API directamente.
- **Fecha límite 1 — 2 de agosto de 2026:** para evitar el cierre de la cuenta hay que:
  1. Verificar email y teléfono en Play Console → Detalles de la cuenta.
  2. Publicar una app nueva o una actualización de una ya existente en Google Play.
- **Fecha límite 2 — 31 de agosto de 2026 (independiente, política de target API level):** la app debe orientarse a **Android 16 (API level 36)** o superior. A partir de esa fecha, si el target API tiene más de un año de antigüedad respecto a la última versión de Android, **no se podrán publicar más actualizaciones** de la app (distinto del cierre de cuenta, pero bloquea el mantenimiento futuro). El nivel actual (35) deja de cumplir justo ese día.
- La app **no tiene usuarios reales** todavía. El riesgo no es "romper la experiencia de usuarios", sino que Google Play rechace el build por incumplir alguna política al subir la actualización. Por eso se decidió evitar cambios grandes/arriesgados (ver más abajo).

## Estado actual del código (rama `migration`)
Cambios ya en progreso **antes** de esta sesión (sin commitear, se generaron en otra sesión/dispositivo):
- `targetSdkVersion`/`compileSdkVersion` → 35 (Android 15)
- AGP → 8.11.2, Gradle wrapper → 8.13
- Capacitor core/android/clipboard → 7.4.2
- `versionCode` 2 / `versionName` "1.2" (antes 1 / "1.1")

Cambios hechos **en esta sesión** (23 jul 2026, tampoco commiteados todavía):
- El upgrade de Capacitor estaba a medias: `@capacitor/app`, `@capacitor/haptics`, `@capacitor/keyboard`, `@capacitor/status-bar` seguían en v6.0.0 (exigen `@capacitor/core ^6.0.0`), lo que rompía `npm install` con ERESOLVE. Se fijaron a las últimas 7.x compatibles: `app@7.1.2`, `haptics@7.0.5`, `keyboard@7.0.6`, `status-bar@7.0.6`.
- Confirmado: el proyecto ya requería `--legacy-peer-deps` desde antes (independiente de este fix), porque `@ionic-native/core@5.36.0` pide `rxjs ^5.5||^6.5` y el proyecto usa `rxjs ~7.8.0`.
- `npm install --legacy-peer-deps` funciona sin errores.
- `npm run build` (ng build) compila correctamente.
- `npx cap sync android` funciona: detecta los 5 plugins Capacitor en v7 + 2 plugins Cordova (`cordova-plugin-speechrecognition`, `cordova-plugin-tts`).
- `npm audit fix` (sin `--force`, sin breaking changes) bajó las vulnerabilidades npm de **106 a 59**. Se reverificó el build después y sigue compilando bien.
- **No verificado:** build nativo de Android por Gradle/CLI. El JBR (Java embebido) de Android Studio en esta máquina está roto — falta `C:\Program Files\Android\Android Studio\jbr\lib\jvm.cfg`. Hay que abrir el proyecto directamente en Android Studio (usa su propio runtime) para hacer el Gradle Sync y compilar/probar ahí.

## Decisión: NO hacer la migración mayor de Angular ahora
Quedan 59 vulnerabilidades npm que solo se resuelven con `npm audit fix --force`, lo que implicaría saltar Angular 17 → 21 (4 versiones mayores) más otras herramientas de build (`@angular/cli`, `@angular-eslint`, etc.).
- **Por qué no:** alto riesgo/alto esfuerzo para el objetivo actual (evitar el cierre de cuenta); la mayoría son `devDependencies` (herramientas de build tipo webpack/eslint, no se empaquetan en la app final), así que el riesgo real para la app en producción es bajo.
- Revisar esto en el futuro, sin presión de fecha límite.

## Checklist pendiente
1. [x] Verificar email y teléfono en Play Console → Detalles de la cuenta. *(Confirmado por el usuario el 23 jul 2026: revisado, todo ok.)*
2. [ ] Abrir el proyecto en Android Studio, Gradle Sync, probar la app en un dispositivo/emulador (confirmar que Capacitor 7 + targetSdk 35 no rompe nada nativo).
3. [ ] Comprobar en Play Console el último `versionCode`/`versionName` publicado y confirmar que 2 / "1.2" es superior (si no, subirlo en `android/app/build.gradle`).
4. [ ] Generar bundle firmado (Android Studio → Build → Generate Signed App Bundle) y subirlo como nueva release en el canal de **producción** antes del **2 de agosto de 2026**. Dejar margen para la revisión de Google — no esperar al último día, subir en los próximos 2-3 días si es posible.
5. [ ] Antes del **31 de agosto de 2026**: actualizar `targetSdkVersion`/`compileSdkVersion` en `android/variables.gradle` de 35 a 36 (Android 16), comprobar compatibilidad de Capacitor 7.4.2 con API 36 (puede requerir bump de Capacitor/AGP), y publicar otra actualización en producción (se puede probar antes en pruebas internas/cerradas/abiertas).
6. [ ] (Opcional, solo si es rápido) Revisar las Dependabot alerts en github.com/iCbsp/speak-app/security/dependabot y contrastarlas con lo visto en `npm audit` — muchas deberían coincidir con las 59 restantes.
7. [ ] Decidir si commitear y pushear los cambios ya hechos (fix Capacitor v7 + `npm audit fix`) — pendiente de confirmación del usuario en la sesión que generó este documento.

## Cómo retomar esto en otro dispositivo
- Este archivo vive en el repo (rama `migration`): `PLAY_STORE_ACTION_PLAN.md`.
- Si al leer esto los cambios de `package.json`/`package-lock.json` de esta sesión **no** están commiteados/pusheados, hay que rehacerlos manualmente:
  ```
  # en package.json, dependencies:
  "@capacitor/app": "^7.1.2"
  "@capacitor/haptics": "^7.0.5"
  "@capacitor/keyboard": "^7.0.6"
  "@capacitor/status-bar": "^7.0.6"

  npm install --legacy-peer-deps
  npm audit fix
  npm run build   # debe compilar sin errores
  npx cap sync android
  ```
