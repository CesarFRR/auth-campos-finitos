import { state } from './config.js';

/**
 * Calcula y devuelve los parámetros de dibujo para la recta numérica.
 * Estos valores se ajustan dinámicamente al tamaño del lienzo y al módulo actual.
 * @returns {{yPos: number, xOffset: number, stepPixelSize: number}} Un objeto con la posición vertical, el margen horizontal y el tamaño en píxeles de cada paso en la recta.
 */
function getLineParams() {
    // Posiciona la recta numérica debajo del reloj
    const yPos = height - 90; 
    const xOffset = 50;
    // Ajusta el tamaño de cada paso dinámicamente según el módulo
    const stepPixelSize = (width - 2 * xOffset) / (state.modulusP);
    
    return { yPos, xOffset, stepPixelSize };
}

/**
 * Dibuja la recta numérica estática, incluyendo la línea principal,
 * las marcas verticales y los números correspondientes al módulo actual.
 */
export function drawNumberLine() {
    const { yPos, xOffset, stepPixelSize } = getLineParams();
    
    push();
    stroke(0);
    strokeWeight(2);
    // Dibuja la línea principal
    line(xOffset, yPos, width - xOffset, yPos);

    // Dibuja las marcas y los números
    for (let i = 0; i < state.modulusP; i++) {
        const x = xOffset + i * stepPixelSize;
        line(x, yPos - 5, x, yPos + 5); // Marcas verticales
        noStroke();
        fill(0);
        textAlign(CENTER);
        textSize(14);
        text(i, x, yPos + 25);
    }
    pop();
}

/**
 * Anima el movimiento de un punto en la recta numérica para la operación de SUMA.
 * El punto se desplaza suavemente desde 'a' hasta el resultado final ('a' + 'b').
 * El movimiento está sincronizado con la fase de rotación de la animación del reloj.
 * @param {number} progress - El progreso de la animación (un valor de 0.0 a 1.0).
 */
export function animateSumOnLine(progress) {
    const { yPos, xOffset, stepPixelSize } = getLineParams();

    // El punto se mueve desde 'a' hasta 'a+b'
    const startPos = xOffset + state.val1 * stepPixelSize;
    const targetPos = xOffset + state.sumResult * stepPixelSize;

    // Queremos que el movimiento ocurra durante la fase de rotación del reloj
    const rotationStartTime = 0.80;
    const rotationEndTime = 1.0;

    let pointPosition = startPos;
    
    if (progress > rotationStartTime) {
        // Normalizamos el progreso para que vaya de 0 a 1 solo en esta fase
        const t = (progress - rotationStartTime) / (rotationEndTime - rotationStartTime);
        // Usamos una función de suavizado para un movimiento más agradable
        const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        pointPosition = lerp(startPos, targetPos, easedT);
    } else if (progress >= 1.0) {
        // Aseguramos que el punto termine en la posición final exacta
        pointPosition = targetPos;
    }

    // Dibuja el punto en su posición actual
    fill(255, 0, 0); // Punto rojo
    noStroke();
    ellipse(pointPosition, yPos, 15, 15);
}

/**
 * Anima el movimiento de un punto en la recta numérica para la operación de RESTA.
 * El punto se desplaza suavemente desde 'a' hasta el resultado final ('a' - 'b').
 * El movimiento está sincronizado con la fase de rotación de la animación del reloj.
 * @param {number} progress - El progreso de la animación (un valor de 0.0 a 1.0).
 */
export function animateSubOnLine(progress) {
    const { yPos, xOffset, stepPixelSize } = getLineParams();

    // El punto se mueve desde 'a' hasta el resultado de 'a - b'
    const startPos = xOffset + state.val1 * stepPixelSize;
    const targetPos = xOffset + state.subResult * stepPixelSize;

    // Sincronizamos el movimiento con la fase de rotación de la animación del reloj
    const rotationStartTime = 0.80;
    const rotationEndTime = 1.0;

    let pointPosition = startPos;
    
    // Solo animar durante la fase de rotación
    if (progress > rotationStartTime) {
        const t = (progress - rotationStartTime) / (rotationEndTime - rotationStartTime);
        const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        
        // Si el resultado es mayor que el inicio (por ej. 1 - 3 mod 7 = 5),
        // la animación debe "dar la vuelta". Lerp lo manejará visualmente bien.
        pointPosition = lerp(startPos, targetPos, easedT);

    } else if (progress >= 1.0) {
        pointPosition = targetPos;
    }

    // Dibuja el punto en su posición actual
    fill(255, 0, 0); // Punto rojo
    noStroke();
    ellipse(pointPosition, yPos, 15, 15);
}

/**
 * Anima el movimiento de un punto en la recta numérica para la MULTIPLICACIÓN.
 * La animación visualiza la operación como una serie de saltos. El punto realiza
 * 'n' saltos de tamaño 'm', donde 'n' y 'm' son los dos números de la operación.
 * @param {number} progress - El progreso de la animación (un valor de 0.0 a 1.0).
 */
