/**
 * ======================================================
 * ARCHIVO: nivel3.init.js
 * UBICACION: play-reorganizado/js/
 * VERSION: 1.1 - Inicializacion seccionada
 * ULTIMA ACTUALIZACION: 2026-04-25 15:50
 *
 * PROPOSITO:
 * Contiene inicializacion dependiente del DOM para la vista del nivel.
 * Extraido desde nivel3.html sin cambiar reglas de negocio del juego.
 *
 * ======================================================
 * REGLAS PARA PRODUCCION:
 * ---
 * - Console marcados con // @strip se eliminan en build para cliente
 * - Esta cabecera se elimina en version para cliente
 *
 * ======================================================
 * HISTORIAL DE CAMBIOS:
 * ---
 * [1.1] - 2026-04-25 15:50
 * - Se agrega bloque de lectura para inicializacion del DOM.
 *
 * [1.0] - 2026-04-25 15:41
 * - Archivo JS creado desde scripts embebidos del HTML original.
 * ======================================================
 */

// ======================================================
// BLOQUE 1: INICIALIZACION VISUAL DEL NIVEL
// Inserta el nombre del piloto en la pantalla de inicio.
// ======================================================
document.querySelector('#nombre-agente').innerText = nombrePiloto;
