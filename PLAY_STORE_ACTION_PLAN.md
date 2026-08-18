# Plan de acción: mantener la cuenta de Google Play Developer (2026)

Última actualización: 2026-08-18 (trabajo integrado en `main`; la rama
`play-store-2026-api36` cumplió su propósito y se ha cerrado)

## Contexto
- Cuenta de Play Console: Carlos Santiago Portas.
- Motivo del aviso original: **inactividad** de la cuenta (no se había publicado/mantenido ninguna app), no un tema de política de target API directamente.
- **Fecha límite 1 — 2 de agosto de 2026 — ✅ RESUELTA.** Se publicó `versionCode 3` / `versionName "1.3"` (targetSdk 35) en producción antes de la fecha límite. La cuenta ya no está en riesgo de cierre por inactividad.
- **Foco actual — Fecha límite 2 — 31 de agosto de 2026 (política de target API level, independiente de la anterior):** la app debe orientarse a **Android 16 (API level 36)** o superior. A partir de esa fecha, si el target API tiene más de un año de antigüedad respecto a la última versión de Android, **no se podrán publicar más actualizaciones** de la app (no cierra la cuenta, pero bloquea el mantenimiento futuro). El nivel actual (35) deja de cumplir justo ese día. Play Console permite solicitar una prórroga si hiciera falta más tiempo — no se ha solicitado todavía, se intentará cumplir el plazo original primero.
- La app **no tenía usuarios reales** en el momento de la crisis original, aunque la versión publicada sí llegó a estar disponible en ~20.000 dispositivos (ver punto 3 del checklist histórico) — no descartar del todo el impacto en usuarios reales al hacer cambios. El riesgo principal sigue siendo que Google Play rechace el build por incumplir alguna política. Por eso se decidió evitar cambios grandes/arriesgados (ver más abajo).

## Estado actual del código
Todo lo siguiente ya está commiteado en `main`:
- `targetSdkVersion`/`compileSdkVersion` → 36 (Android 16), subido desde 35 el 15 ago 2026 para cumplir la fecha límite del 31 ago 2026.
- AGP → 8.11.2, Gradle wrapper → 8.13 (soportan API 36 sin bump adicional).
- Capacitor completo en la línea 7.x: core/android/clipboard/cli → 7.4.2, app → 7.1.2, haptics → 7.0.5, keyboard → 7.0.6, status-bar → 7.0.6 (el upgrade había quedado a medias — algunos paquetes en v6 rompían `npm install` con ERESOLVE — y se completó).
- El proyecto requiere `npm install --legacy-peer-deps` (no es un bug: `@ionic-native/core@5.36.0` pide `rxjs ^5.5||^6.5` y el proyecto usa `rxjs ~7.8.0`). Ver `AGENTS.md`.
- `npm run build`, `npx cap sync android` y la app probada en Android Studio funcionan correctamente con targetSdk 36.
- `npm audit fix` (sin `--force`, sin breaking changes) bajó las vulnerabilidades npm de 106 a 59 (51 según el último escaneo de Dependabot en GitHub); tras reinstalar `node_modules` el 15 ago 2026, `npm audit` marca 66 (6 low, 18 moderate, 41 high, 1 critical) — no verificado aún si es una regresión real o solo drift de versions desde el último audit, revisar en el punto 7 del checklist.
- `versionCode`/`versionName` subidos a `4`/`"1.4"` (ver punto 5 del checklist).
- Build nativo por Gradle/CLI directo no verificable en este equipo (JBR de Android Studio roto para uso desde terminal — ver `AGENTS.md`), pero sí verificado abriendo el proyecto en Android Studio.

## Decisión: NO hacer la migración mayor de Angular ahora
Quedan 59 vulnerabilidades npm que solo se resuelven con `npm audit fix --force`, lo que implicaría saltar Angular 17 → 21 (4 versiones mayores) más otras herramientas de build (`@angular/cli`, `@angular-eslint`, etc.).
- **Por qué no:** alto riesgo/alto esfuerzo para el objetivo actual (evitar el cierre de cuenta); la mayoría son `devDependencies` (herramientas de build tipo webpack/eslint, no se empaquetan en la app final), así que el riesgo real para la app en producción es bajo.
- Revisar esto en el futuro, sin presión de fecha límite.

