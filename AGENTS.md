# AGENTS.md — Reglas para agentes de IA en speak-app

> Proyecto personal de una sola persona (Carlos). Documento breve a propósito:
> claridad > longitud. Aquí solo está lo propio de este repositorio; todo lo
> general vive en las normas comunes.

- **Normas comunes:** `AGENTS-COMMON.md` — ver §0.1 del propio documento para
  localizarlo. Repositorio: https://github.com/iCbsp/agents-common
- **Modo:** individual
- **Trello:** este repositorio **no tiene tablero propio**, así que §5 del común
  no le aplica en lo que toca a "su" tablero y no hay `boardId` que declarar
  aquí. Sí lleva `.mcp.json` para poder operar tarjetas de otros tableros
  cuando el trabajo venga de fuera (p. ej. las de coordinación entre repos): el
  `boardId` se toma entonces de la tarjeta concreta que se esté trabajando, y
  se pasa explícito en cada llamada, como exige §5.1.

> Historia de estas normas —qué cambió y por qué— en
> [`AGENTS-changelog.md`](AGENTS-changelog.md). Se consulta antes de modificar
> una norma (común §7).

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
  rechace una actualización por un cambio arriesgado hecho con prisa. De ahí
  que la norma del cambio mínimo ante una fecha límite (común §1) pese aquí más
  que en otros proyectos.
- **No borres ni fuerces el movimiento del tag `old-app`** ni reescribas
  historia que lo deje inalcanzable — es la última versión de la app original
  (con más funcionalidades que la actual) y Carlos la quiere consultable
  siempre. Ver `docs/MASTER.md` §3.
- **Las ramas remotas sueltas de este repo son** `Crear-acciones`,
  `Sugerencias`, `emojis`, `modo-simple` y `persistencia`: experimentos de
  cuando aún se desarrollaba la app original, pendientes de revisión. El común
  (§4.1) ya prohíbe borrar ramas remotas sin preguntar; aquí quedan nombradas
  para que se sepa cuáles son.

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
  `npm run build` y `npx cap sync android` como mínimo.
- **El build nativo por Gradle/CLI no es verificable en el equipo actual**: el
  JBR que trae Android Studio está roto para uso desde terminal. Si `gradlew` o
  `java` fallan por ahí, no es el código — pídele al usuario que lo compruebe
  abriendo el proyecto en Android Studio.
