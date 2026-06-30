// ─── STORAGE: utilidades de almacenamiento local ───
// Wrapper genérico sobre localStorage para uso de los módulos de /modules.
var KalmaStorage = {
  get: function(key, fallback){ var v = localStorage.getItem(key); return v === null ? fallback : v; },
  set: function(key, value){ localStorage.setItem(key, value); },
  getJSON: function(key, fallback){ try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e){ return fallback; } },
  setJSON: function(key, value){ localStorage.setItem(key, JSON.stringify(value)); },
  remove: function(key){ localStorage.removeItem(key); }
};

// ─── MIGRACIÓN DE DATOS (ALMA → KALMA) ───
(function(){
  if(localStorage.getItem('alma-onboarded') && !localStorage.getItem('kalma-onboarded')){
    localStorage.setItem('kalma-onboarded','1');
  }
})();
