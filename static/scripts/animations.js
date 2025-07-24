// /path/to/your/scripts/animations.js

import { state } from './config.js';
import { playSound, rotateStartSound, rotateEndSound } from './sound_manager.js';

/**
 * Calcula y devuelve los parámetros de dibujo del reloj (centro y radio).
 * AJUSTADO para un reloj más grande y centrado.
 */
function getClockParams() {
    return {
        centerX: width / 2,       // El centro horizontal sigue siendo el mismo.
        centerY: height / 2 -20,   // Bajamos un poco el centro para mejor balance visual.
        radius: height / 2 - 130 // Ajusta el radio para que se adapte al nuevo tamaño del canvas
    };
}

export function animateSumPie(progress) {
    push();
    const { centerX, centerY, radius } = getClockParams(); // Usa los nuevos parámetros
    let firstVal = Math.min(state.val1, state.val2), secondVal = Math.max(state.val1, state.val2);
    let firstColor = (state.val1 <= state.val2) ? color(255, 0, 0, 150) : color(0, 0, 255, 150);
    let secondColor = (state.val1 > state.val2) ? color(255, 0, 0, 150) : color(0, 0, 255, 150);
    let angleFirst = map(firstVal, 0, state.modulusP, 0, TWO_PI), angleSecond = map(secondVal, 0, state.modulusP, 0, TWO_PI);

    const phase1_end = 0.30, phase2_end = 0.60, pause_end = 0.80, rotation_end = 1.0;
    
    let currentAngleFirst = (progress < phase1_end) ? lerp(0, angleFirst, progress / phase1_end) : angleFirst;
    let currentAngleSecond = 0;
    if (progress > phase1_end) {
        let t = constrain((progress - phase1_end) / (phase2_end - phase1_end), 0, 1);
        currentAngleSecond = lerp(0, angleSecond, t);
    }
    let rotationAngle = 0;
    if (progress > pause_end) {
        playSound(rotateStartSound);
        let t = constrain((progress - pause_end) / (rotation_end - pause_end), 0, 1);
        rotationAngle = lerp(0, angleFirst, t);
    }

    fill(firstColor); noStroke();
    arc(centerX, centerY, radius * 2, radius * 2, -HALF_PI, -HALF_PI + currentAngleFirst, PIE);
    if (currentAngleSecond > 0) {
        fill(secondColor); noStroke();
        let startAngle = -HALF_PI + rotationAngle;
        arc(centerX, centerY, radius * 2, radius * 2, startAngle, startAngle + currentAngleSecond, PIE);
    }

    if (progress >= 1) {
        rotateStartSound.stop(); playSound(rotateEndSound);
        let angleSum = map(state.sumResult, 0, state.modulusP, 0, TWO_PI) - HALF_PI;
        let xSum = centerX + cos(angleSum) * radius, ySum = centerY + sin(angleSum) * radius;
        noFill(); stroke(0); strokeWeight(3); ellipse(xSum, ySum, 24, 24);
    }
    pop();
}

export function animateSubPie(progress) {
    push();
    const { centerX, centerY, radius } = getClockParams(); // Usa los nuevos parámetros
    let minuendColor = color(255, 0, 0, 150), subtrahendColor = color(0, 0, 255, 150);
    let angleA = map(state.val1, 0, state.modulusP, 0, TWO_PI), angleB = map(state.val2, 0, state.modulusP, 0, TWO_PI);

    const phase1_end = 0.30, phase2_end = 0.60, pause_end = 0.80, rotation_end = 1.0;

    let currentAngleA = (progress < phase1_end) ? lerp(0, angleA, progress / phase1_end) : angleA;
    let currentAngleB = 0;
    if (progress > phase1_end) {
        let t = constrain((progress - phase1_end) / (phase2_end - phase1_end), 0, 1);
        currentAngleB = lerp(0, angleB, t);
    }
    let rotationAngle = 0;
    if (progress > pause_end) {
        playSound(rotateStartSound);
        let t = constrain((progress - pause_end) / (rotation_end - pause_end), 0, 1);
        rotationAngle = -lerp(0, angleB, t);
    }

    fill(minuendColor); noStroke();
    let startAngleA = -HALF_PI + rotationAngle;
    arc(centerX, centerY, radius * 2, radius * 2, startAngleA, startAngleA + currentAngleA, PIE);
    
    if (currentAngleB > 0) {
         fill(subtrahendColor); noStroke();
         let startAngleB = -HALF_PI + rotationAngle;
         arc(centerX, centerY, radius * 2, radius * 2, startAngleB, startAngleB + currentAngleB, PIE);
    }
    
    if (progress >= 1) {
        rotateStartSound.stop(); playSound(rotateEndSound);
        let angleSub = map(state.subResult, 0, state.modulusP, 0, TWO_PI) - HALF_PI;
        let xSub = centerX + cos(angleSub) * radius, ySub = centerY + sin(angleSub) * radius;
        noFill(); stroke(150, 0, 150); strokeWeight(3); ellipse(xSub, ySub, 24, 24);
    }
    pop();
}

