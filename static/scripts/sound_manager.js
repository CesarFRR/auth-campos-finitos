// /path/to/your/scripts/sound_manager.js

import { rotateStartSoundURL, rotateEndSoundURL } from './config.js';

/**
 * Objeto de sonido p5.js para el audio que se reproduce al iniciar una rotación.
 * Se carga en `preloadSounds`.
 * @type {p5.SoundFile}
 */
export let rotateStartSound, 
/**
 * Objeto de sonido p5.js para el audio que se reproduce al finalizar una rotación.
 * Se carga en `preloadSounds`.
 * @type {p5.SoundFile}
 */
rotateEndSound;

/**
 * Un array privado que contiene los objetos de sonido principales.
 * Se utiliza internamente en la función `playSound` para comprobar si alguno
 * de los sonidos ya está en reproducción, evitando que se superpongan.
 * @private
 * @const {Array<p5.SoundFile>}
 */
const managedSounds = [];

/**
 * Carga todos los archivos de sonido necesarios para la aplicación utilizando la función `loadSound` de p5.js.
 * Esta función debe ser llamada desde la función `preload()` principal del sketch para asegurar
 * que los sonidos estén listos antes de que comience la aplicación.
 */
export function preloadSounds() {
    soundFormats('mp3');
    rotateStartSound = loadSound(rotateStartSoundURL);
    rotateEndSound = loadSound(rotateEndSoundURL);
    managedSounds.push(rotateStartSound, rotateEndSound);
}

/**
 * Reproduce un objeto de sonido p5.SoundFile de forma segura.
 * Primero, verifica si el sonido está cargado. Luego, comprueba si algún otro sonido
 * gestionado ya está en reproducción para evitar la superposición de audios.
 * @param {p5.SoundFile} sound - El objeto de sonido que se desea reproducir.
 */
export function playSound(sound) {
    if (!sound || !sound.isLoaded()) {
        console.warn("Intento de reproducir un sonido que no está cargado.");
        return;
    }
    
    // Evita que los sonidos de rotación se superpongan entre sí
    for (let s of managedSounds) {
        if (s.isPlaying()) {
            return; // Si ya hay un sonido en curso, no inicies uno nuevo.
        }
    }
    
    sound.play();
}