## Checklist pendiente
1. [x] Verificar email y teléfono en Play Console → Detalles de la cuenta. *(Confirmado por el usuario el 23 jul 2026: revisado, todo ok.)*
2. [x] Abrir el proyecto en Android Studio, Gradle Sync, probar la app en un dispositivo/emulador. *(Confirmado por el usuario: la app funciona perfectamente con Capacitor 7 + targetSdk 35.)*
3. [x] Comprobar en Play Console el último `versionCode`/`versionName` publicado. *(Resultado: la producción actual es `versionCode 2` / `versionName "1.2"`, publicada el 29 jul 2025, `targetSdk 35`, 100% de despliegue, ~20.152 dispositivos. Coincidía exactamente con el `versionCode`/`versionName` del build local — Play Console habría rechazado la subida por no ser estrictamente superior. Se ha subido a `versionCode 3` / `versionName "1.3"` en `android/app/build.gradle`.)*
4. [x] Generar el bundle firmado y subirlo como nueva release en el canal de **producción**. *(Resuelto: primer intento generó el bundle sin firmar por error en el wizard de Android Studio — hay que marcar "release" en el paso de selección de variante del propio wizard "Generate Signed Bundle", no basta con el panel de Build Variants. Repetido correctamente, enviado a revisión y aprobado antes del 2 de agosto de 2026. Cuenta a salvo de cierre por inactividad.)*
5. [x] **Deadline 31 de agosto de 2026.** `targetSdkVersion`/`compileSdkVersion` actualizados de 35 a 36 (Android 16) en `android/variables.gradle`. AGP 8.11.2 y Gradle 8.13 ya soportaban API 36 sin necesidad de bump adicional de Capacitor/AGP. `npm run build` y `npx cap sync android` verificados sin errores; Gradle Sync y prueba en dispositivo/emulador en Android Studio confirmados por el usuario el 15 ago 2026. `versionCode`/`versionName` subidos a `4`/`"1.4"` en `android/app/build.gradle`.
6. [x] Generar el bundle firmado y publicarlo en producción. *(Hecho el 15 ago 2026: `versionCode 4`/`versionName "1.4"`, targetSdk 36, enviado a revisión, superado el examen preliminar de Play Console. Pendiente de que Google confirme que la app ya no está afectada por la política de target API — no requiere más acción por nuestra parte, solo esperar la notificación.)*
7. [ ] (Opcional, sin urgencia) Revisar las Dependabot alerts en github.com/iCbsp/speak-app/security/dependabot y contrastarlas con lo visto en `npm audit` — muchas deberían coincidir con las 51-59 restantes (nota: tras reinstalar `node_modules` el 15 ago 2026 el recuento subió a 66, ver "Estado actual del código").
8. [x] Commitear y pushear los cambios de esta tarea (bump API 36 + `versionCode`/`versionName` 4/"1.4"). *(Hecho en el commit `d6587c6`, pusheado. El 18 ago 2026 se comprobó que el punto seguía marcado como pendiente cuando ya estaba resuelto — corregido.)*

## Backlog — auditoría de cumplimiento (después de resolver lo urgente)
Detectado el 23 jul 2026 mientras el usuario hacía un curso oficial de Google Play para otra app: es probable que a speak-app le falten piezas de cumplimiento que Google Play exige para **cualquier app publicada**, tenga o no usuarios activos. No verificado todavía el estado real en Play Console — solo confirmar y actuar cuando ya no haya presión de fecha límite encima:
- Política de privacidad con URL declarada en Play Console → Contenido de la app.
- Formulario de seguridad de los datos ("Data safety") completo y actualizado.
- Declaración/justificación del permiso `RECORD_AUDIO` (usado por `cordova-plugin-speechrecognition`).
- Si `google-services.json` está en uso (Firebase u otro SDK de terceros): declarar la compartición de datos con terceros correspondiente.

## Cómo retomar esto en otro dispositivo
- Este archivo vive en el repo, en `main`: `PLAY_STORE_ACTION_PLAN.md`. Ver también `docs/MASTER.md` para el contexto/historia y `AGENTS.md` para las reglas de trabajo en este repo.
- Todo el código de esta sesión ya está commiteado y pusheado — no hace falta rehacer nada, solo `git checkout main` y `npm install --legacy-peer-deps`.
