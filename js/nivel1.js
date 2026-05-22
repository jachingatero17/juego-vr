/**
 * ======================================================
 * ARCHIVO: nivel1.js
 * UBICACION: play-reorganizado/js/
 * VERSION: 1.2 - Reinicio por caida y salto fluido
 * ULTIMA ACTUALIZACION: 2026-04-25 16:19
 *
 * PROPOSITO:
 * Contiene componentes A-Frame, estado y controles principales del nivel 1.
 * Extraido desde el antiguo index.html sin cambiar reglas de negocio del juego.
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
 * [1.2] - 2026-04-25 16:19
 * - Se resta una vida y se reinicia el nivel cuando el jugador cae de las plataformas.
 * - Se muestra GAME OVER al agotar vidas.
 * - Se estabiliza el salto mientras el jugador avanza y conserva control lateral en el aire.
 *
 * [1.0] - 2026-04-25 15:57
 * - Se crea logica propia para nivel1.html y se ajusta avance hacia nivel2.html.
 * ======================================================
 */

// ======================================================
// BLOQUE 1: ESTADO GLOBAL DE LA PARTIDA
// Mantiene el piloto actual y controla si las fisicas deben responder.
// ======================================================
let nombrePiloto = "";

    let juegoIniciado = false;

    // ======================================================
    // BLOQUE 2: ARRANQUE DE MISION
    // Valida el piloto, activa UI, sonido, controles moviles y fisicas.
    // ======================================================
    function iniciarMision() {

        const input = document.querySelector('#input-nombre');

        if (input.value.trim() === "") { 

            alert("IDENTIFICACIÓN REQUERIDA"); 

            return; 

        }

        // 1. Guardar datos del piloto

        nombrePiloto = input.value.toUpperCase();

        localStorage.setItem('nombrePiloto', nombrePiloto);

        document.querySelector('#user-display').innerText = nombrePiloto;

        // 2. Cambiar pantallas UI

        document.querySelector('#pantalla-registro').style.display = "none";

        document.querySelector('#ui-top').style.display = "block";

        // 3. --- ACTIVAR SONIDO (SOLUCIÓN) ---

        var sonido = document.querySelector('#audio-fondo');

        if (sonido && sonido.components.sound) {

            sonido.components.sound.playSound();

        }

        // 4. Mostrar controles si es celular

        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {

            document.querySelector('.controles-movil').style.display = "flex";

        }

        // 5. Iniciar físicas del juego

        setTimeout(() => { 

            juegoIniciado = true; 

        }, 200);

    }

    // ======================================================
    // BLOQUE 3: MOTOR DE GAMEPLAY
    // Gestiona puntaje, vidas, colisiones, movimiento y cierre de partida.
    // ======================================================
    AFRAME.registerComponent('motor-gameplay', {

        init: function () {

            const puntajeGuardado = localStorage.getItem('puntajeAcumulado');

            this.puntos = puntajeGuardado ? parseInt(puntajeGuardado) : 0;

            this.puedeSaltar = true;

            this.vidas = 3; 

            this.alturaMax = 0; 

            this.invulnerable = false; 

            this.enSuelo = false;

            this.posicionInicio = { x: 0, y: 3, z: 0 };

            this.alturaCaida = -8;

            this.keys = {};

            

            this.actualizarUI();

            window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });

            window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });

            const bindTouch = (id, code) => {

                const el = document.querySelector(id);

                if(!el) return;

                el.addEventListener('touchstart', (e) => { 

                    e.preventDefault(); 

                    this.keys[code] = true; 

                }, {passive: false});

                el.addEventListener('touchend', (e) => { 

                    e.preventDefault(); 

                    this.keys[code] = false; 

                }, {passive: false});

            };

            bindTouch('#m-up', 'KeyW'); 

            bindTouch('#m-down', 'KeyS');

            bindTouch('#m-left', 'KeyA'); 

            bindTouch('#m-right', 'KeyD');

            bindTouch('#m-jump', 'Space');

            this.el.addEventListener('collide', (e) => {

                const target = e.detail.body.el;

                if (!target || !juegoIniciado) return;

                if (target.classList.contains('suelo')) {

                    this.enSuelo = true;

                    let yActual = Math.round(target.object3D.position.y);

                    if (yActual > this.alturaMax) {

                        this.puntos += 300; 

                        this.alturaMax = yActual; 

                        this.actualizarUI();

                    }

                }

                if (target.id === 'lava' && !this.invulnerable) { 

                    this.perderVida(); 

                }

                

                if (target.id === 'meta') { 

                    this.puntos += 5000;

                    // VIBRACIÓN ÉXITO: Dos pulsos rápidos y uno largo

    if (navigator.vibrate) navigator.vibrate([50, 50, 50, 50, 500]);

    

    localStorage.setItem('puntajeAcumulado', this.puntos);

    this.finalizarJuego("¡NIVEL COMPLETADO!");

                    localStorage.setItem('puntajeAcumulado', this.puntos);

                    this.finalizarJuego("¡NIVEL COMPLETADO!"); 

                    setTimeout(() => {

                        window.location.href = "nivel2.html"; 

                    }, 2000);

                }

            });

        },

        perderVida: function() {

    this.invulnerable = true;

    this.vidas--; 

    this.actualizarUI();

    if (this.vidas <= 0) {

        // 1. Vibración de GAME OVER (3 pulsos)

        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300]);

        

        localStorage.removeItem('puntajeAcumulado');

        this.finalizarJuego("GAME OVER");

    } else { 

        // 2. Vibración de impacto simple (Si aún le quedan vidas)

        if (navigator.vibrate) navigator.vibrate(200);

        this.reiniciarNivel();

        // Volver a ser vulnerable tras 1 segundo para evitar doble castigo por la misma caida

        setTimeout(() => { this.invulnerable = false; }, 1000);

    }

        },

        reiniciarNivel: function() {

            if (!this.el.body) return;

            this.enSuelo = false;

            this.puedeSaltar = true;

            this.alturaMax = 0;

            this.el.body.position.set(this.posicionInicio.x, this.posicionInicio.y, this.posicionInicio.z); 

            this.el.body.velocity.set(0, 0, 0); 

            this.el.body.angularVelocity.set(0, 0, 0);

            this.el.body.quaternion.set(0, 0, 0, 1);

            this.el.setAttribute('position', `${this.posicionInicio.x} ${this.posicionInicio.y} ${this.posicionInicio.z}`);

        },

        actualizarUI: function() {

            const puntosVal = document.querySelector('#puntos-val');

            const vidasVal = document.querySelector('#vidas-val');

            if(puntosVal) puntosVal.innerText = this.puntos;

            if(vidasVal) vidasVal.innerText = "❤️".repeat(this.vidas > 0 ? this.vidas : 0);

        },

        finalizarJuego: function(titulo) {

            juegoIniciado = false;

            document.querySelector('#game-over-screen').style.display = "flex";

            if(document.querySelector('.controles-movil')) {

                document.querySelector('.controles-movil').style.display = "none";

            }

            document.querySelector('#final-title').innerText = titulo;

            document.querySelector('#final-score').innerText = `${nombrePiloto}, PUNTUACIÓN: ${this.puntos}`;

        },

        tick: function () {

            if (!this.el.body || !juegoIniciado) return;

            this.el.body.quaternion.set(0, 0, 0, 1);

            this.el.body.angularVelocity.set(0, 0, 0);

            let v = this.el.body.velocity;

            const pos = this.el.body.position;

            if (pos.y < this.alturaCaida && !this.invulnerable) {

                this.perderVida();

                return;

            }

            let f = 8;

            if (this.keys['KeyW']) v.z = -f; else if (this.keys['KeyS']) v.z = f; else v.z = 0;

            if (this.keys['KeyA']) v.x = -f; else if (this.keys['KeyD']) v.x = f; else v.x = 0;

            

            if (this.keys['Space']) {

                if ((this.enSuelo || Math.abs(v.y) < 0.1) && this.puedeSaltar) { 

                    v.y = 13; 

                    this.puedeSaltar = false; 

                    this.enSuelo = false;

                }

            } else {

                this.puedeSaltar = true; 

            }

        }

    });

    // ======================================================
    // BLOQUE 4: SEGUIMIENTO DE CAMARA
    // Mantiene la camara vinculada al jugador y permite orientar la vista.
    // ======================================================
    AFRAME.registerComponent('seguimiento-camara', {

        init: function () {

            this.objetivo = document.querySelector('#jugador');

            this.keys = {};

            window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });

            window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });

            this.currentRotation = { x: -20, y: 0, z: 0 }; 

        },

        tick: function () {

            if (!this.objetivo || !juegoIniciado) return;

            this.el.object3D.position.lerp(this.objetivo.object3D.position, 0.1);

            if (this.keys['ArrowLeft']) this.currentRotation.y += 2.0;

            if (this.keys['ArrowRight']) this.currentRotation.y -= 2.0;

            if (this.keys['ArrowUp']) this.currentRotation.x -= 1.0;

            if (this.keys['ArrowDown']) this.currentRotation.x += 1.0;

            this.currentRotation.x = Math.max(-60, Math.min(20, this.currentRotation.x));

            this.el.setAttribute('rotation', 

                `${this.currentRotation.x} ${this.currentRotation.y} ${this.currentRotation.z}`);

        }

    });

    // ======================================================
    // BLOQUE 5: NAVEGACION
    // Limpia el puntaje acumulado y regresa al portal del juego.
    // ======================================================
    function irAlIndex() {

        localStorage.removeItem('puntajeAcumulado');

        window.location.href = "index.html"; 

    }
