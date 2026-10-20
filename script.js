```javascript
document.addEventListener("DOMContentLoaded", () => {
  const botonSonido = document.getElementById("boton-sonido");
  const botonDulce = document.getElementById("boton-dulce");
  const botonTruco = document.getElementById("boton-truco");
  const jumpscare = document.getElementById("jumpscare");
  const cerrarJumpscare = document.getElementById("cerrar-jumpscare");

  let sonidoActivado = false;
  let audioContext = null;
  let temporizador = null;

  // SONIDO DE AMBIENTE
  function reproducirSonido() {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        alert("Tu navegador no permite reproducir este sonido.");
        return;
      }

      if (!audioContext) {
        audioContext = new AudioContext();
      }

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const oscilador = audioContext.createOscillator();
      const volumen = audioContext.createGain();

      oscilador.type = "sawtooth";
      oscilador.frequency.setValueAtTime(
        55,
        audioContext.currentTime
      );

      volumen.gain.setValueAtTime(
        0.025,
        audioContext.currentTime
      );

      oscilador.connect(volumen);
      volumen.connect(audioContext.destination);
      oscilador.start();

      return { oscilador, volumen };
    } catch (error) {
      console.error("Error al reproducir sonido:", error);
    }
  }

  let sonidoActual = null;

  if (botonSonido) {
    botonSonido.addEventListener("click", () => {
      sonidoActivado = !sonidoActivado;

      if (sonidoActivado) {
        sonidoActual = reproducirSonido();
        botonSonido.textContent = "🔊 Sonido activado";
      } else {
        if (sonidoActual) {
          sonidoActual.oscilador.stop();
          sonidoActual = null;
        }

        botonSonido.textContent = "🔇 Activar sonido";
      }
    });
  }

  // BOTÓN DULCE
  if (botonDulce) {
    botonDulce.addEventListener("click", () => {
      alert("🍬 ¡Trato hecho! Que tengas una noche terroríficamente dulce.");
    });
  }

  // BOTÓN TRUCO
  if (botonTruco) {
    botonTruco.addEventListener("click", () => {
      alert("👻 ¡Elegiste truco! Mirá bien a tu alrededor...");
      
      if (temporizador) {
        clearTimeout(temporizador);
      }

      temporizador = setTimeout(() => {
        if (jumpscare) {
          jumpscare.classList.add("activo");
        }
      }, 1200);
    });
  }

  // CERRAR SUSTO
  function cerrarSusto() {
    if (jumpscare) {
      jumpscare.classList.remove("activo");
    }

    if (temporizador) {
      clearTimeout(temporizador);
      temporizador = null;
    }
  }

  if (cerrarJumpscare) {
    cerrarJumpscare.addEventListener("click", cerrarSusto);
  }

  if (jumpscare) {
    jumpscare.addEventListener("click", (evento) => {
      if (evento.target === jumpscare) {
        cerrarSusto();
      }
    });
  }

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      cerrarSusto();
    }
  });
});
```
