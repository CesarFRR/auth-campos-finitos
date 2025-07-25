// /path/to/your/scripts/clock_drawing.js

import { state } from './config.js';

/**
 * Dibuja el reloj modular completo en el canvas.
 * Esto incluye el círculo principal, las marcas numéricas alrededor,
 * los resaltados de colores en los números relevantes (a, b, resultados)
 * y las líneas desde el centro hasta dichos números.
 * Su tamaño y posición se ajustan dinámicamente según el tamaño del lienzo.
 */
export function drawModularClock() {
    // --- PARÁMETROS AJUSTADOS ---
    const centerX = width / 2;
    // Se ajusta la posición Y para centrar mejor el reloj más grande
    const centerY = height / 2 -20; 
    // Se aumenta el radio para que el reloj sea más grande
    //const radius = 220; 
    const radius = height / 2 - 130; // Ajusta el radio para que se adapte al nuevo tamaño del canvas
    // Dibuja el círculo y las marcas
    stroke(0); strokeWeight(2); noFill();
    ellipse(centerX, centerY, radius * 2, radius * 2);

    textSize(16); textAlign(CENTER, CENTER); fill(0);
    for (let i = 0; i < state.modulusP; i++) {
        let angle = map(i, 0, state.modulusP, 0, TWO_PI) - HALF_PI;
        let x = centerX + cos(angle) * (radius + 20);
        let y = centerY + sin(angle) * (radius + 20);
        text(i, x, y);
        let xInner = centerX + cos(angle) * radius;
        let yInner = centerY + sin(angle) * radius;
        let xOuter = centerX + cos(angle) * (radius + 10);
        let yOuter = centerY + sin(angle) * (radius + 10);
        line(xInner, yInner, xOuter, yOuter);
    }

    // Resalta los números importantes
    highlightNumber(state.val1, centerX, centerY, radius, color(255, 0, 0));
    highlightNumber(state.val2, centerX, centerY, radius, color(0, 0, 255));
    highlightNumber(state.sumResult, centerX, centerY, radius, color(0, 150, 0));
    highlightNumber(state.subResult, centerX, centerY, radius, color(150, 0, 150));
    highlightNumber(state.multResult, centerX, centerY, radius, color(200, 100, 0));
    if (state.divResult !== null) highlightNumber(state.divResult, centerX, centerY, radius, color(0, 100, 200));
    if (state.bInverse !== null) highlightNumber(state.bInverse, centerX, centerY, radius, color(100, 200, 100, 180));

    // Dibuja las líneas desde el centro
    drawLineToNumber(state.val1, centerX, centerY, radius, color(255, 0, 0, 100));
    drawLineToNumber(state.val2, centerX, centerY, radius, color(0, 0, 255, 100));
    drawLineToNumber(state.sumResult, centerX, centerY, radius, color(0, 150, 0, 100));
    drawLineToNumber(state.subResult, centerX, centerY, radius, color(150, 0, 150, 100));
    drawLineToNumber(state.multResult, centerX, centerY, radius, color(200, 100, 0, 100));
    if (state.divResult !== null) drawLineToNumber(state.divResult, centerX, centerY, radius, color(0, 100, 200, 100));
}

/**
 * Dibuja un círculo de color para resaltar un número específico en la circunferencia del reloj.
 * @param {number} num - El número a resaltar.
 * @param {number} centerX - La coordenada X del centro del reloj.
 * @param {number} centerY - La coordenada Y del centro del reloj.
 * @param {number} radius - El radio del reloj.
 * @param {p5.Color} highlightColor - El color del círculo de resaltado.
 */
function highlightNumber(num, centerX, centerY, radius, highlightColor) {
    if (num >= 0 && num < state.modulusP) {
        let angle = map(num, 0, state.modulusP, 0, TWO_PI) - HALF_PI;
        let x = centerX + cos(angle) * radius;
        let y = centerY + sin(angle) * radius;
        fill(highlightColor);
        noStroke();
        ellipse(x, y, 20, 20);
    }
}

/**
 * Dibuja una línea semitransparente desde el centro del reloj hasta un número específico.
 * @param {number} num - El número al que apuntará la línea.
 * @param {number} centerX - La coordenada X del centro del reloj.
 * @param {number} centerY - La coordenada Y del centro del reloj.
 * @param {number} radius - El radio del reloj.
 * @param {p5.Color} lineColor - El color de la línea.
 */
function drawLineToNumber(num, centerX, centerY, radius, lineColor) {
    if (num >= 0 && num < state.modulusP) {
        let angle = map(num, 0, state.modulusP, 0, TWO_PI) - HALF_PI;
        let x = centerX + cos(angle) * radius;
        let y = centerY + sin(angle) * radius;
        stroke(lineColor);
        strokeWeight(3);
        line(centerX, centerY, x, y);
    }
}

/**
 * Muestra el texto informativo en el canvas.
 * Dibuja dos columnas: a la izquierda, los datos de entrada (módulo, a, b),
 * y a la derecha, los resultados calculados para cada operación (suma, resta, etc.).
 */
export function drawResultsText() {
    push();
    noStroke();
    
    // --- Columna Izquierda (Datos de Entrada) ---
    fill(0);
    textSize(18);
    textAlign(LEFT, CENTER);
    const leftColumnX = 20;
    let yPosLeft = 50;

    text(`Módulo (p): ${state.modulusP}`, leftColumnX, yPosLeft);
    yPosLeft += 30;
    text(`Número 1 (a): ${state.val1}`, leftColumnX, yPosLeft);
    yPosLeft += 30;
    text(`Número 2 (b): ${state.val2}`, leftColumnX, yPosLeft);

    // --- Columna Derecha (Resultados) ---
    textAlign(RIGHT, CENTER);
    const rightColumnX = width - 20;
    let yPosRight = 50;
    textSize(16);
    
    fill(0, 150, 0);
    text(`Suma: (${state.val1} + ${state.val2}) mod ${state.modulusP} = ${state.sumResult}`, rightColumnX, yPosRight);
    yPosRight += 30;
    
    fill(150, 0, 150);
    text(`Resta: (${state.val1} - ${state.val2}) mod ${state.modulusP} = ${state.subResult}`, rightColumnX, yPosRight);
    yPosRight += 30;
    
    fill(200, 100, 0);
    text(`Multiplicación: (${state.val1} × ${state.val2}) mod ${state.modulusP} = ${state.multResult}`, rightColumnX, yPosRight);
    yPosRight += 30;
    
    fill(0, 100, 200);
    if (state.divResult !== null) {
        text(`División: (${state.val1} ÷ ${state.val2}) mod ${state.modulusP} = ${state.divResult}`, rightColumnX, yPosRight);
        yPosRight += 25;
        if (state.bInverse !== null) {
            fill(0);
            textSize(15);
            text(`Inverso de ${state.val2} (b⁻¹): ${state.bInverse}`, rightColumnX, yPosRight);
        }
    } else {
        text(`División: No definida (b no tiene inverso)`, rightColumnX, yPosRight);
    }
    pop();
}