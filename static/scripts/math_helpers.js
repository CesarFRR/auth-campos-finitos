// /path/to/your/scripts/math_helpers.js

import { primeSet, maxPrecomputedPrime } from './config.js';

/**
 * Calcula el inverso multiplicativo de 'a' módulo 'm'.
 * Devuelve null si no existe.
 */
export function modInverse(a, m) {
    // El inverso solo existe si a y m son coprimos.
    if (gcd(a, m) !== 1) return null;

    let [x, ] = extendedGCD(a, m);
    return ((x % m) + m) % m; // Asegura que el resultado sea positivo.
}

/**
 * Algoritmo de Euclides para encontrar el máximo común divisor.
 */
export function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

/**
 * Algoritmo de Euclides Extendido.
 */
export function extendedGCD(a, b) {
    if (a === 0) return [0, 1];
    let [x1, y1] = extendedGCD(b % a, a);
    let x = y1 - Math.floor(b / a) * x1;
    let y = x1;
    return [x, y];
}

/**
 * Comprueba si un número es primo usando un set precalculado para mayor velocidad.
 */
export function fastIsPrime(num) {
    if (num <= maxPrecomputedPrime) return primeSet.has(num);
    return isPrime(num); // Usa la función más lenta para números grandes.
}

/**
 * Comprueba si un número es primo (algoritmo estándar).
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