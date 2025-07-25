// /path/to/your/scripts/math_helpers.js

import { primeSet, maxPrecomputedPrime } from './config.js';

/**
 * Calcula el inverso multiplicativo de 'a' en el campo finito Zm.
 * Utiliza el Algoritmo de Euclides Extendido para encontrar el inverso.
 * @param {number} a - El número del cual se quiere encontrar el inverso.
 * @param {number} m - El módulo del campo finito.
 * @returns {number|null} El inverso multiplicativo de 'a' mod 'm', o null si no existe (si 'a' y 'm' no son coprimos).
 */
export function modInverse(a, m) {
    // El inverso solo existe si a y m son coprimos.
    if (gcd(a, m) !== 1) return null;

    let [x, ] = extendedGCD(a, m);
    return ((x % m) + m) % m; // Asegura que el resultado sea positivo.
}

/**
 * Calcula el Máximo Común Divisor (MCD) de dos números utilizando el Algoritmo de Euclides.
 * @param {number} a - El primer número.
 * @param {number} b - El segundo número.
 * @returns {number} El MCD de a y b.
 */
export function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

/**
 * Implementa el Algoritmo de Euclides Extendido para encontrar los coeficientes de Bézout.
 * Es una función auxiliar utilizada principalmente por `modInverse`.
 * @param {number} a - El primer número.
 * @param {number} b - El segundo número.
 * @returns {Array<number>} Un array `[x, y]` tal que `ax + by = gcd(a, b)`.
 */
export function extendedGCD(a, b) {
    if (a === 0) return [0, 1];
    let [x1, y1] = extendedGCD(b % a, a);
    let x = y1 - Math.floor(b / a) * x1;
    let y = x1;
    return [x, y];
}

/**
 * Comprueba de forma eficiente si un número es primo.
 * Primero, busca el número en un Set precalculado para una respuesta instantánea.
 * Si el número es mayor que los precalculados, utiliza un algoritmo de primalidad estándar.
 * @param {number} num - El número a comprobar.
 * @returns {boolean} `true` si el número es primo, `false` en caso contrario.
 */
export function fastIsPrime(num) {
    if (num <= maxPrecomputedPrime) return primeSet.has(num);
    return isPrime(num); // Usa la función más lenta para números grandes.
}

/**
 * Comprueba si un número es primo utilizando un algoritmo de prueba por división optimizado.
 * Es la función de respaldo para `fastIsPrime` cuando el número es grande.
 * @param {number} num - El número a comprobar.
 * @returns {boolean} `true` si el número es primo, `false` en caso contrario.
 */
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i = i + 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}