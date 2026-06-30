// ─── MODO EMERGENCIA ───
var emPhrases = [
  'No tenés que tener todo resuelto ahora mismo.',
  'Respirá. Este momento también va a pasar.',
  'No estás sola. Aunque ahora se sienta así.',
  'Tu dolor es válido. Tu fuerza, también.',
  'Un paso. Solo uno. Eso es suficiente.',
  'Estás haciendo lo mejor que podés con lo que tenés.',
  'Este momento no define todo lo que sos.',
];

// ── RESPIRACIÓN 4-7-8 (botón SOS) ──
// Evidencia: activa nervio vago, baja FC y PA en segundos
// Dr. Andrew Weil / Harvard Medical - validado clínicamente para ansiedad aguda
// Patrón: inhala 4s → retiene 7s → exhala 8s → loop
// ─── RESPIRACIÓN 4-7-8 SOS ───
// ÚNICO sistema. Inhala 4s → Retené 7s → Exhala 8s
// Técnica Dr. Andrew Weil — reduce ansiedad aguda activando nervio vago

var _emTimer  = null;   // único timer activo
var _emCntTimer = null; // timer del contador regresivo

// Fases: [0] inhala 4s  [1] retenÉ 7s  [2] exhala 8s
var _emPhases = [
  { label:'Inhala',  inst:'por la nariz',    secs:4,
    scale:1.18, shadow:'0 0 44px rgba(239,68,68,.5), inset 0 0 28px rgba(239,68,68,.15)',
    bg:'radial-gradient(circle, rgba(239,68,68,.6) 0%, rgba(239,68,68,.15) 65%, transparent 100%)' },
  { label:'Retené',  inst:'el aire adentro', secs:7,
    scale:1.22, shadow:'0 0 56px rgba(239,68,68,.65), inset 0 0 36px rgba(239,68,68,.2)',
    bg:'radial-gradient(circle, rgba(239,68,68,.72) 0%, rgba(239,68,68,.22) 65%, transparent 100%)' },
  { label:'Exhala',  inst:'por la boca',     secs:8,
    scale:1.0,  shadow:'0 0 14px rgba(239,68,68,.18), inset 0 0 6px rgba(239,68,68,.05)',
    bg:'radial-gradient(circle, rgba(239,68,68,.28) 0%, rgba(239,68,68,.05) 65%, transparent 100%)' }
];
var _emCurPhase = -1;

function _emApply(ph) {
  var p  = _emPhases[ph];
  var td = p.secs + 's';
  var outer = document.getElementById('em-breath-outer');
  var mid   = document.getElementById('em-breath-mid');
  var inner = document.getElementById('em-breath-inner');
  var lbl   = document.getElementById('em-breath-label');
  var inst  = document.getElementById('em-breath-inst');
  var cnt   = document.getElementById('em-breath-count');
  var arc   = document.getElementById('em-breath-arc');

  if(outer){
    outer.style.transition = 'transform '+td+' cubic-bezier(.4,0,.2,1), box-shadow '+td+' ease';
    outer.style.transform  = 'scale('+p.scale+')';
    outer.style.boxShadow  = p.shadow;
  }
  if(mid){
    mid.style.transition = 'transform '+td+' cubic-bezier(.4,0,.2,1)';
    mid.style.transform  = 'scale('+(p.scale*.97)+')';
  }
  if(inner){
    inner.style.transition = 'transform '+td+' cubic-bezier(.4,0,.2,1), background '+td+' ease';
    inner.style.transform  = 'scale('+(p.scale*.92)+')';
    inner.style.background = p.bg;
  }
  if(lbl)  lbl.textContent  = p.label;
  if(inst) inst.textContent = p.inst;
  if(cnt)  cnt.textContent  = p.secs;

  // Arco: inhala = llena (540→0), retené = mantiene lleno, exhala = vacía (0→540)
  if(arc){
    arc.style.transition = 'none';
    if(ph === 0) arc.style.strokeDashoffset = '540';       // reset a vacío
    else if(ph === 1) arc.style.strokeDashoffset = '0';    // full
    // ph=2: viene de retené=0, no resetear
    void arc.getBoundingClientRect();                       // force reflow
    if(ph === 0){
      arc.style.transition = 'stroke-dashoffset '+td+' linear';
      arc.style.strokeDashoffset = '0';                    // llena en 4s
    } else if(ph === 1){
      // mantener lleno, sin animación
    } else {
      arc.style.transition = 'stroke-dashoffset '+td+' linear';
      arc.style.strokeDashoffset = '540';                  // vacía en 8s
    }
  }
}

function _emCountdown(secs) {
  clearInterval(_emCntTimer);
  var el = document.getElementById('em-breath-count');
  var remaining = secs;
  if(el) el.textContent = remaining;
  _emCntTimer = setInterval(function(){
    remaining--;
    if(el) el.textContent = remaining > 0 ? remaining : '';
    if(remaining <= 0) clearInterval(_emCntTimer);
  }, 1000);
}

