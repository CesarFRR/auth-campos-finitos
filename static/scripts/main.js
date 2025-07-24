// /path/to/your/scripts/main.js

// --- 1. IMPORTACIONES DE MÓDULOS ---
import { state } from './config.js';
import { modInverse, fastIsPrime } from './math_helpers.js';
import { preloadSounds, playSound, rotateStartSound, rotateEndSound } from './sound_manager.js';
import { createUI, inputP, inputNum1, inputNum2, calculateButton, subButton, multButton, divButton } from './dom_elements.js';
import { drawModularClock, drawResultsText } from './clock_drawing.js';
import { animateSumPie, animateSubPie, animateMultPie, animateDivPie } from './animations.js';
import { drawNumberLine, animateSumOnLine, animateSubOnLine, animateMultOnLine, animateDivOnLine } from './number_line.js';

// --- 2. FUNCIONES GLOBALES DE P5.JS ---
// Asignamos las funciones al objeto 'window' para que p5.js las encuentre.

window.preload = function () {
    // Delega la carga de sonidos al módulo correspondiente.
    preloadSounds();
};

window.setup = function () {
    // Declaramos una variable para el lienzo
    let canvas;

    // Comprobamos el ancho de la ventana
    if (windowWidth >= 1920) {
        // Si la pantalla es Full HD o más ancha
        canvas = createCanvas(1366, 800);
    } else if (windowWidth >= 1600) {
        // Si la pantalla es de 1600px de ancho o más
        canvas = createCanvas(1000, 640);
    } else {
        // Para cualquier otra resolución más pequeña, podemos usar un tamaño por defecto
        // o hacerlo adaptable al 90% de la ventana, por ejemplo.
        canvas = createCanvas(900, 600);
    }
    canvas.parent('sketch-holder');
    textSize(18);
    textAlign(LEFT, CENTER);
    fill(0);

    // Delega la creación de la interfaz de usuario al módulo correspondiente.
    createUI();

    // Calcula y dibuja el estado inicial.
    updateValues();
};

// --- 3. DRAW ---
window.draw = function () {
    background(220);

    // Dibuja la escena estática (reloj, textos Y AHORA LA RECTA)
    drawModularClock();
    drawResultsText();
    drawNumberLine(); // Dibuja la recta numérica en cada fotograma

    if (state.animating) {
        let duration = state.animationType === 'div' ? 2400 / state.animationSpeed : 1800 / state.animationSpeed;
        let elapsed = millis() - state.animationStart;
        let progress = constrain(elapsed / duration, 0, 1);

        // Llama a la animación correspondiente del reloj
        if (state.animationType === "sum") {
            animateSumPie(progress);
            // LLAMA A LA NUEVA ANIMACIÓN de la recta numérica, sincronizada
            animateSumOnLine(progress);
        }
        else if (state.animationType === "sub") {
            animateSubPie(progress);
            animateSubOnLine(progress);
        }
        else if (state.animationType === "mult") {
            animateMultPie(progress);
            animateMultOnLine(progress);
        }
        else if (state.animationType === "div") {
            animateDivPie(progress);
            animateDivOnLine(progress);
        }

        if (elapsed >= duration) {
            state.animating = false;
            noLoop();
        }
    } else {
        // Dibuja el punto estático en la recta cuando no hay animación
        // (Esto es opcional, pero mejora la experiencia)
        if (state.animationType === "sum") {
            animateSumOnLine(1.0); // Muestra el punto en la posición final
        }
    }
};

// --- 3. LÓGICA PRINCIPAL Y MANEJO DE ESTADO ---

/**
 * Inicia una animación. Esta función es llamada por los botones en dom_elements.js.
 * @param {string} type - El tipo de animación a ejecutar ("sum", "sub", "mult", "div").
 */
export function triggerAnimation(type) {
    if (state.animating) return; // Evita iniciar una animación si ya hay una en curso.

    state.animating = true;
    state.animationStart = millis();
    state.animationType = type;
    updateValues(); // Asegura que los cálculos estén al día.
    loop(); // Inicia el bucle de dibujo de p5.js.
}

/**
 * Actualiza todos los valores y cálculos basados en los inputs del usuario.
 * Es llamada por los listeners de los inputs en dom_elements.js.
 */
export function updateValues() {
    // --- Validación del Módulo P ---
    let pIsValid = false;
    let newP_val = inputP.value();
    if (newP_val === "") {
        state.modulusP = 2;
        inputP.style('border-color', '#ccc');
        pIsValid = true;
    } else {
        let newP = parseInt(newP_val);
        if (!isNaN(newP) && fastIsPrime(newP)) {
            state.modulusP = newP;
            inputP.style('border-color', 'green');
            pIsValid = true;
        } else {
            inputP.style('border-color', 'red');
            pIsValid = false;
        }
    }

    // Habilitar/deshabilitar inputs y botones según la validez de 'p'.
    const elementsToToggle = [inputNum1, inputNum2, calculateButton, subButton, multButton, divButton];
    if (pIsValid) {
        elementsToToggle.forEach(el => el.removeAttribute('disabled'));
    } else {
        elementsToToggle.forEach(el => el.attribute('disabled', ''));
        redraw(); // Redibuja para mostrar el estado deshabilitado.
        return;
    }

    // --- Validación de Números a y b ---
    let newNum1_val = inputNum1.value();
    state.val1 = (newNum1_val === "") ? 0 : parseInt(newNum1_val);
    if (isNaN(state.val1) || state.val1 < 0 || state.val1 >= state.modulusP) {
        inputNum1.style('border-color', 'orange');
    } else {
        inputNum1.style('border-color', '#ccc');
    }

    let newNum2_val = inputNum2.value();
    state.val2 = (newNum2_val === "") ? 0 : parseInt(newNum2_val);
    if (isNaN(state.val2) || state.val2 < 0 || state.val2 >= state.modulusP) {
        inputNum2.style('border-color', 'orange');
    } else {
        inputNum2.style('border-color', '#ccc');
    }

    // --- Realizar Cálculos ---
    state.sumResult = (state.val1 + state.val2) % state.modulusP;
    state.subResult = ((state.val1 - state.val2) % state.modulusP + state.modulusP) % state.modulusP;
    state.multResult = (state.val1 * state.val2) % state.modulusP;

    state.bInverse = modInverse(state.val2, state.modulusP);
    if (state.bInverse !== null) {
        state.divResult = (state.val1 * state.bInverse) % state.modulusP;
        divButton.removeAttribute('disabled');
    } else {
        state.divResult = null;
        divButton.attribute('disabled', '');
    }

    if (!state.animating) {
        redraw(); // Redibuja el canvas solo si no hay una animación activa.
    }
}