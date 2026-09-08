"use strict";

/* ---------------------------------------------------------
   Navegación: Cambio al hacer Scroll y Menú Móvil
--------------------------------------------------------- */
(function() {
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ---------------------------------------------------------
   Navegación: Resaltado dinámico de sección activa
--------------------------------------------------------- */
(function() {
  const links = Array.from(document.querySelectorAll('.nav-links a'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  const sectionMap = {};
  links.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    const section = document.getElementById(id);
    if (section) sectionMap[id] = link;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('is-active'));
        const activeLink = sectionMap[entry.target.id];
        if (activeLink) activeLink.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  Object.keys(sectionMap).forEach(id => {
    observer.observe(document.getElementById(id));
  });
})();

/* ---------------------------------------------------------
   Motor de Simulación Interactivo R.U.T.A.
--------------------------------------------------------- */
(function() {
  const state = { night: true, presence: false, alert: false };

  const els = {
    skyDay: document.querySelector('.sky-day'),
    skyNight: document.querySelector('.sky-night'),
    stars: document.querySelector('.stars'),
    lightBeam: document.querySelector('.light-beam'),
    bulb: document.querySelector('.bulb'),
    glow: document.querySelector('.bulb-glow'),
    figure: document.querySelector('.figure'),
    buzzer: document.querySelector('.buzzer-body'),
    rings: document.querySelectorAll('.alert-ring'),
    statusPill: document.getElementById('statusPill'),
    modeName: document.getElementById('modeName'),
    modeDesc: document.getElementById('modeDesc'),
    sLdr: document.getElementById('sLdr'),
    sPir: document.getElementById('sPir'),
    sBuz: document.getElementById('sBuz'),
    tglNight: document.getElementById('tglNight'),
    tglPresence: document.getElementById('tglPresence'),
    tglAlert: document.getElementById('tglAlert')
  };

  if (!els.bulb || !els.tglNight) return;

  function bindToggle(btn, key) {
    btn.addEventListener('click', () => {
      state[key] = !state[key];
      btn.setAttribute('aria-pressed', String(state[key]));
      render();
    });
  }

  bindToggle(els.tglNight, 'night');
  bindToggle(els.tglPresence, 'presence');
  bindToggle(els.tglAlert, 'alert');

  function render() {
    // Rendimiento de cielo y estrellas
    els.skyDay.style.opacity = state.night ? 0 : 1;
    els.skyNight.style.opacity = state.night ? 1 : 0;
    els.stars.style.opacity = state.night ? 1 : 0;

    // Estado del haz de luz y luminaria
    const lampState = !state.night ? 'off' : (state.presence ? 'bright' : 'dim');

    if (lampState === 'off') {
      els.bulb.setAttribute('fill', '#475569');
      els.glow.style.opacity = 0;
      els.glow.setAttribute('r', 10);
      if (els.lightBeam) els.lightBeam.style.opacity = 0;
    } else if (lampState === 'dim') {
      els.bulb.setAttribute('fill', '#EFA84B');
      els.glow.style.opacity = 0.35;
      els.glow.setAttribute('r', 28);
      if (els.lightBeam) els.lightBeam.style.opacity = 0.15;
    } else {
      els.bulb.setAttribute('fill', '#FFF3BF');
      els.glow.style.opacity = 0.85;
      els.glow.setAttribute('r', 48);
      if (els.lightBeam) els.lightBeam.style.opacity = 0.55;
    }

    // Figura del transeúnte
    if (els.figure) {
      els.figure.classList.toggle('shown', state.presence);
      els.figure.classList.toggle('hidden', !state.presence);
    }

    // Buzzer y Alertas
    if (els.buzzer) {
      els.buzzer.setAttribute('fill', state.alert ? '#E63946' : '#22384F');
      els.rings.forEach(r => r.classList.toggle('active', state.alert));
    }

    // Descripciones operativas de estado
    let mode, desc, pillText = 'MODO ACTIVO';
    
    if (state.alert) {
      mode = 'Modo Alerta y Mantenimiento';
      desc = 'El personal de soporte activó la señal de asistencia: el buzzer emite alerta sonora y la farola emite indicación visual geolocalizada.';
      pillText = 'ALERTA TÉCNICA';
    } else if (!state.night) {
      mode = 'Reposo Diurno Autosostenible';
      desc = 'La fotorresistencia (LDR) registra luz solar suficiente: la luminaria permanece completamente apagada optimizando energía.';
      pillText = 'DIA / REPOSO';
    } else if (state.presence) {
      mode = 'Modo Presencia Activa (100% Flujo)';
      desc = 'El sensor PIR detectó un transeúnte en la ruta: la luminaria se eleva al 100% de potencia acompañando su recorrido seguro.';
      pillText = 'DETECCIÓN PIR';
    } else {
      mode = 'Modo Ahorro de Energía (20% - 30%)';
      desc = 'Es de noche y el sendero está desierto: la iluminación atenúa su flujo al mínimo para conservar energía sin dejar a oscuras la ruta.';
      pillText = 'AHORRO NOCTURNO';
    }

    els.modeName.textContent = mode;
    els.modeDesc.textContent = desc;
    if (els.statusPill) els.statusPill.textContent = pillText;

    els.sLdr.textContent = state.night ? 'oscuridad' : 'luz diurna';
    els.sPir.textContent = state.presence ? 'movimiento' : 'sin movimiento';
    els.sBuz.textContent = state.alert ? 'activo' : 'inactivo';
  }

  render();
})();