function _emRunPhase(ph) {
  _emCurPhase = ph % 3;
  _emApply(_emCurPhase);
  _emCountdown(_emPhases[_emCurPhase].secs);
  _emTimer = setTimeout(function(){ _emRunPhase(_emCurPhase + 1); },
                        _emPhases[_emCurPhase].secs * 1000);
}

function startEmBreath() {
  clearTimeout(_emTimer);
  clearInterval(_emCntTimer);
  _emCurPhase = -1;
  _emRunPhase(0);   // arranca inmediatamente en INHALA 4s
}

function stopEmBreath() {
  clearTimeout(_emTimer);
  clearInterval(_emCntTimer);
  var outer = document.getElementById('em-breath-outer');
  var arc   = document.getElementById('em-breath-arc');
  if(outer){ outer.style.transition='transform 0.3s'; outer.style.transform='scale(1)'; outer.style.boxShadow=''; }
  if(arc)  { arc.style.transition='none'; arc.style.strokeDashoffset='540'; }
}

function openEmergency() {
  stopEmBreath();  // limpiar cualquier estado previo
  initHelplines();
  document.getElementById('emergency-overlay').classList.add('open');
  loadEmContact();
  document.getElementById('em-phrase').textContent = emPhrases[Math.floor(Math.random()*emPhrases.length)];
  document.getElementById('em-write').value = '';
  startEmBreath(); // arrancar 4-7-8 limpio
}

function closeEmergency() {
  stopEmBreath();
  document.getElementById('emergency-overlay').classList.remove('open');
}

// ── LÍNEAS DE AYUDA POR PAÍS ──
var HELPLINES = {
  AR: {
    name: '🇦🇷 Argentina',
    lines: [
      { desc: 'Violencia de género (24h)', tel: '144', wsp: '+5491127716463' },
      { desc: 'Emergencia violencia (CABA)', tel: '137', wsp: null },
      { desc: 'Salud mental gratuita', tel: '08009990091', wsp: null },
      { desc: 'Emergencias', tel: '911', wsp: null },
    ]
  },
  MX: {
    name: '🇲🇽 México',
    lines: [
      { desc: 'Línea de la Vida (crisis, 24h)', tel: '8009112000', wsp: null },
      { desc: 'ConTacto Joven (13-29 años)', tel: null, wsp: '+525579009669' },
      { desc: 'UNAM Atención Psicológica', tel: '5550250855', wsp: null },
      { desc: 'Emergencias', tel: '911', wsp: null },
    ]
  },
  CL: {
    name: '🇨🇱 Chile',
    lines: [
      { desc: 'Crisis salud mental y suicidio (24h)', tel: '*4141', wsp: null },
      { desc: 'Violencia de género', tel: '1455', wsp: null },
      { desc: 'Emergencias', tel: '131', wsp: null },
    ]
  },
  CO: {
    name: '🇨🇴 Colombia',
    lines: [
      { desc: 'Línea 106 - Salud Mental (24h)', tel: '106', wsp: null },
      { desc: 'Violencia de género', tel: '155', wsp: null },
      { desc: 'Emergencias', tel: '123', wsp: null },
    ]
  },
  UY: {
    name: '🇺🇾 Uruguay',
    lines: [
      { desc: 'Apoyo emocional (24h)', tel: '08001920', wsp: null },
      { desc: 'Prevención suicidio (Línea Vida)', tel: '08000767', wsp: null },
      { desc: 'Violencia doméstica', tel: '08004141', wsp: null },
      { desc: 'Emergencias', tel: '911', wsp: null },
    ]
  },
  DEFAULT: {
    name: '🌎 Internacional',
    lines: [
      { desc: 'Argentina - Violencia de género', tel: '144', wsp: '+5491127716463' },
      { desc: 'México - Línea de la Vida', tel: '8009112000', wsp: null },
      { desc: 'Chile - Crisis salud mental', tel: '*4141', wsp: null },
    ]
  }
};

function renderHelplines(countryCode) {
  var data = HELPLINES[countryCode] || HELPLINES['DEFAULT'];
  var body = document.getElementById('em-helplines-body');
  if (!body) return;
  var html = '<div style="background:rgba(255,255,255,.06);border-radius:0 0 12px 12px;padding:4px 0;">';
  html += '<div class="em-hl-country">';
  html += '<div class="em-hl-country-name">' + data.name + '</div>';
  data.lines.forEach(function(line) {
    html += '<div class="em-hl-line">';
    html += '<span class="em-hl-desc">' + line.desc + '</span>';
    var btns = '';
    if (line.tel) {
      btns += '<a class="em-hl-call" href="tel:' + line.tel + '" onclick="event.stopPropagation()">📞 ' + line.tel + '</a>';
    }
    if (line.wsp) {
      btns += '<a class="em-hl-call" href="https://wa.me/' + line.wsp.replace(/[^0-9]/g,'') + '" target="_blank" onclick="event.stopPropagation()" style="background:rgba(37,211,102,.2);border-color:rgba(37,211,102,.4);">💬 WA</a>';
    }
    html += '<div style="display:flex;gap:5px;flex-shrink:0;">' + btns + '</div>';
    html += '</div>';
  });
  html += '</div>';
  // Selector de país
  html += '<div style="padding:8px 14px;border-top:1px solid rgba(255,255,255,.08);">';
  html += '<select onchange="renderHelplines(this.value);event.stopPropagation()" style="width:100%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:6px 8px;color:#fff;font-size:.75rem;">';
  var countries = [{code:'AR',name:'🇦🇷 Argentina'},{code:'MX',name:'🇲🇽 México'},{code:'CL',name:'🇨🇱 Chile'},{code:'CO',name:'🇨🇴 Colombia'},{code:'UY',name:'🇺🇾 Uruguay'}];
  countries.forEach(function(c){
    html += '<option value="' + c.code + '"' + (c.code === countryCode ? ' selected' : '') + '>' + c.name + '</option>';
  });
  html += '</select></div>';
  html += '</div>';
  body.innerHTML = html;
}

