/**
 * ======================================================
 * ARCHIVO: index.js
 * UBICACION: play-reorganizado/js/
 * VERSION: 2.0 - Logica del portal principal
 * ULTIMA ACTUALIZACION: 2026-04-25 15:57
 *
 * PROPOSITO:
 * Controla la entrada principal del videojuego SENATIC y conserva
 * las claves de localStorage usadas por los niveles existentes.
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
 * [2.0] - 2026-04-25 15:57
 * - index.js pasa a controlar el portal principal y redirigir a nivel1.html.
 * ======================================================
 */

// ======================================================
// BLOQUE 1: ESTADO DEL PORTAL
// Lee el piloto guardado para habilitar continuidad de juego.
// ======================================================
const STORAGE_PILOTO = 'nombrePiloto';
const STORAGE_PUNTAJE = 'puntajeAcumulado';

function obtenerPilotoGuardado() {
    return localStorage.getItem(STORAGE_PILOTO) || '';
}

// ======================================================
// BLOQUE 2: INICIO DE NUEVA MISION
// Reinicia puntaje y envia al jugador al nivel 1.
// ======================================================
function iniciarNuevaMision() {
    const input = document.querySelector('#input-nombre');
    const nombrePiloto = input.value.trim().toUpperCase();

    if (!nombrePiloto) {
        alert('IDENTIFICACION REQUERIDA');
        return;
    }

    localStorage.setItem(STORAGE_PILOTO, nombrePiloto);
    localStorage.removeItem(STORAGE_PUNTAJE);
    window.location.href = 'nivel1.html';
}

// ======================================================
// BLOQUE 3: CONTINUAR MISION
// Mantiene piloto y puntaje guardado antes de volver al flujo de niveles.
// ======================================================
function continuarMision() {
    const pilotoGuardado = obtenerPilotoGuardado();

    if (!pilotoGuardado) {
        alert('NO HAY PILOTO GUARDADO');
        return;
    }

    window.location.href = 'nivel1.html';
}

// ======================================================
// BLOQUE 4: INICIALIZACION VISUAL
// Muestra al usuario si existe un piloto guardado en el navegador.
// ======================================================
function pintarEstadoGuardado() {
    const estado = document.querySelector('#estado-guardado');
    const input = document.querySelector('#input-nombre');
    const pilotoGuardado = obtenerPilotoGuardado();

    if (!estado) return;

    if (pilotoGuardado) {
        estado.innerText = `Piloto guardado: ${pilotoGuardado}`;
        if (input) input.value = pilotoGuardado;
    } else {
        estado.innerText = 'Sin piloto guardado. Ingresa un ID para iniciar.';
    }
}

document.addEventListener('DOMContentLoaded', pintarEstadoGuardado);
