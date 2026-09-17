# Trial by Moonlight 2D - Versión 3.0

Fangame/prototipo 2D asimétrico inspirado en mecánicas tipo Dead by Daylight, hecho en HTML/CSS/JavaScript puro y sin assets externos.

## Cómo abrirlo

Opción recomendada:

1. Abre esta carpeta en VSCode.
2. Instala la extensión **Live Server** si no la tienes.
3. Click derecho en `index.html`.
4. Pulsa **Open with Live Server**.

También puede funcionar abriendo `index.html` directamente, pero con módulos JavaScript lo más fiable es Live Server.

## Controles

- WASD: moverse
- Shift: correr
- E: interactuar / mantener acción
- Espacio: prueba de habilidad / ataque killer
- F: usar objeto como superviviente / poder como killer
- R: colocar trampa como killer
- Q: soltar objeto
- Tab: marcador
- Escape: pausa
- U: destrabar jugador si una colisión o NPC raro te encierra

## Contenido principal

- Modo superviviente y modo killer.
- 4 supervivientes jugables con estadísticas y perks propios.
- Killer jugable con poder especial y trampas.
- NPCs con IA para los personajes no controlados.
- 3 mapas temáticos seleccionables.
- Generadores con reparación, regresión y pruebas de habilidad.
- Ganchos con fases, rescate, sacrificio y sabotaje.
- Cofres con objetos.
- Objetos: botiquín, caja de herramientas, linterna, llave y mapa.
- Pallets: tirar, aturdir, saltar y romper.
- Ventanas/vaults.
- Taquillas: esconderse, salir y ser sacado por el killer.
- Tótems normales y tótem hex.
- Puertas de salida.
- Trampilla.
- Endgame collapse.
- Marcas de carrera.
- Ruidos visibles para el killer.
- Terror radius con latido procedural.
- HUD, minimapa, marcador y mensajes.
- Partículas y efectos visuales.
- Dificultad de IA configurable.
- Opciones de sonido, niebla y minimapa.

## Nota legal / técnica

No usa assets, nombres oficiales, modelos, sonidos ni código de Dead by Daylight. Es un prototipo original inspirado en el género asimétrico de persecución.

## Mejoras de la versión 3.0

- Pathfinding A* por tiles para supervivientes y killer.
- Movimiento inteligente con rutas cacheadas y recálculo periódico.
- Watchdog anti-softlock para jugador y NPCs.
- Recolocación de emergencia si alguien aparece dentro de una pared o queda bloqueado.
- Objetivos colocados con áreas abiertas alrededor para evitar interacciones imposibles.
- IA superviviente con prioridades: huir, pallet, vault, rescate, curación, tótems, cofres, generadores, puertas y escape.
- IA killer con persecución, predicción de movimiento, patrulla, investigación de ruidos/marcas, rotura de pallets, trampas y búsqueda de ganchos.
- Distribución de NPCs entre objetivos para evitar que todos intenten hacer exactamente lo mismo.
- Fallbacks para objetivos y navegación cuando una ruta falla.
