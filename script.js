"use strict";

/* ---------------------------------------------------------
   Nav: sombra al hacer scroll + menú móvil
--------------------------------------------------------- */
(function(){
  var nav = document.getElementById('siteNav');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  window.addEventListener('scroll', function(){
    nav.classList.toggle('scrolled', window.scrollY > 12);
  });

  toggle.addEventListener('click', function(){
    var isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ---------------------------------------------------------
   Nav: resaltar el enlace de la sección visible
--------------------------------------------------------- */
(function(){
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  if(!links.length || !('IntersectionObserver' in window)) return;

  var map = {};
  links.forEach(function(link){
    var id = link.getAttribute('href').replace('#', '');
    var section = document.getElementById(id);
    if(section) map[id] = link;
  });

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var link = map[entry.target.id];
      if(!link) return;
      if(entry.isIntersecting){
        links.forEach(function(l){ l.classList.remove('is-active'); });
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  Object.keys(map).forEach(function(id){
    observer.observe(document.getElementById(id));
  });
})();

/* ---------------------------------------------------------
   Simulación interactiva del sistema R.U.T.A.
--------------------------------------------------------- */
(function(){
  var state = { night: true, presence: false, alert: false };

  var els = {
    skyDay: document.querySelector('.sky-day'),
    skyNight: document.querySelector('.sky-night'),
    stars: document.querySelector('.stars'),
    bulb: document.querySelector('.bulb'),
    glow: document.querySelector('.bulb-glow'),
    figure: document.querySelector('.figure'),
    buzzer: document.querySelector('.buzzer-body'),
    rings: document.querySelectorAll('.alert-ring'),
    modeName: document.getElementById('modeName'),
    modeDesc: document.getElementById('modeDesc'),
    sLdr: document.getElementById('sLdr'),
    sPir: document.getElementById('sPir'),
    sBuz: document.getElementById('sBuz'),
    tglNight: document.getElementById('tglNight'),
    tglPresence: document.getElementById('tglPresence'),
    tglAlert: document.getElementById('tglAlert')
  };

  // Si el marcado de la simulación no está presente, no continuar.
  if(!els.bulb || !els.tglNight) return;

  function bindToggle(btn, key){
    btn.addEventListener('click', function(){
      state[key] = !state[key];
      btn.setAttribute('aria-pressed', String(state[key]));
      render();
    });
  }
  bindToggle(els.tglNight, 'night');
  bindToggle(els.tglPresence, 'presence');
  bindToggle(els.tglAlert, 'alert');

  function render(){
    // cielo y estrellas
    els.skyDay.style.opacity = state.night ? 0 : 1;
    els.skyNight.style.opacity = state.night ? 1 : 0;
    els.stars.style.opacity = state.night ? 1 : 0;

    // brillo de la luminaria
    var lampState = !state.night ? 'off' : (state.presence ? 'bright' : 'dim');
    if(lampState === 'off'){
      els.bulb.setAttribute('fill', '#5B3B14');
      els.glow.style.opacity = 0.08;
      els.glow.setAttribute('r', 10);
    } else if(lampState === 'dim'){
      els.bulb.setAttribute('fill', '#C98A3C');
      els.glow.style.opacity = 0.35;
      els.glow.setAttribute('r', 22);
    } else {
      els.bulb.setAttribute('fill', '#F6CB8B');
      els.glow.style.opacity = 0.85;
      els.glow.setAttribute('r', 42);
    }

    // figura caminando
    els.figure.classList.toggle('shown', state.presence);
    els.figure.classList.toggle('hidden', !state.presence);

    // buzzer / alerta
    els.buzzer.setAttribute('fill', state.alert ? '#D1495B' : '#22384F');
    els.rings.forEach(function(r){ r.classList.toggle('active', state.alert); });

    // texto de estado
    var mode, desc;
    if(state.alert){
      mode = 'Modo alerta y mantenimiento';
      desc = 'El personal activó el botón de emergencia: el zumbador y la señal visual avisan en ese punto del sendero.';
    } else if(!state.night){
      mode = 'Reposo diurno';
      desc = 'La fotorresistencia detecta luz natural suficiente: el sistema mantiene las luminarias apagadas.';
    } else if(state.presence){
      mode = 'Modo presencia';
      desc = 'El sensor PIR detectó a alguien caminando por el sendero: la luminaria sube al 100% de intensidad.';
    } else {
      mode = 'Modo ahorro de energía';
      desc = 'Es de noche y el sendero está vacío: la luminaria baja su intensidad para ahorrar energía.';
    }
    els.modeName.textContent = mode;
    els.modeDesc.textContent = desc;

    els.sLdr.textContent = state.night ? 'oscuridad' : 'luz diurna';
    els.sPir.textContent = state.presence ? 'movimiento' : 'sin movimiento';
    els.sBuz.textContent = state.alert ? 'activo' : 'inactivo';
  }

  render();
})();
