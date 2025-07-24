// /path/to/your/scripts/sound_manager.js

import { rotateStartSoundURL, rotateEndSoundURL } from './config.js';

// Variables para almacenar los objetos de sonido cargados
export let rotateStartSound, rotateEndSound;
const managedSounds = [];

/**
 * Carga todos los archivos de sonido necesarios para la aplicación.
 * Debe ser llamada desde la función preload() principal de p5.js.
 */
export function preloadSounds() {
    soundFormats('mp3');
    rotateStartSound = loadSound(rotateStartSoundURL);
    rotateEndSound = loadSound(rotateEndSoundURL);
    managedSounds.push(rotateStartSound, rotateEndSound);
}

/**
 * Reproduce un sonido de forma segura, asegurándose de que no se interrumpan
 * otros sonidos importantes.
 * @param {p5.SoundFile} sound - El objeto de sonido a reproducir.
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