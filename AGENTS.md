# AGENTS.md — Reglas para agentes de IA en speak-app

> Proyecto personal de una sola persona (Carlos). Documento breve a propósito:
> claridad > longitud. No hay separación de roles planificador/ejecutor — el
> agente que lea esto trabaja directamente sobre el repo.

---

## Changelog

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| 1.0 | 2026-07-23 | Versión inicial, tras completar el upgrade de Capacitor 7 y resolver el aviso de cierre de cuenta de Google Play. |

---

## 1. Referencias obligatorias

Antes de actuar, lee:

- **`docs/MASTER.md`** — qué es esta app, su historia (TFG → reescritura desde
  cero → crisis de cuenta de Play Store) y el estado de ramas/tags.
- **`PLAY_STORE_ACTION_PLAN.md`** (raíz del repo) — checklist vivo y fechas
  límite activas de Google Play. Es volátil: comprueba la fecha de "última
  actualización" antes de asumir que sigue vigente, y actualízalo según avances.

---

## 2. Principios de esta app

- **El objetivo real casi nunca es "código perfecto".** Ahora mismo es no
  perder la cuenta de Google Play Developer. La app no tiene usuarios reales
  todavía, así que el riesgo no es romper su experiencia — es que Google Play
  rechace una actualización por un cambio arriesgado hecho con prisa.
- **Cambio mínimo que cumple el requisito, no el cambio "correcto" ideal.**
  Ante una fecha límite de Play Store, prioriza la solución de menor riesgo
  aunque deje deuda técnica (ver ejemplo en §3).
- **No hagas migraciones grandes por iniciativa propia** (saltos de versión
  mayor tipo Angular 17→21, o cualquier cambio que `npm audit fix` solo
  resuelva con `--force`). Señala que existen y pregunta antes de aplicarlas.
- **No borres ni fuerces el movimiento del tag `old-app`** ni reescribas
  historia que lo deje inalcanzable — es la última versión de la app original
  (con más funcionalidades que la actual) y Carlos la quiere consultable
  siempre. Ver `docs/MASTER.md` §2.
- **No borres las ramas remotas sueltas** (`Crear-acciones`, `Sugerencias`,
  `emojis`, `modo-simple`, `persistencia`) sin preguntar antes — son pendientes
  de revisión, no basura confirmada.
- **No hagas `git commit`/`git push` sin confirmación explícita** en la misma
  conversación, incluso si el cambio en sí parece de bajo riesgo.

---

## 3. Gotchas técnicos conocidos

- `npm install` requiere `--legacy-peer-deps`. No es un bug a "arreglar":
  `@ionic-native/core` (paquete antiguo usado para STT/TTS) exige
  `rxjs ^5.5||^6.5`, pero el proyecto usa `rxjs ~7.8.0` por Angular 17. No
  intentes eliminar el flag actualizando `@ionic-native/*` sin que se pida
  explícitamente — esos paquetes envuelven plugins Cordova concretos
  (`cordova-plugin-speechrecognition`, `cordova-plugin-tts`) y tocarlos es una
  migración en sí misma.
- Antes de dar por buena cualquier subida de dependencias, verifica con
  `npm run build` y `npx cap sync android` como mínimo. No asumas que el build
  nativo de Android funciona por CLI: en algunos equipos el JBR de Android
  Studio puede estar roto para uso desde terminal; si `gradlew`/Java fallan
  así, es un problema del equipo local, no del código — dile al usuario que lo
  compruebe abriendo el proyecto en Android Studio en vez de intentar reparar
  la instalación a ciegas.
- `main` y `migration` apuntaban al mismo commit tras un fast-forward
  (2026-07-23); no des por hecho que siguen divergiendo si vuelves a este repo
  más adelante — comprueba con `git log --oneline -5 main migration`.