export function animateMultOnLine(progress) {
    const { yPos, xOffset, stepPixelSize } = getLineParams();

    // Replicamos la lógica del reloj: el valor más pequeño es el tamaño del salto,
    // y el más grande es la cantidad de saltos.
    const sliceVal = Math.min(state.val1, state.val2);
    const rotVal = Math.max(state.val1, state.val2);

    // Sincronizamos con la fase de rotación de la animación del reloj
    const rotateStartTime = 0.55;
    const rotateEndTime = 1.0;

    let pointPosition;

    if (progress < rotateStartTime) {
        // Antes de que comience la rotación, el punto está en 0 (el inicio de la multiplicación)
        pointPosition = xOffset;
    } else {
        // Normalizamos el progreso para que vaya de 0 a 1 solo en esta fase
        const t = (progress - rotateStartTime) / (rotateEndTime - rotateStartTime);

        // Determinamos en qué salto estamos actualmente (de 0 a rotVal-1)
        const currentJump = Math.floor(t * rotVal);
        
        // Calculamos la posición inicial y final para el salto actual
        const startOfJump = (currentJump * sliceVal) % state.modulusP;
        const endOfJump = ((currentJump + 1) * sliceVal) % state.modulusP;

        // Calculamos el progreso DENTRO del salto actual
        const progressInJump = (t * rotVal) - currentJump;

        // Mapeamos las posiciones a píxeles
        const startPos = xOffset + startOfJump * stepPixelSize;
        const targetPos = xOffset + endOfJump * stepPixelSize;
        
        pointPosition = lerp(startPos, targetPos, progressInJump);
    }
    
    // Si la animación ha terminado, aseguramos la posición final
    if (progress >= 1.0) {
        pointPosition = xOffset + state.multResult * stepPixelSize;
    }

    // Dibuja el punto en su posición actual
    fill(255, 0, 0); // Punto rojo
    noStroke();
    ellipse(pointPosition, yPos, 15, 15);
}

/**
 * Anima el movimiento de un punto en la recta numérica para la DIVISIÓN.
 * La animación se divide en dos fases para ilustrar el concepto de `a * b⁻¹`:
 * 1. Demuestra que `b * b⁻¹ = 1` mediante una serie de saltos.
 * 2. Realiza la multiplicación final `a * b⁻¹` mediante otra serie de saltos.
 * @param {number} progress - El progreso de la animación (un valor de 0.0 a 1.0).
 */
export function animateDivOnLine(progress) {
    if (state.divResult === null || state.bInverse === null) return;

    const { yPos, xOffset, stepPixelSize } = getLineParams();
    let pointPosition;

    // --- Fases de la animación ---
    const findInversePhaseEnd = 0.5; // La primera mitad es para encontrar el inverso.
    const multiplyPhaseEnd = 1.0;   // La segunda mitad es para la multiplicación.

    if (progress <= findInversePhaseEnd) {
        // --- FASE 1: Demostrar que b * b⁻¹ = 1 ---
        const t = progress / findInversePhaseEnd; // Progreso normalizado para esta fase.
        const sliceVal = state.bInverse;
        const rotVal = state.val2;

        const currentJump = Math.floor(t * rotVal);
        const startOfJump = (currentJump * sliceVal) % state.modulusP;
        const endOfJump = ((currentJump + 1) * sliceVal) % state.modulusP;
        
        const progressInJump = (t * rotVal) - currentJump;

        const startPos = xOffset + startOfJump * stepPixelSize;
        const targetPos = xOffset + endOfJump * stepPixelSize;
        
        pointPosition = lerp(startPos, targetPos, progressInJump);

    } else {
        // --- FASE 2: Multiplicar a * b⁻¹ ---
        const t = (progress - findInversePhaseEnd) / (multiplyPhaseEnd - findInversePhaseEnd);
        const sliceVal = state.val1;
        const rotVal = state.bInverse;

        const currentJump = Math.floor(t * rotVal);
        const startOfJump = (currentJump * sliceVal) % state.modulusP;
        const endOfJump = ((currentJump + 1) * sliceVal) % state.modulusP;

        const progressInJump = (t * rotVal) - currentJump;
        
        const startPos = xOffset + startOfJump * stepPixelSize;
        const targetPos = xOffset + endOfJump * stepPixelSize;
        
        pointPosition = lerp(startPos, targetPos, progressInJump);
    }
    
    // Asegurar la posición final al terminar la animación
    if (progress >= 1.0) {
        pointPosition = xOffset + state.divResult * stepPixelSize;
    }

    // Dibuja el punto rojo en su posición actual
    fill(255, 0, 0);
    noStroke();
    ellipse(pointPosition, yPos, 15, 15);
}