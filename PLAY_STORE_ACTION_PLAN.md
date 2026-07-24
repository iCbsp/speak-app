# Plan de acción: mantener la cuenta de Google Play Developer (2026)

Última actualización: 2026-07-23 (rama activa: `play-store-2026-api36`)

## Contexto
- Cuenta de Play Console: Carlos Santiago Portas.
- Motivo del aviso recibido: **inactividad** de la cuenta (no se ha publicado/mantenido ninguna app), no un tema de política de target API directamente.
- **Fecha límite 1 — 2 de agosto de 2026:** para evitar el cierre de la cuenta hay que:
  1. Verificar email y teléfono en Play Console → Detalles de la cuenta.
  2. Publicar una app nueva o una actualización de una ya existente en Google Play.
- **Fecha límite 2 — 31 de agosto de 2026 (independiente, política de target API level):** la app debe orientarse a **Android 16 (API level 36)** o superior. A partir de esa fecha, si el target API tiene más de un año de antigüedad respecto a la última versión de Android, **no se podrán publicar más actualizaciones** de la app (distinto del cierre de cuenta, pero bloquea el mantenimiento futuro). El nivel actual (35) deja de cumplir justo ese día.
- La app **no tiene usuarios reales** todavía. El riesgo no es "romper la experiencia de usuarios", sino que Google Play rechace el build por incumplir alguna política al subir la actualización. Por eso se decidió evitar cambios grandes/arriesgados (ver más abajo).

## Estado actual del código
Todo lo siguiente ya está commiteado y pusheado (en `main` y en la rama activa `play-store-2026-api36`):
- `targetSdkVersion`/`compileSdkVersion` → 35 (Android 15)
- AGP → 8.11.2, Gradle wrapper → 8.13
- Capacitor completo en la línea 7.x: core/android/clipboard/cli → 7.4.2, app → 7.1.2, haptics → 7.0.5, keyboard → 7.0.6, status-bar → 7.0.6 (el upgrade había quedado a medias — algunos paquetes en v6 rompían `npm install` con ERESOLVE — y se completó).
- El proyecto requiere `npm install --legacy-peer-deps` (no es un bug: `@ionic-native/core@5.36.0` pide `rxjs ^5.5||^6.5` y el proyecto usa `rxjs ~7.8.0`). Ver `AGENTS.md`.
- `npm run build`, `npx cap sync android` y la app probada en Android Studio funcionan correctamente.
- `npm audit fix` (sin `--force`, sin breaking changes) bajó las vulnerabilidades npm de 106 a 59 (51 según el último escaneo de Dependabot en GitHub).
- `versionCode`/`versionName` subidos a `3`/`"1.3"` (ver punto 3 del checklist).
- Build nativo por Gradle/CLI directo no verificable en este equipo (JBR de Android Studio roto para uso desde terminal — ver `AGENTS.md`), pero sí verificado abriendo el proyecto en Android Studio.

## Decisión: NO hacer la migración mayor de Angular ahora
Quedan 59 vulnerabilidades npm que solo se resuelven con `npm audit fix --force`, lo que implicaría saltar Angular 17 → 21 (4 versiones mayores) más otras herramientas de build (`@angular/cli`, `@angular-eslint`, etc.).
- **Por qué no:** alto riesgo/alto esfuerzo para el objetivo actual (evitar el cierre de cuenta); la mayoría son `devDependencies` (herramientas de build tipo webpack/eslint, no se empaquetan en la app final), así que el riesgo real para la app en producción es bajo.
- Revisar esto en el futuro, sin presión de fecha límite.

## Checklist pendiente
1. [x] Verificar email y teléfono en Play Console → Detalles de la cuenta. *(Confirmado por el usuario el 23 jul 2026: revisado, todo ok.)*
2. [x] Abrir el proyecto en Android Studio, Gradle Sync, probar la app en un dispositivo/emulador. *(Confirmado por el usuario: la app funciona perfectamente con Capacitor 7 + targetSdk 35.)*
3. [x] Comprobar en Play Console el último `versionCode`/`versionName` publicado. *(Resultado: la producción actual es `versionCode 2` / `versionName "1.2"`, publicada el 29 jul 2025, `targetSdk 35`, 100% de despliegue, ~20.152 dispositivos. Coincidía exactamente con el `versionCode`/`versionName` del build local — Play Console habría rechazado la subida por no ser estrictamente superior. Se ha subido a `versionCode 3` / `versionName "1.3"` en `android/app/build.gradle`.)*
4. [ ] Tras el bump de versión: volver a hacer Gradle Sync en Android Studio (para que recoja `versionCode 3`/`"1.3"`) y generar el bundle firmado (Build → Generate Signed App Bundle). Subirlo como nueva release en el canal de **producción** antes del **2 de agosto de 2026**. Dejar margen para la revisión de Google — no esperar al último día, subir en los próximos 2-3 días si es posible. **Importante:** esta release sube de propósito solo lo ya probado (Capacitor 7 + targetSdk 35 + bump de versión) — el salto a API 36 (punto 5) se deja para una release aparte, para no mezclar dos cambios sin testear juntos bajo presión de fecha.
5. [ ] Antes del **31 de agosto de 2026**: actualizar `targetSdkVersion`/`compileSdkVersion` en `android/variables.gradle` de 35 a 36 (Android 16), comprobar compatibilidad de Capacitor 7.4.2 con API 36 (puede requerir bump de Capacitor/AGP), y publicar otra actualización en producción (se puede probar antes en pruebas internas/cerradas/abiertas).
6. [ ] (Opcional, solo si es rápido) Revisar las Dependabot alerts en github.com/iCbsp/speak-app/security/dependabot y contrastarlas con lo visto en `npm audit` — muchas deberían coincidir con las 51-59 restantes.
7. [x] Commitear y pushear los cambios (fix Capacitor v7 + `npm audit fix` + `AGENTS.md`/`CLAUDE.md`/`docs/MASTER.md`). Hecho el 23 jul 2026.

## Cómo retomar esto en otro dispositivo
- Este archivo vive en el repo, en `main` y en la rama de trabajo activa `play-store-2026-api36`: `PLAY_STORE_ACTION_PLAN.md`. Ver también `docs/MASTER.md` para el contexto/historia y `AGENTS.md` para las reglas de trabajo en este repo.
- Todo el código de esta sesión ya está commiteado y pusheado — no hace falta rehacer nada, solo `git checkout play-store-2026-api36` y `npm install --legacy-peer-deps`.