function initHelplines() {
  // Try to detect country from timezone/language
  var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  var lang = navigator.language || '';
  var country = 'DEFAULT';
  if (tz.includes('Argentina') || tz.includes('Buenos_Aires')) country = 'AR';
  else if (tz.includes('Mexico') || tz.includes('Mexico_City') || tz.includes('Monterrey') || tz.includes('Mazatlan')) country = 'MX';
  else if (tz.includes('Santiago')) country = 'CL';
  else if (tz.includes('Bogota')) country = 'CO';
  else if (tz.includes('Montevideo')) country = 'UY';
  renderHelplines(country);
  // Auto-open
  setTimeout(function(){
    var b = document.getElementById('em-helplines-body');
    var t = document.getElementById('em-hl-toggle');
    if(b && !b.classList.contains('open')){
      b.classList.add('open');
      b.style.maxHeight = b.scrollHeight + 'px';
      if(t) t.querySelector('.em-hl-arrow').textContent = '▲';
      // Round button corners
      if(t) t.style.borderRadius = '12px 12px 0 0';
    }
  }, 50);
  // Make open/close for the helplines body work with class
  var style = document.getElementById('em-hl-open-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'em-hl-open-style';
    style.textContent = '#em-helplines-body.open{max-height:600px!important;}';
    document.head.appendChild(style);
  }
}

function emSaveNote() {
  var text = document.getElementById('em-write').value.trim();
  if(!text) return;
  var saved = JSON.parse(localStorage.getItem('kalma-bloc') || '""');
  var timestamp = new Date().toLocaleString('es-AR', {dateStyle:'short',timeStyle:'short'});
  var newEntry = '[Nota privada - ' + timestamp + ']\n' + text + '\n\n';
  localStorage.setItem('kalma-bloc', newEntry + (saved || ''));
  // Update bloc textarea if open
  var blocTa = document.getElementById('bloc-text');
  if(blocTa) blocTa.value = localStorage.getItem('kalma-bloc') || '';
  showNotif('💜 Nota guardada en tu bloc.');
  document.getElementById('em-write').value = '';
}

function emClearAndClose() {
  document.getElementById('em-write').value = '';
  closeEmergency();
}

// ── EMERGENCIA CONTACTO ───────────────────────────────────────────────
function saveEmContact() {
  var name = (document.getElementById('em-contact-name')||{}).value||'';
  var phone = (document.getElementById('em-contact-phone')||{}).value||'';
  name = name.trim(); phone = phone.trim();
  if(!name && !phone){ showNotif('Ingresá nombre o número.'); return; }
  localStorage.setItem('kalma-em-contact', JSON.stringify({name:name,phone:phone}));
  showNotif('Contacto guardado.');
  loadEmContact();
}
function loadEmContact() {
  var saved = JSON.parse(localStorage.getItem('kalma-em-contact')||'null');
  var infoEl = document.getElementById('em-contact-info');
  var btnsEl = document.getElementById('em-contact-btns');
  var callBtn = document.getElementById('em-call-btn');
  var wspBtn = document.getElementById('em-wsp-btn');
  if(saved && (saved.name||saved.phone)) {
    if(infoEl) infoEl.textContent = (saved.name||'') + (saved.phone?' · '+saved.phone:'');
    if(btnsEl) btnsEl.style.display = 'flex';
    if(callBtn && saved.phone) callBtn.href = 'tel:'+saved.phone.replace(/\s/g,'');
    if(wspBtn && saved.phone) wspBtn.href = 'https://wa.me/'+saved.phone.replace(/[^\d]/g,'');
    var ni = document.getElementById('em-contact-name');
    var pi = document.getElementById('em-contact-phone');
    if(ni) ni.value = saved.name||'';
    if(pi) pi.value = saved.phone||'';
  } else {
    if(infoEl) infoEl.innerHTML = '¿Necesitás llamar a alguien?<br><span style="font-size:.78rem;opacity:.7;">Configurá tu contacto de confianza en ⚙️ Configuración</span>';
    if(btnsEl) btnsEl.style.display = 'none';
  }
}
loadEmContact();
