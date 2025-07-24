// /path/to/your/scripts/config.js

/**
 * Contiene el estado y las variables de configuración globales de la aplicación.
 * Al centralizarlo aquí, evitamos variables globales y facilitamos la gestión.
 */

// Estado mutable de la aplicación. Se modifica durante la ejecución.
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

// URLs de los sonidos (constantes)
export const rotateStartSoundURL = "/static/rotate_start.mp3";
export const rotateEndSoundURL = "/static/rotate_end.mp3";

// Set de números primos para una consulta más rápida (constante)
export const primeSet = new Set([
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
    157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
    239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
    331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419,
    421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503,
    509, 521, 523, 541
]);
export const maxPrecomputedPrime = 541;