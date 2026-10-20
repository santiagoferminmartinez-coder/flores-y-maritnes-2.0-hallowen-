// La Noche — efectos de audio generados en el navegador, sin descargar archivos.
const soundToggle = document.getElementById('soundToggle');
const ambienceButton = document.getElementById('ambienceButton');
const sweetButton = document.getElementById('sweetButton');
const trickButton = document.getElementById('trickButton');
const result = document.getElementById('result');
const jumpscare = document.getElementById('jumpscare');

let audioContext = null;
let ambienceOn = false;
let ambienceNodes = [];

function getAudio() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      result.textContent = 'TU NAVEGADOR NO ADMITE AUDIO GENERADO.';
      return null;
    }
    audioContext = new AudioCtx();
  }
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function createDrone() {
  const ctx = getAudio();
  if (!ctx || ambienceOn) return;
  ambienceOn = true;
  const master = ctx.createGain();
  master.gain.value = 0.0001;
  master.gain.setTargetAtTime(0.075, ctx.currentTime, 1.2);
  master.connect(ctx.destination);
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const lowpass = ctx.createBiquadFilter();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  osc1.type = 'sawtooth'; osc1.frequency.value = 48;
  osc2.type = 'sine'; osc2.frequency.value = 51;
  lowpass.type = 'lowpass'; lowpass.frequency.value = 180;
  lfo.frequency.value = 0.13; lfoGain.gain.value = 7;
  lfo.connect(lfoGain); lfoGain.connect(osc2.frequency);
  osc1.connect(lowpass); osc2.connect(lowpass); lowpass.connect(master);
  osc1.start(); osc2.start(); lfo.start();
  ambienceNodes = [osc1, osc2, lfo, master];
  soundToggle.classList.add('on');
  soundToggle.setAttribute('aria-pressed', 'true');
  soundToggle.innerHTML = '<span class="sound-dot"></span> SONIDO: ON';
  ambienceButton.textContent = '◖ SILENCIAR LA OSCURIDAD';
}

function stopDrone() {
  ambienceOn = false;
  if (audioContext) {
    ambienceNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        else if (node.gain) node.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.2);
      } catch (_) {}
    });
  }
  ambienceNodes = [];
  soundToggle.classList.remove('on');
  soundToggle.setAttribute('aria-pressed', 'false');
  soundToggle.innerHTML = '<span class="sound-dot"></span> SONIDO: OFF';
  ambienceButton.textContent = '◖ ESCUCHAR LA OSCURIDAD';
}

function playScream() {
  const ctx = getAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  // Chillido sintético breve, creado con osciladores y ruido filtrado.
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(780, now);
  osc.frequency.exponentialRampToValueAtTime(1450, now + 0.16);
  osc.frequency.exponentialRampToValueAtTime(410, now + 0.75);
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1600, now);
  filter.Q.value = 0.7;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.28, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
  osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  osc.start(now); osc.stop(now + 1);
}

function triggerScare() {
  result.textContent = '';
  jumpscare.classList.add('active');
  jumpscare.setAttribute('aria-hidden', 'false');
  document.body.classList.add('scare-shake');
  playScream();
  window.setTimeout(() => {
    jumpscare.classList.remove('active');
    jumpscare.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scare-shake');
    result.textContent = 'EL ARCHIVO HA REGISTRADO TU PRESENCIA.';
  }, 1500);
}

soundToggle.addEventListener('click', () => ambienceOn ? stopDrone() : createDrone());
ambienceButton.addEventListener('click', () => ambienceOn ? stopDrone() : createDrone());
sweetButton.addEventListener('click', () => {
  result.textContent = 'HAS ELEGIDO DULCE… QUÉ AMABLE DE TU PARTE.';
  sweetButton.textContent = '🍬 UN MOMENTO…';
  window.setTimeout(() => {
    sweetButton.textContent = '🍬 DULCE';
    triggerScare();
  }, 900);
});
trickButton.addEventListener('click', triggerScare);

// El sonido solo se inicia tras una acción del visitante, para respetar el bloqueo de autoplay.
