# AGENTS-changelog.md — historia de `AGENTS.md`

> Historia de las normas de este repositorio: qué cambió y **por qué**. Se consulta
> antes de modificar o retirar una norma (`AGENTS-COMMON.md` §7). No hace falta
> leerlo para aplicar las normas, solo para cambiarlas.

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| 1.0 | 2026-07-23 | Versión inicial, tras completar el upgrade de Capacitor 7 y resolver el aviso de cierre de cuenta de Google Play. |
| 1.1 | 2026-08-18 | Alta en las normas comunes ([tarjeta 153](https://trello.com/c/rulZNb8h)). Se añade la cabecera de §0.5 del común y se retira todo lo que el común ya cubre, para que un dato viva en un solo sitio (§1): cambio mínimo ante fecha límite, no emprender migraciones mayores por iniciativa propia, no reparar el entorno del usuario a ciegas, no borrar ramas remotas sueltas y no dar por hecho el estado de git. Ninguna queda derogada: siguen vigentes desde el común. Se queda lo propio del proyecto (objetivo de no perder la cuenta de Play, el tag `old-app`, las ramas sueltas por nombre y los gotchas técnicos). Este changelog sale del cuerpo de `AGENTS.md` a este archivo. |
| 1.2 | 2026-08-18 | **Norma derogada:** "no hagas `git commit`/`git push` sin confirmación explícita". El común (§4.1) fija otra frontera —commit libre, `push` con confirmación explícita cada vez— y el usuario decidió alinear los cinco repositorios. La v1.0 no registraba ningún motivo específico para exigir confirmación también al commitear en este repo, así que no había nada que preservar. El criterio del común es el mismo (reversibilidad), solo que trazado donde el cambio deja de ser local. |
