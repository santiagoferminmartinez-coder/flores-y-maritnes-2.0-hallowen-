```javascript
/* =====================================
   LA NOCHE — HALLOWEEN
   JAVASCRIPT COMPLETO
===================================== */

const soundToggle = document.getElementById("soundToggle");
const sweetButton = document.getElementById("sweetButton");
const trickButton = document.getElementById("trickButton");
const result = document.getElementById("result");
const jumpscare = document.getElementById("jumpscare");
const closeJumpscare = document.getElementById("closeJumpscare");

let soundEnabled = false;
let audioContext = null;
let ambientGain = null;

/* =====================================
   SONIDO AMBIENTAL
===================================== */

function startAmbientSound() {
    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        result.textContent =
            "Tu navegador no permite reproducir sonido generado.";
        return;
    }

    if (!audioContext) {
        audioContext = new AudioContextClass();

        ambientGain = audioContext.createGain();
        ambientGain.gain.value = 0;

        ambientGain.connect(audioContext.destination);

        const lowTone = audioContext.createOscillator();
        const highTone = audioContext.createOscillator();

        const lowGain = audioContext.createGain();
        const highGain = audioContext.createGain();

        lowTone.type = "sine";
        lowTone.frequency.value = 48;

        highTone.type = "sine";
        highTone.frequency.value = 53;

        lowGain.gain.value = 0.75;
        highGain.gain.value = 0.25;

        lowTone.connect(lowGain);
        highTone.connect(highGain);

        lowGain.connect(ambientGain);
        highGain.connect(ambientGain);

        lowTone.start();
        highTone.start();
    }

    audioContext.resume();

    ambientGain.gain.setTargetAtTime(
        0.025,
        audioContext.currentTime,
        0.15
    );

    soundEnabled = true;
    soundToggle.textContent = "♫ Sonido: ON";
}

function stopAmbientSound() {
    if (audioContext && ambientGain) {
        ambientGain.gain.setTargetAtTime(
            0,
            audioContext.currentTime,
            0.1
        );
    }

    soundEnabled = false;
    soundToggle.textContent = "♫ Sonido: OFF";
}

soundToggle.addEventListener("click", () => {
    if (soundEnabled) {
        stopAmbientSound();
    } else {
        startAmbientSound();
    }
});

/* =====================================
   BOTÓN DULCE
===================================== */

sweetButton.addEventListener("click", () => {
    result.textContent =
        "🍬 ENCONTRASTE UN DULCE... POR AHORA ESTÁS A SALVO.";

    result.style.color = "#d9b4c9";
});

/* =====================================
   BOTÓN TRUCO
===================================== */

trickButton.addEventListener("click", () => {
    result.textContent = "ALGO SE ESTÁ ACERCANDO...";
    result.style.color = "#ff173e";

    trickButton.disabled = true;
    sweetButton.disabled = true;

    window.setTimeout(() => {
        showJumpscare();
    }, 1200);
});

/* =====================================
   MOSTRAR EL SUSTO
===================================== */

function showJumpscare() {
    jumpscare.classList.add("active");
    jumpscare.setAttribute("aria-hidden", "false");

    if (soundEnabled && audioContext) {
        playScareSound();
    }
}

/* =====================================
   CERRAR EL SUSTO
===================================== */

function hideJumpscare() {
    jumpscare.classList.remove("active");
    jumpscare.setAttribute("aria-hidden", "true");

    result.textContent =
        "LA NOCHE TERMINÓ... ¿O ESO CREÉS?";

    result.style.color = "#d9b4c9";

    trickButton.disabled = false;
    sweetButton.disabled = false;
}

closeJumpscare.addEventListener("click", hideJumpscare);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hideJumpscare();
    }
});

/* Permite cerrar tocando el fondo de la pantalla del susto. */
jumpscare.addEventListener("click", (event) => {
    if (event.target === jumpscare) {
        hideJumpscare();
    }
});

/* =====================================
   EFECTO SONORO DEL SUSTO
===================================== */

function playScareSound() {
    if (!audioContext || !soundEnabled) {
        return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sawtooth";

    oscillator.frequency.setValueAtTime(
        110,
        audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        38,
        audioContext.currentTime + 0.6
    );

    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.12,
        audioContext.currentTime + 0.05
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.7
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.75);
}
```
