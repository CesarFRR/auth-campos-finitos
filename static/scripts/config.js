// /path/to/your/scripts/config.js

/**
 * Contiene el estado y las variables de configuración globales de la aplicación.
 * Al centralizarlo aquí, evitamos variables globales y facilitamos la gestión.
 */

/**
 * Objeto que contiene el estado mutable de la aplicación, el cual se modifica
 * durante la ejecución en respuesta a la interacción del usuario.
 * @property {number} modulusP - El módulo primo (p) que define el campo finito Zp.
 * @property {number} val1 - El primer número de la operación (a).
 * @property {number} val2 - El segundo número de la operación (b).
 * @property {number} sumResult - El resultado precalculado de la suma modular.
 * @property {number} multResult - El resultado precalculado de la multiplicación modular.
 * @property {number} subResult - El resultado precalculado de la resta modular.
 * @property {number|null} divResult - El resultado precalculado de la división modular. Es nulo si la división no está definida.
 * @property {number|null} bInverse - El inverso multiplicativo de val2 (b⁻¹). Es nulo si no existe.
 * @property {boolean} animating - Un flag que indica si una animación está en curso.
 * @property {number} animationStart - El timestamp (en milisegundos) en que comenzó la animación actual.
 * @property {number} animationProgress - El progreso de la animación actual (un valor de 0.0 a 1.0).
 * @property {string} animationType - El tipo de animación en curso ("sum", "sub", "mult", "div").
 * @property {number} animationSpeed - El multiplicador de velocidad para las animaciones, controlado por un slider.
 */
export let state = {
    // Valores numéricos
    modulusP: 7,
    val1: 3,
    val2: 2,
    
    // Resultados de las operaciones
    sumResult: 0,
    multResult: 0,
    subResult: 0,
    divResult: null,
    bInverse: null,

    // Estado de la animación
    animating: false,
    animationStart: 0,
    animationProgress: 0,
    animationType: "sum",
    animationSpeed: 0.5,
};

/**
 * La URL del archivo de sonido que se reproduce al iniciar una rotación en las animaciones.
 * @const {string}
 */
export const rotateStartSoundURL = "/static/rotate_start.mp3";

/**
 * La URL del archivo de sonido que se reproduce al finalizar una rotación en las animaciones.
 * @const {string}
 */
export const rotateEndSoundURL = "/static/rotate_end.mp3";

/**
 * Un Set que contiene una lista de números primos precalculados para una validación rápida.
 * Mejora el rendimiento al evitar cálculos repetitivos para números comunes.
 * @const {Set<number>}
 */
export const primeSet = new Set([
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
    157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
    239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
    331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419,
    421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503,
    509, 521, 523, 541
]);

/**
 * El número primo más alto incluido en `primeSet`. Cualquier número superior a este
 * requerirá una comprobación de primalidad mediante un algoritmo.
 * @const {number}
 */
export const maxPrecomputedPrime = 541;