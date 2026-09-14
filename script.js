/* =================================================================
   R.U.T.A. - LOGICA INTERACTIVA DEL SIMULADOR Y COMPONENTES WEB
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos del Simulador Interactivo
  const ldrSlider = document.getElementById('ldrSlider');
  const ldrValueDisplay = document.getElementById('ldrValueDisplay');
  const pirToggle = document.getElementById('pirToggle');
  const btnMaintenance = document.getElementById('btnMaintenance');
  
  const modeBadge = document.getElementById('modeBadge');
  const simulatedLed = document.getElementById('simulatedLed');
  const ledStateText = document.getElementById('ledStateText');
  const simulatedBuzzer = document.getElementById('simulatedBuzzer');
  const buzzerStateText = document.getElementById('buzzerStateText');
  
  const heroLedGlow = document.getElementById('heroLedGlow');
  const serialLog = document.getElementById('serialLog');
  const btnClearSerial = document.getElementById('btnClearSerial');
  const btnCopyCode = document.getElementById('btnCopyCode');

  // Estado del Sistema
  let isMaintenancePressed = false;
  const UMBRAL_NOCHE = 500;

  // Web Audio API para simular el Buzzer (800 Hz)
  let audioCtx = null;

  function playBuzzerTone() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime); // 800 Hz
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1); // Duración de 100 ms
    } catch (e) {
      console.log('Audio API no soportado o bloqueado por interacción');
    }
  }

  // Función de Actualización de Lógica C++
  function updateSystemState() {
    const nivelLuz = parseInt(ldrSlider.value);
    const movimiento = pirToggle.checked ? 1 : 0;
    
    ldrValueDisplay.textContent = nivelLuz;

    // Agregar entrada al Monitor Serie
    appendSerialLog(`Nivel de Luz: ${nivelLuz} | Movimiento: ${movimiento}`);

    // MODO 1: Mantenimiento (Prioridad)
    if (isMaintenancePressed) {
      modeBadge.textContent = 'MODO 1: MANTENIMIENTO / EMERGENCIA';
      modeBadge.className = 'mode-badge mode-maint';
      
      // LED RGB Azul (0, 0, 255)
      setLedVisual('rgba(0, 119, 255, 1)', '0 0 25px rgba(0, 119, 255, 0.9)', 'Luz Azul (Mantenimiento)');
      setBuzzerVisual(true, '800 Hz (100 ms)');
      playBuzzerTone();
      return;
    }

    // MODO 2: Es de Noche
    if (nivelLuz < UMBRAL_NOCHE) {
      if (movimiento === 1) {
        modeBadge.textContent = 'MODO 2: NOCHE - PRESENCIA DETECTADA';
        modeBadge.className = 'mode-badge mode-night';
        // LED RGB Blanco (255, 255, 255) - 100% Intensidad
        setLedVisual('rgba(255, 255, 255, 1)', '0 0 30px rgba(255, 255, 255, 1)', 'Blanco 100% (Iluminación Máxima)');
        setBuzzerVisual(false, 'Silencio');
      } else {
        modeBadge.textContent = 'MODO 2: NOCHE - REPOSO / AHORRO';
        modeBadge.className = 'mode-badge mode-night';
        // LED RGB Reposo tenue / apagado
        setLedVisual('rgba(50, 60, 80, 0.4)', 'none', 'Tenue / Standby');
        setBuzzerVisual(false, 'Silencio');
      }
    } 
    // MODO 3: Es de Día
    else {
      modeBadge.textContent = 'MODO 3: DÍA - APAGADO TOTAL';
      modeBadge.className = 'mode-badge mode-day';
      setLedVisual('rgba(30, 41, 59, 0.2)', 'none', 'Apagado (Ahorro Total)');
      setBuzzerVisual(false, 'Silencio');
    }
  }

  function setLedVisual(color, shadow, text) {
    simulatedLed.style.backgroundColor = color;
    simulatedLed.style.boxShadow = shadow;
    ledStateText.textContent = text;
    if (heroLedGlow) {
      heroLedGlow.style.backgroundColor = color;
      heroLedGlow.style.boxShadow = shadow;
    }
  }

  function setBuzzerVisual(active, text) {
    buzzerStateText.textContent = text;
    if (active) {
      simulatedBuzzer.classList.add('buzzer-active');
    } else {
      simulatedBuzzer.classList.remove('buzzer-active');
    }
  }

  function appendSerialLog(message) {
    const lines = serialLog.textContent.split('\n');
    lines.push(message);
    if (lines.length > 8) lines.shift(); // Mantener últimas 8 líneas
    serialLog.textContent = lines.join('\n');
    serialLog.scrollTop = serialLog.scrollHeight;
  }

  // Event Listeners para Controles
  ldrSlider.addEventListener('input', updateSystemState);
  pirToggle.addEventListener('change', updateSystemState);

  btnMaintenance.addEventListener('mousedown', () => {
    isMaintenancePressed = true;
    updateSystemState();
  });

  btnMaintenance.addEventListener('mouseup', () => {
    isMaintenancePressed = false;
    updateSystemState();
  });

  btnClearSerial.addEventListener('click', () => {
    serialLog.textContent = '--- Monitor Serie Reiniciado ---';
  });

  // Copiar Código C++ al Portapapeles
  btnCopyCode.addEventListener('click', () => {
    const codeText = document.getElementById('cppCodeBlock').textContent;
    navigator.clipboard.writeText(codeText).then(() => {
      btnCopyCode.textContent = '¡Copiado!';
      setTimeout(() => {
        btnCopyCode.textContent = 'Copiar Código';
      }, 2000);
    });
  });

  // Inicialización
  updateSystemState();
});