export function animateMultPie(progress) {
    push();
    const { centerX, centerY, radius } = getClockParams(); // Usa los nuevos parámetros
    let sliceVal = Math.min(state.val1, state.val2);
    let rotVal = Math.max(state.val1, state.val2);
    let angleSlice = map(sliceVal, 0, state.modulusP, 0, TWO_PI);

    const drawPhaseEnd = 0.35, pausePhaseEnd = 0.55, rotatePhaseEnd = 1.0;
    
    if (progress < drawPhaseEnd) {
        let t = progress / drawPhaseEnd;
        let endAngle = lerp(-HALF_PI, -HALF_PI + angleSlice, t);
        fill(255, 140, 0, 150); noStroke();
        arc(centerX, centerY, radius * 2, radius * 2, -HALF_PI, endAngle, PIE);
    } else if (progress < pausePhaseEnd) {
        fill(255, 140, 0, 150); noStroke();
        arc(centerX, centerY, radius * 2, radius * 2, -HALF_PI, -HALF_PI + angleSlice, PIE);
    } else {
        playSound(rotateStartSound);
        let t = (progress - pausePhaseEnd) / (rotatePhaseEnd - pausePhaseEnd);
        let currentRotationStep = lerp(1, rotVal, t);
        let startAngle = -HALF_PI + (currentRotationStep - 1) * angleSlice;
        fill(255, 140, 0, 150); noStroke();
        arc(centerX, centerY, radius * 2, radius * 2, startAngle, startAngle + angleSlice, PIE);
    }

    if (progress >= 1) {
        rotateStartSound.stop(); playSound(rotateEndSound);
        let angleResult = map(state.multResult, 0, state.modulusP, 0, TWO_PI) - HALF_PI;
        let xRes = centerX + cos(angleResult) * radius, yRes = centerY + sin(angleResult) * radius;
        noFill(); stroke(0); strokeWeight(3); ellipse(xRes, yRes, 24, 24);
    }
    pop();
}
export function animateDivPie(progress) {
    if (state.divResult === null || state.bInverse === null) return;

    push();
    const { centerX, centerY, radius } = getClockParams();
    
    const angleA = map(state.val1, 0, state.modulusP, 0, TWO_PI);
    const angleInverse = map(state.bInverse, 0, state.modulusP, 0, TWO_PI);
    
    // Fases de la animación con una pausa clara antes de la rotación
    const showAPhaseEnd = 0.25;
    const showInversePhaseEnd = 0.50;
    const pausePhaseEnd = 0.70; // Pausa extendida para mayor claridad
    const multiplyPhaseEnd = 1.0;

    // --- LÓGICA DE FASES ---

    if (progress <= pausePhaseEnd) {
        // --- FASE ESTÁTICA: Se muestran los arcos de 'a' y 'b⁻¹' ---

        // Dibuja el arco 'a' (rojo)
        const tA = constrain(progress / showAPhaseEnd, 0, 1);
        const currentAngleA = lerp(0, angleA, tA);
        fill(255, 0, 0, 150);
        noStroke();
        arc(centerX, centerY, radius * 2, radius * 2, -HALF_PI, -HALF_PI + currentAngleA, PIE);

        // Dibuja el arco 'b⁻¹' (verde) después de que aparezca 'a'
        if (progress > showAPhaseEnd) {
            const tInverse = constrain((progress - showAPhaseEnd) / (showInversePhaseEnd - showAPhaseEnd), 0, 1);
            const currentAngleInverse = lerp(0, angleInverse, tInverse);
            fill(100, 200, 100, 180);
            noStroke();
            arc(centerX, centerY, radius * 2, radius * 2, -HALF_PI, -HALF_PI + currentAngleInverse, PIE);
        }

    } else {
        // --- FASE DE ROTACIÓN: Solo se muestra el arco de 'a' rotando ---
        
        const sliceAngle = angleA; 
        const rotationCount = state.bInverse;

        playSound(rotateStartSound);
        // Se calcula el progreso solo dentro de esta fase para una rotación suave
        const t = (progress - pausePhaseEnd) / (multiplyPhaseEnd - pausePhaseEnd);
        const currentRotationStep = lerp(1, rotationCount, t);
        const startAngle = -HALF_PI + (currentRotationStep - 1) * sliceAngle;
        
        fill(255, 0, 0, 150); // Color de 'a'
        noStroke();
        // Se dibuja únicamente el arco de 'a' en su nueva posición rotada
        arc(centerX, centerY, radius * 2, radius * 2, startAngle, startAngle + sliceAngle, PIE);
    }

    // Al final de toda la animación, se resalta el resultado de la división
    if (progress >= 1) {
        rotateStartSound.stop();
        playSound(rotateEndSound);
        let angleDiv = map(state.divResult, 0, state.modulusP, 0, TWO_PI) - HALF_PI;
        let xDiv = centerX + cos(angleDiv) * radius;
        let yDiv = centerY + sin(angleDiv) * radius;
        noFill();
        stroke(0, 100, 200); // Color del resultado de la división
        strokeWeight(3);
        ellipse(xDiv, yDiv, 24, 24);
    }
    pop();
}