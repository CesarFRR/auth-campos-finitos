// /path/to/your/scripts/dom_elements.js

import { state } from './config.js';
// Importamos las funciones del módulo principal que serán llamadas por los botones
import { triggerAnimation, updateValues } from './main.js';

/**
 * Elemento de entrada (input) de p5.js para el módulo 'p' del campo finito.
 * @type {p5.Element}
 */
export let inputP, 
/**
 * Elemento de entrada (input) de p5.js para el primer número 'a'.
 * @type {p5.Element}
 */
inputNum1, 
/**
 * Elemento de entrada (input) de p5.js para el segundo número 'b'.
 * @type {p5.Element}
 */
inputNum2;

/**
 * Botón de p5.js para iniciar la animación de la suma.
 * @type {p5.Element}
 */
export let calculateButton, 
/**
 * Botón de p5.js para iniciar la animación de la multiplicación.
 * @type {p5.Element}
 */
multButton, 
/**
 * Botón de p5.js para iniciar la animación de la resta.
 * @type {p5.Element}
 */
subButton, 
/**
 * Botón de p5.js para iniciar la animación de la división.
 * @type {p5.Element}
 */
divButton;

/**
 * Crea y posiciona todos los elementos de la interfaz de usuario (inputs, botones, slider) en el lienzo.
 * Asigna los listeners de eventos correspondientes (`.input()` y `.mousePressed()`) que llaman
 * a las funciones del módulo principal (`updateValues` y `triggerAnimation`).
 * Esta función debe ser llamada una sola vez desde la función `setup()` principal.
 */
export function createUI() {
    let yPos = 20, xPos = 20;

    createElement('h3', 'Configuración del Campo Finito (Zp)').position(xPos, yPos).addClass('p5-label');
    yPos += 40;

    createP('Módulo p (primo):').position(xPos, yPos).addClass('p5-label');
    yPos += 40;
    inputP = createInput(state.modulusP.toString());
    inputP.position(xPos, yPos);
    inputP.input(updateValues); // Llama a updateValues de main.js cuando cambia
    inputP.addClass('p5-input');
    yPos += 45;

    createP('Número 1 (a):').position(xPos, yPos).addClass('p5-label');
    yPos += 40;
    inputNum1 = createInput(state.val1.toString());
    inputNum1.position(xPos, yPos);
    inputNum1.input(updateValues);
    inputNum1.addClass('p5-input');
    yPos += 45;

    createP('Número 2 (b):').position(xPos, yPos).addClass('p5-label');
    yPos += 40;
    inputNum2 = createInput(state.val2.toString());
    inputNum2.position(xPos, yPos);
    inputNum2.input(updateValues);
    inputNum2.addClass('p5-input');
    yPos += 45;

    // --- Botones de Operaciones ---
    calculateButton = createButton('Calcular suma');
    calculateButton.position(xPos, yPos);
    calculateButton.mousePressed(() => triggerAnimation("sum")); // Llama a triggerAnimation de main.js
    yPos += 45;

    subButton = createButton('Calcular resta');
    subButton.position(xPos, yPos);
    subButton.mousePressed(() => triggerAnimation("sub"));
    yPos += 45;

    multButton = createButton('Calcular multiplicación');
    multButton.position(xPos, yPos);
    multButton.mousePressed(() => triggerAnimation("mult"));
    yPos += 45;
    
    divButton = createButton('Calcular división');
    divButton.position(xPos, yPos);
    divButton.mousePressed(() => triggerAnimation("div"));
    yPos += 45;

    // --- Slider de Velocidad ---
    createP('Velocidad de animación').position(20, yPos + 10).addClass('p5-label');
    let speedSlider = createSlider(0.1, 2, state.animationSpeed, 0.01);
    speedSlider.position(20, yPos + 50);
    speedSlider.style('width', '200px');
    speedSlider.input(() => { state.animationSpeed = speedSlider.value(); });
}