# MASTER.md — speak-app

> **Fuente de verdad estable del proyecto.** Contiene la historia, el porqué y
> el estado de ramas/tags. Lo volátil (fechas límite activas, checklist en
> curso) vive en [`PLAY_STORE_ACTION_PLAN.md`](../PLAY_STORE_ACTION_PLAN.md),
> en la raíz del repo — enlazado desde aquí, no duplicado.
> Reglas de comportamiento de agentes: ver [AGENTS.md](../AGENTS.md).

> Historia de este documento —qué cambió y por qué— en
> [`MASTER-changelog.md`](MASTER-changelog.md).

---

## 1. Qué es speak-app

App Android de comunicación aumentativa/alternativa (síntesis de voz y
reconocimiento de voz — TTS/STT) construida con Ionic + Angular + Capacitor.
Publicada en Google Play bajo la cuenta de desarrollador de Carlos.

## 2. Historia

- Origen: TFG (Trabajo de Fin de Grado) de Carlos, hace varios años. La app
  original acumuló bastantes más funcionalidades de las que tiene la versión
  actual (perfiles, organización, acciones configurables, etc. — ver
  `NOTES - *.txt` y el código en el tag `old-app`).
- Con el tiempo, sus dependencias quedaron obsoletas hasta el punto de no
  poder actualizarse sin romper la app.
- Carlos empezó una reescritura desde cero en la rama `migration` (primer
  commit `c28505d "First migration draft"`), reimplementando un subconjunto de
  las funcionalidades originales sobre una base de dependencias moderna.
- **Importante:** esta reescritura no es una historia de git desconectada —
  `migration` es descendiente directo del último commit de la app original en
  `main` (sin commits divergentes). Es decir, la reescritura literalmente
  continúa la misma línea de commits, solo que sustituyendo el código.
- 2026-07: Google Play avisó de cierre de la cuenta de desarrollador por
  inactividad (60 días desde el aviso). Esto reactivó el proyecto — ver
  `PLAY_STORE_ACTION_PLAN.md` para el detalle y las fechas límite activas.

## 3. Ramas y tags (estado a 2026-08-18)

- **`main`** — rama por defecto en GitHub y base de todo trabajo nuevo.
  Fast-forwardeada a la punta de `migration` el 2026-07-23 (no había commits
  divergentes que fusionar, solo mover el puntero).
- **`migration`** — rama histórica de la reescritura desde cero. Ya fusionada
  en `main` (mismo commit); no se usa para trabajo nuevo. Se puede borrar en
  la próxima limpieza de ramas sin perder nada (todo sigue accesible desde
  `main`).
- **`play-store-2026-api36`** — rama corta de propósito único, viva entre
  2026-07-23 y 2026-08-18. Cumplió su objetivo (subir a API 36 y publicar en
  producción) y se fusionó en `main` por fast-forward el 2026-08-18. Ya no se
  usa para trabajo nuevo. El patrón se confirma como el bueno para el próximo
  trabajo de este tipo (objetivo concreto y acotado): rama nueva desde `main`
  con nombre descriptivo, fusionar y cerrar, en vez de reutilizar `migration`
  ni dejarla viva indefinidamente.
- **`old-app`** (tag, no rama) — apunta al último commit de la app original,
  justo antes de "First migration draft". Se creó al hacer el fast-forward
  para no perder el acceso a ese código. **No borrar ni mover.** Útil para
  consultar cómo estaba implementada una funcionalidad de la app vieja que aún
  no existe en la reescritura. Consulta: `git checkout old-app`.
- **Ramas remotas sueltas, pendientes de revisar/borrar** (no se han tocado
  todavía, parecen experimentos de cuando aún se desarrollaba la app
  original): `Crear-acciones`, `Sugerencias`, `emojis`, `modo-simple`,
  `persistencia`.

## 4. Filosofía de mantenimiento

- Proyecto personal, sin usuarios reales por ahora. El riesgo relevante no es
  "romper la experiencia de un usuario", sino que Google Play rechace una
  actualización por incumplir alguna política — especialmente sensible
  mientras hay una fecha límite de cuenta en juego.
- Prioridad: 1) mantener viva la cuenta de Google Play Developer; 2)
  modernizar/reducir vulnerabilidades solo cuando sea de bajo esfuerzo. No se
  persiguen migraciones grandes (p. ej. Angular a una versión mayor) salvo que
  se pida explícitamente y sin presión de fecha límite.
