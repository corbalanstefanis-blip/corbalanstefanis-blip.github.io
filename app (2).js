// ─── PWA: REGISTRO DEL SERVICE WORKER ───
if('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js')
      .then(function(reg) {
        console.log('KALMA SW registrado:', reg.scope);
        // Pedir permiso de notificaciones proactivamente si no se ha pedido
        if(notifSupported && typeof notifSupported === 'function' &&
           Notification.permission === 'default') {
          // No pedir al cargar, solo cuando el usuario activa un recordatorio
        }
      })
      .catch(function(err) { console.log('SW error:', err); });
    // Escuchar mensajes del SW (notificaciones mientras la app está abierta)
    navigator.serviceWorker.addEventListener('message', function(e) {
      if(e.data && e.data.type === 'SHOW_NOTIF') {
        showNotif(e.data.icon + ' ' + e.data.body);
      }
    });
  });
}


// ─── SCROLL ANIMATIONS ───
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold:.12});
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

// ─── FILTER ───
function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card => {
    card.style.display = (cat === 'all' || (card.dataset.cat || '').includes(cat)) ? '' : 'none';
  });
}

// ─── CART ───
function openCart(name, price) {
  document.getElementById('cart-prod-name').textContent = name + ' · ' + price;
  document.getElementById('cart-overlay').classList.add('open');
}
function closeCart() { document.getElementById('cart-overlay').classList.remove('open'); }
function handlePayment(m) { closeCart(); showNotif('✓ Redirigiendo a ' + m + '...'); }

// ─── CHAT ───
const chatNames = ['Sol','Cami','Anto','Vale','Juli','Male','Flo'];
const chatMsgs = [
  'Totalmente de acuerdo! 🙌',
  'Lo mismo me pasó a mí, no estás sola 💕',
  'Chicas qué bueno encontrarlas acá ✨',
  '¿Alguien probó el journal? Me está encantando',
  'Hoy hice el workout y fue épico 💪',
  'Compré el bundle y valió TODO',
  '¿Recomiendan empezar por skincare o nutrición?'
];
function sendMsg() {
  const inp = document.getElementById('chat-in');
  const val = inp.value.trim();
  if(!val) return;
  const box = document.getElementById('chat-msgs');
  const d = document.createElement('div');
  d.className = 'msg own';
  d.innerHTML = `<div><div class="msg-name">Vos</div><div class="msg-bubble">${val}</div><div class="msg-time">ahora</div></div><div class="msg-av">✨</div>`;
  box.appendChild(d);
  inp.value = '';
  box.scrollTop = box.scrollHeight;
  setTimeout(() => {
    const r = document.createElement('div');
    r.className = 'msg';
    const rn = chatNames[Math.floor(Math.random()*chatNames.length)];
    const rm = chatMsgs[Math.floor(Math.random()*chatMsgs.length)];
    r.innerHTML = `<div class="msg-av">🌸</div><div><div class="msg-name">${rn}</div><div class="msg-bubble">${rm}</div><div class="msg-time">ahora</div></div>`;
    box.appendChild(r);
    box.scrollTop = box.scrollHeight;
  }, 900 + Math.random()*1200);
}

// ─── NEWSLETTER ───
function handleNewsletter(e) {
  e.preventDefault();
  showNotif('💌 ¡Ya sos parte de KALMA! Revisá tu mail.');
  e.target.reset();
  return false;
}

// ─── NOTIF ───
function showNotif(msg) {
  const n = document.getElementById('notif');
  n.textContent = msg; n.style.display = 'block';
  setTimeout(() => { n.style.display = 'none'; }, 3000);
}

// ─── FRASES DIARIAS ───
(function(){
  const frases = [
    '"El cuidado personal no es egoísmo. Es la base de todo lo que das a los demás."',
    '"No tenés que ganarte el descanso. El descanso es tuyo por derecho."',
    '"Una mujer que conoce su valor no pide permiso para brillar."',
    '"Tu rutina de hoy es tu bienestar de mañana. Un pequeño paso basta."',
    '"El caos es temporal. Tu fuerza, permanente."',
    '"Nadie puede darte lo que vos ya tenés adentro."',
    '"Cuidarte no es un lujo. Es la decisión más inteligente que podés tomar."',
    '"Las mejores versiones de nosotras nacen en los días difíciles."',
    '"Permiso para ser exactamente quien sos hoy."',
    '"Tu cuerpo no es un proyecto. Es tu hogar."',
    '"Estás haciendo más de lo que creés. Date el crédito."',
    '"El primer paso no tiene que ser perfecto. Solo tiene que existir."',
    '"Tus prioridades definen quién sos. Ponete primera en la lista."',
    '"La constancia suave vence al esfuerzo agotador siempre."',
    '"Sos suficiente en este momento, tal como estás."',
    '"Lo que nutres crece. Nutrite a vos primero."',
    '"No compartas tu energía con quien no la cuida."',
    '"Una pequeña victoria también es una victoria. Celebrala."',
    '"El equilibrio no es perfección. Es elegir qué importa hoy."',
    '"Tus sueños merecen la misma atención que tus obligaciones."',
    '"Ser mujer es multiplicar. Pero multiplicar desde el amor, no desde el agotamiento."',
    '"Lo que hacés todos los días importa más que lo que hacés de vez en cuando."',
    '"Tu intuición es el GPS más confiable que tenés. Escuchala."',
    '"El autocuidado empieza en el momento en que decidís que lo merecés."',
    '"Hacé espacio para lo que te llena. Sin culpa."',
    '"No necesitás aprobación para cambiar."',
    '"Cada día es una página nueva. Escribila con intención."',
    '"Tu tiempo es lo más valioso que tenés. Invertilo en vos."',
    '"La versión más libre de vos ya existe. Solo la estás descubriendo."',
    '"Construite a vos misma con la misma dedicación con que cuidas a los demás."'
  ];
  var now = new Date();
  var isMarch8 = now.getMonth() === 2 && now.getDate() === 8;
  var frase;
  if(isMarch8) {
    frase = '"Hoy el mundo recuerda lo que vos sabés todos los días: tu fuerza, tu valor y tu luz son irremplazables. Feliz Día Internacional de la Mujer. — KALMA"';
  } else {
    var idx = Math.floor(Date.now() / 86400000) % frases.length;
    frase = frases[idx];
  }
  const el = document.getElementById('daily-quote');
  if(el) el.textContent = frase;
})();

// ─── CAJA DE HERRAMIENTAS ───
function toggleToolbox(){
  document.getElementById('toolbox-panel').classList.toggle('open');
}
function switchTool(id, btn){
  ['bloc','calc','cal','lista','habitos','galeria'].forEach(function(t){
    var el = document.getElementById('tool-'+t);
    if(el) el.style.display = (t===id) ? 'block' : 'none';
  });
  document.querySelectorAll('.toolbox-tab').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  if(id==='cal') renderCal();
  if(id==='lista') renderList();
  if(id==='habitos') renderHabits();
  if(id==='galeria') galeriaLoad();
}
// Init first tab visible
document.getElementById('tool-calc').style.display='none';
document.getElementById('tool-cal').style.display='none';
document.getElementById('tool-lista').style.display='none';
document.getElementById('tool-habitos').style.display='none';
document.getElementById('tool-galeria').style.display='none';

// ── CALCULADORA ──
let calcExpr='';
const calcScr=document.getElementById('calc-screen');
function calcInput(v){
  if(v==='C'){calcExpr='';calcScr.textContent='0';return;}
  if(v==='='){
    try{
      let e=calcExpr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
      const r=Function('"use strict";return('+e+')')();
      calcScr.textContent=+r.toFixed(10)+'';
      calcExpr=r+'';
    }catch{calcScr.textContent='Error';calcExpr='';}
    return;
  }
  if(v==='±'){
    if(calcExpr) calcExpr=(parseFloat(calcExpr)*-1)+'';
    calcScr.textContent=calcExpr||'0';return;
  }
  if(v==='%'){
    if(calcExpr) calcExpr=(parseFloat(calcExpr)/100)+'';
    calcScr.textContent=calcExpr||'0';return;
  }
  calcExpr+=v;
  calcScr.textContent=calcExpr;
}

// ── CALENDARIO ──
let calYear=new Date().getFullYear(), calMonth=new Date().getMonth();
const calMarkedKey='kalma-cal-marks';
let calMarked=JSON.parse(localStorage.getItem(calMarkedKey)||'[]');
const calNames=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const calDays=['Do','Lu','Ma','Mi','Ju','Vi','Sá'];
function renderCal(){
  document.getElementById('cal-month-label').textContent=calNames[calMonth]+' '+calYear;
  const grid=document.getElementById('cal-grid');
  grid.innerHTML='';
  calDays.forEach(d=>{const s=document.createElement('div');s.className='cal-day-name';s.textContent=d;grid.appendChild(s);});
  const first=new Date(calYear,calMonth,1).getDay();
  const total=new Date(calYear,calMonth+1,0).getDate();
  const today=new Date();
  for(let i=0;i<first;i++){const e=document.createElement('div');e.className='cal-day other';e.textContent='';grid.appendChild(e);}
  for(let d=1;d<=total;d++){
    const e=document.createElement('div');e.className='cal-day';e.textContent=d;
    const key=`${calYear}-${calMonth}-${d}`;
    if(d===today.getDate()&&calMonth===today.getMonth()&&calYear===today.getFullYear()) e.classList.add('today');
    if(calMarked.includes(key)) e.classList.add('marked');
    e.onclick=()=>{
      if(calMarked.includes(key)) calMarked=calMarked.filter(x=>x!==key);
      else calMarked.push(key);
      localStorage.setItem(calMarkedKey,JSON.stringify(calMarked));
      renderCal();
    };
    grid.appendChild(e);
  }
}
function calMove(d){
  calMonth+=d;
  if(calMonth>11){calMonth=0;calYear++;}
  if(calMonth<0){calMonth=11;calYear--;}
  renderCal();
}

// ── LISTAS ──
let curList='compras';
const listsKey='kalma-lists';
let listsData=JSON.parse(localStorage.getItem(listsKey)||'{"compras":[],"pendientes":[],"ideas":[]}');
function saveLists(){localStorage.setItem(listsKey,JSON.stringify(listsData));}
function switchList(name, btn){
  curList=name;
  document.querySelectorAll('.list-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderList();
}
function renderList(){
  const cont=document.getElementById('list-items');
  cont.innerHTML='';
  (listsData[curList]||[]).forEach((item,i)=>{
    const div=document.createElement('div');
    div.className='list-item'+(item.done?' done':'');
    div.innerHTML=`<input type="checkbox" ${item.done?'checked':''} onchange="toggleItem(${i})"/>
      <span class="list-item-text">${item.text}</span>
      <button class="list-item-del" onclick="deleteItem(${i})">✕</button>`;
    cont.appendChild(div);
  });
}
function addListItem(){
  const inp=document.getElementById('list-input');
  const v=inp.value.trim();
  if(!v)return;
  if(!listsData[curList]) listsData[curList]=[];
  listsData[curList].push({text:v,done:false});
  saveLists();inp.value='';renderList();
}
function toggleItem(i){listsData[curList][i].done=!listsData[curList][i].done;saveLists();renderList();}
function deleteItem(i){listsData[curList].splice(i,1);saveLists();renderList();}

// ─── VIDEO PLAYER ───
function loadVideo(card, videoId) {
  const thumb = card.querySelector('.video-thumb');
  thumb.innerHTML = '<iframe src="https://www.youtube.com/embed/'+videoId+'?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
}

// ─── PERFIL ───
const PROFILE_KEY = 'kalma-profile';
let profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{"av":"🌸","name":"","bio":"","prefs":[],"since":'+Date.now()+'}');
function applyProfile() {
  // Solo actualizar avatar si no hay foto guardada
  var savedPhoto = localStorage.getItem('kalma-profile-photo');
  if(!savedPhoto) {
    var navAv = document.getElementById('nav-av');
    var avBig = document.getElementById('profile-av-big');
    if(navAv) navAv.textContent = profile.av;
    if(avBig) { avBig.innerHTML = profile.av; avBig.style.fontSize = ''; }
  }
  document.getElementById('nav-name').textContent = profile.name || 'Mi perfil';
  if(profile.name) document.getElementById('profile-name').value = profile.name;
  if(profile.bio) document.getElementById('profile-bio').value = profile.bio;
  document.querySelectorAll('.pref-tag').forEach(t => {
    var key = t.dataset.key || t.textContent.trim();
    t.classList.toggle('active', profile.prefs && profile.prefs.includes(key));
  });
  const days = Math.max(1, Math.floor((Date.now() - (profile.since||Date.now())) / 86400000) + 1);
  document.getElementById('stat-dias').textContent = days;
  var sinceEl = document.getElementById('stat-since');
  if(sinceEl && profile.since) {
    var joinDate = new Date(profile.since);
    sinceEl.textContent = 'desde ' + joinDate.toLocaleDateString('es-AR',{day:'2-digit',month:'short',year:'numeric'});
  }
  const notes = (localStorage.getItem('kalma-bloc')||'').split('\n').filter(l=>l.trim()).length;
  document.getElementById('stat-notas').textContent = notes;
  const todayHabits = JSON.parse(localStorage.getItem('kalma-habits-today')||'[]');
  document.getElementById('stat-habitos').textContent = todayHabits.filter(h=>h.done).length;
}
function openProfile() { applyProfile(); document.getElementById('profile-overlay').classList.add('open'); }
function closeProfile() { document.getElementById('profile-overlay').classList.remove('open'); }
function toggleAvPicker() { document.getElementById('av-picker').classList.toggle('show'); }
function selectAv(av) {
  profile.av = av;
  document.getElementById('profile-av-big').textContent = av;
  document.getElementById('av-picker').classList.remove('show');
}
function togglePref(el) {
  el.classList.toggle('active');
  var key = el.dataset.key || el.textContent.trim();
  if(!profile.prefs) profile.prefs = [];
  var idx = profile.prefs.indexOf(key);
  if(idx > -1) profile.prefs.splice(idx, 1);
  else profile.prefs.push(key);
}
function saveProfile() {
  profile.name = document.getElementById('profile-name').value.trim();
  profile.bio = document.getElementById('profile-bio').value.trim();
  if(!profile.since) profile.since = Date.now();
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  applyProfile();
  closeProfile();
  showNotif('✨ Perfil guardado, ' + (profile.name||'vos') + '!');
}
applyProfile();

// ─── MODO 5 MINUTOS ───
let cincoInterval = null, cincoSecs = 300, cincoPaused = false;
const cincoFrases = [
  'Este momento es tuyo.',
  'Respirá. Nada urgente por ahora.',
  'Estás exactamente donde tenés que estar.',
  'Soltá lo que no controlás.',
  'Sos más fuerte de lo que creés.',
  'Cada respiración es un reset.',
  'Mereces este silencio.'
];
// ── RESPIRACIÓN COHERENCIA CARDÍACA 5-5 (modo 5 min) ──
// Evidencia: optimiza variabilidad frecuencia cardíaca, reduce cortisol
// Patrón: inhala 5s → exhala 5s (6 ciclos/min = coherencia cardíaca óptima)
let breathPhase = 0; // 0=inhala, 1=exhala
let breathInterval = null;
let breathCountInterval = null;
let breathCountVal = 5;

var CINCO_PHASES = [
  { label:'Inhala', secs:5,
    ring:{scale:1.18, shadow:'0 0 40px rgba(94,234,212,.6), inset 0 0 40px rgba(94,234,212,.2)'},
    mid:{scale:1.14}, inner:{scale:1.10},
    arcColor:'rgba(94,234,212,.7)', arcFill:603 },
  { label:'Exhala', secs:5,
    ring:{scale:1.0, shadow:'0 0 16px rgba(94,234,212,.2), inset 0 0 10px rgba(94,234,212,.06)'},
    mid:{scale:1.0}, inner:{scale:1.0},
    arcColor:'rgba(94,234,212,.35)', arcFill:0 }
];

function applyBreathPhase(ph) {
  var p = CINCO_PHASES[ph];
  var ring = document.getElementById('breath-ring');
  var mid  = document.getElementById('breath-mid');
  var inner= document.getElementById('breath-inner');
  var lbl  = document.getElementById('breath-label');
  var arc  = document.getElementById('breath-arc');
  if(ring)  { ring.style.transform  = 'scale('+p.ring.scale+')'; ring.style.boxShadow = p.ring.shadow; }
  if(mid)   mid.style.transform   = 'scale('+p.mid.scale+')';
  if(inner) inner.style.transform = 'scale('+p.inner.scale+')';
  if(lbl)   lbl.textContent = p.label;
  if(arc) {
    var dur = p.secs + 's';
    arc.style.transition = 'stroke-dashoffset '+dur+' linear, stroke '+dur+' ease';
    arc.style.stroke = p.arcColor;
    arc.style.strokeDashoffset = (603 - p.arcFill) + '';
  }
  // Transición ring/mid/inner dura el mismo tiempo que la fase
  var transDur = p.secs + 's';
  if(ring)  ring.style.transitionDuration  = transDur;
  if(mid)   mid.style.transitionDuration   = transDur;
  if(inner) inner.style.transitionDuration = transDur;
}

function startBreathCounter(secs) {
  clearInterval(breathCountInterval);
  breathCountVal = secs;
  var el = document.getElementById('breath-count');
  if(el) el.textContent = breathCountVal;
  breathCountInterval = setInterval(function(){
    breathCountVal--;
    if(el) el.textContent = breathCountVal > 0 ? breathCountVal : '';
    if(breathCountVal <= 0) clearInterval(breathCountInterval);
  }, 1000);
}

function breathStep() {
  breathPhase = (breathPhase + 1) % 2;
  applyBreathPhase(breathPhase);
  startBreathCounter(CINCO_PHASES[breathPhase].secs);
  breathInterval = setTimeout(breathStep, CINCO_PHASES[breathPhase].secs * 1000);
}

function openCinco() {
  document.getElementById('cinco-overlay').classList.add('open');
  breathPhase = 1; // va a avanzar a 0 (inhala) en el primer paso
  startCinco();
  document.getElementById('cinco-phrase').textContent = cincoFrases[Math.floor(Math.random()*cincoFrases.length)];
}
function closeCinco() {
  document.getElementById('cinco-overlay').classList.remove('open');
  clearInterval(cincoInterval); clearTimeout(breathInterval); clearInterval(breathCountInterval);
  cincoSecs = parseInt(document.querySelector('.cinco-ctrl-btn.active-dur').textContent)*60||300;
  cincoPaused = false;
  updateCincoDisplay();
  // Reset circle
  var ring = document.getElementById('breath-ring');
  var arc  = document.getElementById('breath-arc');
  if(ring) { ring.style.transform='scale(1)'; ring.style.transitionDuration='0.1s'; }
  if(arc)  { arc.style.strokeDashoffset='603'; arc.style.transition='none'; }
}
function startCinco() {
  clearInterval(cincoInterval); clearTimeout(breathInterval); clearInterval(breathCountInterval);
  cincoPaused = false;
  cincoInterval = setInterval(function(){
    if(!cincoPaused){ cincoSecs--; updateCincoDisplay(); if(cincoSecs<=0) closeCinco(); }
  }, 1000);
  // Iniciar ciclo: primer step inmediato
  breathPhase = 1;
  breathStep();
}
function updateCincoDisplay() {
  const m = Math.floor(cincoSecs/60), s = cincoSecs%60;
  document.getElementById('cinco-timer').textContent = m+':'+(s<10?'0':'')+s;
}
function setCincoDur(min, btn) {
  document.querySelectorAll('.cinco-ctrl-btn').forEach(b=>b.classList.remove('active-dur'));
  btn.classList.add('active-dur');
  cincoSecs = min * 60;
  updateCincoDisplay();
  startCinco();
}
function toggleCinco() { cincoPaused = !cincoPaused; }

// ─── HÁBITOS ───
const HABITS_BASE = [
  {icon:'💧',name:'Tomar 8 vasos de agua'},
  {icon:'🏃‍♀️',name:'Moverme al menos 20 min'},
  {icon:'🌸',name:'Rutina de skincare'},
  {icon:'🧘',name:'5 min de meditación'},
  {icon:'📖',name:'Leer algo inspirador'},
  {icon:'😴',name:'Dormir antes de las 23hs'},
  {icon:'🥗',name:'Comer verduras hoy'},
];
const HABITS_KEY = 'kalma-habits-def';
const HABITS_TODAY_KEY = 'kalma-habits-today-' + new Date().toDateString();
let habitDefs = JSON.parse(localStorage.getItem(HABITS_KEY) || JSON.stringify(HABITS_BASE));
let habitsToday = JSON.parse(localStorage.getItem(HABITS_TODAY_KEY) || '[]');
// Sync: asegurar que habitsToday tenga todos los hábitos definidos
function syncHabits() {
  habitDefs.forEach(function(h,i){
    if(!habitsToday[i]) habitsToday[i] = {done:false};
  });
  localStorage.setItem(HABITS_TODAY_KEY, JSON.stringify(habitsToday));
}
syncHabits();
function renderHabits() {
  var d = new Date();
  var days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  var dateEl = document.getElementById('habit-date-label');
  if(dateEl) dateEl.textContent = days[d.getDay()]+', '+d.getDate()+'/'+('0'+(d.getMonth()+1)).slice(-2);
  var list = document.getElementById('habit-list');
  if(!list) return;
  list.innerHTML = '';
  habitDefs.forEach(function(h,i){
    var div = document.createElement('div');
    var done = habitsToday[i] && habitsToday[i].done;
    div.className = 'habit-item' + (done?' done':'');
    div.innerHTML =
      '<input type="checkbox"'+(done?' checked':'')+
      ' onclick="toggleHabit('+i+')" style="touch-action:manipulation;" />'+
      '<span class="habit-icon">'+h.icon+'</span>'+
      '<span class="habit-name">'+h.name+'</span>'+
      '<button class="habit-del" onclick="deleteHabit('+i+');event.stopPropagation();" title="Eliminar">✕</button>';
    list.appendChild(div);
  });
  var doneCnt = habitsToday.filter(function(h){return h&&h.done;}).length;
  var pct = habitDefs.length ? Math.round(doneCnt/habitDefs.length*100) : 0;
  var summEl = document.getElementById('habits-summary');
  if(summEl) summEl.textContent = doneCnt+' de '+habitDefs.length+' completados hoy · '+pct+'%';
}
function toggleHabit(i) {
  habitsToday[i] = {done: !(habitsToday[i]&&habitsToday[i].done)};
  localStorage.setItem(HABITS_TODAY_KEY, JSON.stringify(habitsToday));
  renderHabits();
}
function deleteHabit(i) {
  habitDefs.splice(i,1);
  habitsToday.splice(i,1);
  localStorage.setItem(HABITS_KEY, JSON.stringify(habitDefs));
  localStorage.setItem(HABITS_TODAY_KEY, JSON.stringify(habitsToday));
  renderHabits();
  showNotif('Hábito eliminado.');
}
function addHabit() {
  var inp = document.getElementById('habit-new-input');
  var v = (inp && inp.value) ? inp.value.trim() : '';
  if(!v) return;
  habitDefs.push({icon:'✅',name:v});
  habitsToday.push({done:false});
  localStorage.setItem(HABITS_KEY, JSON.stringify(habitDefs));
  localStorage.setItem(HABITS_TODAY_KEY, JSON.stringify(habitsToday));
  inp.value = '';
  renderHabits();
}

// ─── RECETARIO ───
// ─── RECETARIO KALMA — sistema de energía ───
var RECIPES = [
// ══ 🤍 HOY NECESITO ALGO FÁCIL ══
{id:1,energia:'facil',top:true,emoji:'🍝',name:'Fideos con manteca y queso',
 energy:'⚡',time:'10 min',porciones:'2',tags:['poco-lavar','economico'],comment:'El clásico de siempre. Listo antes de que te arrepientas.',
 ings:[{amount:'200g',item:'fideos (el formato que tengas)'},{amount:'30g',item:'manteca'},{amount:'c/n',item:'queso rallado'},{amount:'c/n',item:'sal'}],
 steps:['Cocinás los fideos en agua con sal según el paquete.','Escurrís y volvés a la olla apagada.','Agregás la manteca y mezclás hasta que se derrita.','Servís con queso rallado encima.']},

{id:2,energia:'facil',top:true,emoji:'🍳',name:'Arroz con huevo frito',
 energy:'⚡',time:'15 min',porciones:'1',tags:['poco-lavar','economico'],comment:'Reconfortante y real. Lo que hay, listo.',
 ings:[{amount:'1 taza',item:'arroz cocido (puede ser de ayer)'},{amount:'2',item:'huevos'},{amount:'c/n',item:'sal, aceite'}],
 steps:['Calentás el arroz en sartén o microondas.','En sartén con aceite, freís los huevos a tu gusto.','Ponés el arroz en el plato y el huevo arriba.','Salpimentás y listo.']},

{id:3,energia:'facil',top:true,emoji:'🍜',name:'Sopa con fideos',
 energy:'⚡',time:'15 min',porciones:'2',tags:['una-olla','economico'],comment:'Para los días de poco ánimo y mucho frío.',
 ings:[{amount:'1 l',item:'caldo de verduras o pollo'},{amount:'100g',item:'fideos cabello o tirabuzón chico'},{amount:'c/n',item:'sal, aceite de oliva'}],
 steps:['Llevás el caldo a hervor.','Agregás los fideos y cocinás el tiempo indicado.','Ajustás sal y servís con un chorrito de aceite.']},

{id:4,energia:'facil',top:true,emoji:'🥚',name:'Omelette de queso',
 energy:'⚡',time:'8 min',porciones:'1',tags:['poco-lavar','economico'],comment:'Dos huevos y un rato. No necesita más.',
 ings:[{amount:'2',item:'huevos'},{amount:'2 cdas',item:'queso cremoso o en fetas'},{amount:'c/n',item:'sal, aceite o manteca'}],
 steps:['Batís los huevos con sal.','Calentás sartén con aceite o manteca a fuego medio.','Volcás los huevos y dejás que cuaje el borde.','Ponés el queso en el centro y doblás a la mitad.','Cocinás 1 minuto más y servís.']},

{id:5,energia:'facil',top:true,emoji:'🍚',name:'Arroz con atún',
 energy:'⚡',time:'20 min',porciones:'2',tags:['economico','rinde-manana'],comment:'Completo, económico, sin discusiones.',
 ings:[{amount:'1 taza',item:'arroz'},{amount:'1 lata',item:'atún al natural'},{amount:'1 cda',item:'mayonesa o aceite de oliva'},{amount:'c/n',item:'sal, limón'}],
 steps:['Cocinás el arroz según el paquete.','Escurrís el atún y mezclás con mayo o aceite.','Servís el arroz con el atún por encima.','Exprimís limón al gusto.']},

{id:6,energia:'facil',top:false,emoji:'🫓',name:'Tostados de jamón y queso',
 energy:'⚡',time:'5 min',porciones:'1',tags:['poco-lavar','economico'],comment:'Rápido, caliente, sin ollas.',
 ings:[{amount:'2',item:'rebanadas de pan'},{amount:'2 fetas',item:'jamón cocido'},{amount:'2 fetas',item:'queso'}],
 steps:['Armás el sándwich con jamón y queso.','Tostás en sandwichera, sartén o tostadora.','Servís caliente.']},

{id:7,energia:'facil',top:false,emoji:'🥚',name:'Huevos revueltos con tostadas',
 energy:'⚡',time:'8 min',porciones:'1',tags:['poco-lavar','economico'],comment:'Simple, nutritivo, en diez minutos.',
 ings:[{amount:'3',item:'huevos'},{amount:'1 cda',item:'manteca o aceite'},{amount:'2',item:'rebanadas de pan'},{amount:'c/n',item:'sal'}],
 steps:['Batís los huevos con sal.','Calentás manteca en sartén a fuego bajo.','Agregás los huevos y revolvés suavemente hasta que cuajen.','Servís con las tostadas.']},

{id:8,energia:'facil',top:false,emoji:'🫔',name:'Quesadillas',
 energy:'⚡',time:'10 min',porciones:'1',tags:['poco-lavar','economico'],comment:'Con lo que haya adentro. En cinco minutos.',
 ings:[{amount:'2',item:'tortillas de harina'},{amount:'50g',item:'queso rallado o en fetas'},{amount:'c/n',item:'jamón, verduras o lo que tengas'}],
 steps:['Ponés una tortilla en sartén caliente.','Cubrís con queso y el relleno elegido.','Tapás con la otra tortilla y presionás.','Cocinás 2 min de cada lado hasta dorar.','Cortás en cuartos y servís.']},

{id:9,energia:'facil',top:false,emoji:'🍝',name:'Ravioles con salsa rápida',
 energy:'⚡',time:'15 min',porciones:'2',tags:['poco-lavar'],comment:'Pasta comprada, salsa de diez minutos.',
 ings:[{amount:'500g',item:'ravioles comprados (frescos o secos)'},{amount:'1 lata',item:'tomates perita'},{amount:'2 dientes',item:'ajo'},{amount:'c/n',item:'aceite, sal, albahaca opcional'}],
 steps:['Cocinás los ravioles en agua hirviendo con sal.','En sartén, dorás el ajo picado en aceite.','Agregás los tomates aplastados, salpimentás y cocinás 8 min.','Servís los ravioles con la salsa encima.']},

{id:10,energia:'facil',top:false,emoji:'🥟',name:'Ñoquis comprados con manteca',
 energy:'⚡',time:'10 min',porciones:'2',tags:['poco-lavar','economico'],comment:'Listos en minutos. Nadie se queja.',
 ings:[{amount:'500g',item:'ñoquis comprados'},{amount:'40g',item:'manteca'},{amount:'c/n',item:'queso rallado, sal'}],
 steps:['Hervís agua con sal.','Cocinás los ñoquis hasta que suben a la superficie.','Escurrís y salteás unos segundos con manteca.','Servís con queso rallado.']},

{id:11,energia:'facil',top:false,emoji:'🌭',name:'Puré con salchichas',
 energy:'⚡',time:'15 min',porciones:'2',tags:['economico','chicos'],comment:'Gusta a los chicos, requiere mínimo esfuerzo.',
 ings:[{amount:'2 sobres',item:'puré instantáneo'},{amount:'4',item:'salchichas'},{amount:'c/n',item:'leche, manteca para el puré'}],
 steps:['Preparás el puré según las instrucciones del sobre.','Cocinás las salchichas en sartén o microondas.','Servís junto.']},

{id:12,energia:'facil',top:false,emoji:'🧀',name:'Papas al horno con queso',
 energy:'⚡',time:'30 min',porciones:'2',tags:['poco-lavar','economico'],comment:'Las papas hacen todo el trabajo. Vos solo esperás.',
 ings:[{amount:'3',item:'papas medianas'},{amount:'c/n',item:'aceite de oliva, sal, queso rallado'},{amount:'c/n',item:'orégano opcional'}],
 steps:['Precalentás el horno a 200°C.','Cortás las papas en cubos y condimentás con aceite y sal.','Horneás 25 min hasta dorar.','Salís, agregás queso y volvés 3 min al horno.']},

{id:13,energia:'facil',top:false,emoji:'🍮',name:'Polenta rápida con queso',
 energy:'⚡',time:'10 min',porciones:'2',tags:['una-olla','economico'],comment:'Abrigada, simple, sin pensar.',
 ings:[{amount:'1 taza',item:'polenta instantánea'},{amount:'2 tazas',item:'agua o leche'},{amount:'50g',item:'queso rallado'},{amount:'c/n',item:'sal, manteca'}],
 steps:['Hervís el agua con sal.','Agregás la polenta en lluvia, revolviendo siempre.','Cocinás 3-5 min hasta espesar.','Incorporás queso y manteca, mezclás y servís.']},

{id:14,energia:'facil',top:false,emoji:'🍝',name:'Fideos con salsa de tomate rápida',
 energy:'⚡',time:'20 min',porciones:'2',tags:['economico','una-olla'],comment:'La solución de siempre cuando no hay más ideas.',
 ings:[{amount:'200g',item:'fideos'},{amount:'1 lata',item:'tomates perita'},{amount:'2 dientes',item:'ajo'},{amount:'c/n',item:'aceite, sal, orégano'}],
 steps:['Cocinás la pasta en agua con sal.','Dorás el ajo en aceite, agregás los tomates aplastados.','Salpimentás y cocinás 8 min.','Mezclás con la pasta escurrida.']},

{id:15,energia:'facil',top:false,emoji:'🥪',name:'Sándwich caliente de pollo o jamón',
 energy:'⚡',time:'8 min',porciones:'1',tags:['poco-lavar','economico'],comment:'Para resolver en minutos sin ensuciar nada.',
 ings:[{amount:'2',item:'rebanadas de pan'},{amount:'c/n',item:'pollo desmenuzado, jamón o lo que haya'},{amount:'c/n',item:'queso, tomate, mayonesa'}],
 steps:['Armás el sándwich con el relleno elegido.','Tostás en sandwichera o sartén.','Servís caliente.']},

{id:16,energia:'facil',top:false,emoji:'🍚',name:'Arroz con queso',
 energy:'⚡',time:'15 min',porciones:'1',tags:['economico','poco-lavar'],comment:'Cuando no hay nada más pero hay arroz y queso.',
 ings:[{amount:'1 taza',item:'arroz'},{amount:'c/n',item:'queso rallado o en cubos'},{amount:'c/n',item:'sal, aceite o manteca'}],
 steps:['Cocinás el arroz según el paquete.','Mezclás con un toque de manteca mientras está caliente.','Agregás el queso y mezclás hasta fundir.']},

{id:17,energia:'facil',top:false,emoji:'🍳',name:'Omelette de verduras',
 energy:'⚡',time:'10 min',porciones:'1',tags:['poco-lavar'],comment:'Con lo que haya en la heladera.',
 ings:[{amount:'3',item:'huevos'},{amount:'1 puñado',item:'verduras de la heladera (tomate, zapallito, espinaca)'},{amount:'c/n',item:'aceite, sal'}],
 steps:['Picás las verduras en trozos chicos.','Batís los huevos con sal.','Salteás las verduras 2 min en sartén con aceite.','Volcás los huevos encima y cocinás a fuego medio hasta cuajar.','Doblás y servís.']},

{id:18,energia:'facil',top:false,emoji:'🍳',name:'Huevos con papas fritas',
 energy:'⚡',time:'15 min',porciones:'1',tags:['economico','chicos','poco-lavar'],comment:'El clásico de siempre. Gusta a todos, no falla nunca.',
 ings:[{amount:'2',item:'huevos'},{amount:'2',item:'papas medianas'},{amount:'c/n',item:'aceite, sal'}],
 steps:['Pelás y cortás las papas en bastones o rodajas.','Freís en aceite caliente hasta dorar. Salás.','En otra sartén, freís los huevos a tu gusto.','Servís junto.']},

{id:19,energia:'facil',top:false,emoji:'🧇',name:'Tostadas con palta y huevo',
 energy:'⚡',time:'10 min',porciones:'1',tags:['poco-lavar'],comment:'Nutritivo y sin drama.',
 ings:[{amount:'2',item:'rebanadas de pan'},{amount:'1/2',item:'palta'},{amount:'1',item:'huevo'},{amount:'c/n',item:'sal, limón'}],
 steps:['Tostás el pan.','Pisás la palta con limón y sal.','Freís o pochás el huevo.','Armás: tostada, palta, huevo encima.']},

{id:20,energia:'facil',top:false,emoji:'🍲',name:'Milanesas del freezer',
 energy:'⚡',time:'15 min',porciones:'2',tags:['freezable','poco-lavar'],comment:'Ya están hechas. Solo calentar.',
 ings:[{amount:'4',item:'milanesas del freezer'},{amount:'c/n',item:'aceite o sprayvegetalizado'}],
 steps:['Precalentás el horno a 200°C o calentás sartén con aceite mínimo.','Cocinás las milanesas 5-7 min de cada lado hasta calentar y dorar.','Servís con lo que tengas: ensalada, puré, arroz.']},

// ══ 🌷 HOY PUEDO COCINAR TRANQUILA ══
{id:21,energia:'tranquila',top:true,emoji:'🍗',name:'Arroz con pollo',
 energy:'⚡⚡',time:'40 min',porciones:'4',tags:['rinde-manana','una-olla','chicos'],comment:'De esas comidas que generan elogios en la mesa.',
 ings:[{amount:'4',item:'muslos o pechugas de pollo'},{amount:'1.5 tazas',item:'arroz'},{amount:'1',item:'cebolla'},{amount:'2 dientes',item:'ajo'},{amount:'1',item:'pimiento rojo'},{amount:'1 taza',item:'arvejas'},{amount:'c/n',item:'aceite, sal, pimentón, caldo'}],
 steps:['Dorás el pollo salpimentado en aceite por todos lados. Reservás.','En la misma olla, sofís cebolla, ajo y pimiento picados.','Agregás el arroz y revolvés 1 min.','Ponés el pollo encima, cubrís con caldo caliente (doble volumen que arroz).','Cocinás tapado a fuego bajo 25 min.','Agregás arvejas los últimos 5 min.']},

{id:22,energia:'tranquila',top:true,emoji:'🍗',name:'Pollo al horno con papas',
 energy:'⚡⚡',time:'60 min',porciones:'4',tags:['rinde-manana','chicos','poco-lavar'],comment:'Una asadera, todo adentro, horno se encarga.',
 ings:[{amount:'4',item:'presas de pollo'},{amount:'4',item:'papas medianas'},{amount:'c/n',item:'aceite de oliva, sal, orégano, ajo'},{amount:'c/n',item:'jugo de limón opcional'}],
 steps:['Precalentás el horno a 200°C.','Cortás las papas en trozos, las ponés en asadera.','Acomodás el pollo encima, condimentás todo con aceite, sal, ajo y orégano.','Horneás 50-60 min, dando vuelta el pollo a la mitad.','El pollo está listo cuando la piel está dorada y el jugo sale claro.']},

{id:23,energia:'tranquila',top:true,emoji:'🥩',name:'Milanesas al horno con puré',
 energy:'⚡⚡',time:'35 min',porciones:'4',tags:['chicos','freezable'],comment:'El clásico familiar. Siempre funciona.',
 ings:[{amount:'500g',item:'milanesas de carne o pollo'},{amount:'3',item:'papas grandes para el puré'},{amount:'c/n',item:'huevo, pan rallado, sal'},{amount:'c/n',item:'leche, manteca'}],
 steps:['Precalentás el horno a 200°C.','Pasás las milanesas por huevo y pan rallado.','Las colocás en asadera con aceite y horneás 15 min de cada lado.','Mientras, cocinás y pisás las papas con leche, manteca y sal.','Servís junto.']},

{id:24,energia:'tranquila',top:true,emoji:'🥔',name:'Tortilla de papas',
 energy:'⚡⚡',time:'30 min',porciones:'4',tags:['economico','rinde-manana'],comment:'Sale para varios, sirve caliente o fría.',
 ings:[{amount:'3',item:'papas medianas'},{amount:'4',item:'huevos'},{amount:'1',item:'cebolla grande'},{amount:'c/n',item:'aceite de oliva, sal'}],
 steps:['Pelás y cortás las papas en rodajas finas. Igual con la cebolla.','Cocinás papas y cebolla en aceite a fuego bajo hasta tiernas (15 min).','Batís los huevos con sal, mezclás con las papas escurridas.','En sartén antiadherente, volcás la mezcla y cocinás a fuego bajo tapado.','Cuando está firme abajo, das vuelta con un plato y cocinás el otro lado.']},

{id:25,energia:'tranquila',top:true,emoji:'🥧',name:'Tarta de jamón y queso',
 energy:'⚡⚡',time:'40 min',porciones:'6',tags:['rinde-manana','chicos','freezable'],comment:'Se hace una vez, se come tres veces.',
 ings:[{amount:'1',item:'tapa de tarta comprada'},{amount:'150g',item:'jamón cocido'},{amount:'100g',item:'queso mozzarella'},{amount:'3',item:'huevos'},{amount:'100ml',item:'crema o leche'}],
 steps:['Precalentás el horno a 180°C.','Forrás un molde con la tapa de tarta.','Batís los huevos con la crema y salpimentás.','Cubrís la base con jamón y queso.','Volcás el batido encima.','Horneás 30-35 min hasta que esté firme y dorada.']},

{id:26,energia:'tranquila',top:false,emoji:'🥧',name:'Tarta de verduras',
 energy:'⚡⚡',time:'45 min',porciones:'6',tags:['rinde-manana','freezable'],comment:'Acelga o espinaca con queso. Dura tres días en la heladera.',
 ings:[{amount:'1',item:'tapa de tarta comprada'},{amount:'1 atado',item:'acelga o espinaca'},{amount:'100g',item:'queso mozzarella o rallado'},{amount:'3',item:'huevos'},{amount:'c/n',item:'sal, nuez moscada'}],
 steps:['Precalentás horno a 180°C.','Cocinás la verdura, escurrís bien y picás.','Mezclás con huevos batidos, queso y sal.','Volcás en molde forrado con la tapa.','Horneás 35-40 min.']},

{id:27,energia:'tranquila',top:true,emoji:'🥩',name:'Pastel de papa',
 energy:'⚡⚡',time:'50 min',porciones:'5',tags:['rinde-manana','chicos','freezable'],comment:'Clásico de madre y de abuela. Se freezea perfecto.',
 ings:[{amount:'500g',item:'carne picada'},{amount:'4',item:'papas grandes'},{amount:'1',item:'cebolla'},{amount:'1',item:'pimiento'},{amount:'c/n',item:'aceite, sal, pimentón, huevo duro opcional'}],
 steps:['Cocinás y pisás las papas con manteca y sal.','Sofís cebolla y pimiento picados. Agregás la carne y cocinás hasta cambiar de color.','Condimentás con sal y pimentón.','En asadera: capa de carne, capa de puré encima.','Pintás con huevo batido y horneás a 180°C hasta dorar (20 min).']},

{id:28,energia:'tranquila',top:true,emoji:'🍝',name:'Albóndigas con salsa',
 energy:'⚡⚡',time:'40 min',porciones:'4',tags:['chicos','freezable','rinde-manana'],comment:'Ideal para días donde querés resolver sin discusiones en la mesa.',
 ings:[{amount:'500g',item:'carne picada'},{amount:'1',item:'huevo'},{amount:'2 cdas',item:'pan rallado'},{amount:'1 lata',item:'tomates perita'},{amount:'c/n',item:'sal, ajo, perejil, aceite'}],
 steps:['Mezclás la carne con huevo, pan rallado, sal y ajo picado.','Formás bolitas y las dorás en aceite por todos lados.','En la misma sartén, hacés la salsa de tomate con ajo.','Devolvés las albóndigas a la salsa y cocinás 15 min tapado.','Servís con arroz, pasta o puré.']},

{id:29,energia:'tranquila',top:false,emoji:'🍝',name:'Milanesas con fideos',
 energy:'⚡⚡',time:'30 min',porciones:'4',tags:['chicos'],comment:'La combinación que no falla.',
 ings:[{amount:'500g',item:'milanesas de carne'},{amount:'200g',item:'fideos'},{amount:'c/n',item:'huevo, pan rallado, salsa de tomate'}],
 steps:['Pasás las milanesas por huevo y pan rallado.','Freís en aceite caliente o cocinás al horno 15 min de cada lado.','Cocinás los fideos según el paquete.','Servís con salsa de tomate.']},

{id:30,energia:'tranquila',top:false,emoji:'🍔',name:'Hamburguesas caseras',
 energy:'⚡⚡',time:'25 min',porciones:'4',tags:['chicos','freezable'],comment:'Mejores que las compradas y se freezean crudas.',
 ings:[{amount:'500g',item:'carne picada'},{amount:'1',item:'huevo'},{amount:'2 cdas',item:'pan rallado'},{amount:'c/n',item:'sal, ajo en polvo, perejil'}],
 steps:['Mezclás todos los ingredientes con las manos.','Formás 4 hamburguesas de 1.5 cm de espesor.','Cocinás en sartén o plancha caliente 4-5 min de cada lado.','Servís en pan con lo que tengas.']},

{id:31,energia:'tranquila',top:false,emoji:'🍗',name:'Pollo a la crema con arroz',
 energy:'⚡⚡',time:'35 min',porciones:'4',tags:['chicos','rinde-manana'],comment:'Suave, cremoso, siempre bien recibido.',
 ings:[{amount:'4',item:'pechugas de pollo'},{amount:'200ml',item:'crema de leche'},{amount:'1',item:'cebolla'},{amount:'c/n',item:'sal, caldo, aceite'}],
 steps:['Cocinás el arroz aparte.','Sellás el pollo cortado en tiras.','Sofís cebolla, agregás la crema y un chorro de caldo.','Sumás el pollo y cocinás 10 min a fuego bajo.','Servís sobre el arroz.']},

{id:32,energia:'tranquila',top:false,emoji:'🥬',name:'Tortilla de verduras',
 energy:'⚡⚡',time:'25 min',porciones:'3',tags:['economico','rinde-manana'],comment:'Con lo que haya en la heladera.',
 ings:[{amount:'4',item:'huevos'},{amount:'1 taza',item:'verduras variadas (zapallito, espinaca, morrón)'},{amount:'c/n',item:'aceite, sal, queso opcional'}],
 steps:['Salteás las verduras picadas en sartén con aceite.','Batís los huevos con sal y volcás sobre las verduras.','Cocinás a fuego bajo tapado hasta cuajar.','Das vuelta y terminás de cocinar.']},

{id:33,energia:'tranquila',top:false,emoji:'🥟',name:'Empanadas de jamón y queso',
 energy:'⚡⚡',time:'45 min',porciones:'6',tags:['chicos','freezable'],comment:'Con tapas compradas, mucho más rápido.',
 ings:[{amount:'12',item:'tapas de empanada'},{amount:'150g',item:'jamón cocido'},{amount:'150g',item:'queso mozzarella'}],
 steps:['Precalentás el horno a 180°C.','Ponés jamón y queso en cada tapa.','Cerrás apretando el borde con tenedor.','Horneás 20 min hasta dorar.']},

{id:34,energia:'tranquila',top:false,emoji:'🥟',name:'Empanadas de carne',
 energy:'⚡⚡⚡',time:'60 min',porciones:'6',tags:['freezable','rinde-manana'],comment:'Las de siempre. Valen cada minuto.',
 ings:[{amount:'12',item:'tapas de empanada'},{amount:'400g',item:'carne picada'},{amount:'1',item:'cebolla'},{amount:'2',item:'huevos duros'},{amount:'c/n',item:'aceitunas, sal, pimentón, comino'}],
 steps:['Sofís la cebolla, agregás la carne y cocinás.','Condimentás con sal, pimentón y comino.','Añadís huevo duro picado y aceitunas.','Dejás enfriar y rellenás las tapas.','Cerrás y horneás a 200°C 20 min.']},

{id:35,energia:'tranquila',top:false,emoji:'🍝',name:'Fideos con albóndigas',
 energy:'⚡⚡',time:'40 min',porciones:'4',tags:['chicos','rinde-manana'],comment:'Plato completo que gusta a todos.',
 ings:[{amount:'200g',item:'fideos'},{amount:'8',item:'albóndigas (caseras o del freezer)'},{amount:'1 lata',item:'tomates perita'},{amount:'c/n',item:'ajo, aceite, sal, orégano'}],
 steps:['Cocinás las albóndigas en la salsa de tomate 15 min.','Cocinás la pasta según el paquete.','Mezclás y servís con queso rallado.']},

{id:36,energia:'tranquila',top:false,emoji:'🥩',name:'Carne guisada con papas',
 energy:'⚡⚡',time:'55 min',porciones:'4',tags:['rinde-manana','una-olla'],comment:'Una olla que resuelve toda la comida.',
 ings:[{amount:'500g',item:'carne para guiso (roast beef o paleta)'},{amount:'3',item:'papas medianas'},{amount:'1',item:'cebolla'},{amount:'1',item:'tomate'},{amount:'c/n',item:'aceite, sal, pimentón, caldo'}],
 steps:['Cortás la carne en cubos y dorás en aceite.','Agregás cebolla y tomate picados, sofís 5 min.','Cubrís con caldo caliente y cocinás tapado 30 min.','Agregás las papas en cubos y cocinás 20 min más.','Salpimentás y servís.']},

{id:37,energia:'tranquila',top:false,emoji:'🫑',name:'Zapallitos rellenos',
 energy:'⚡⚡',time:'50 min',porciones:'4',tags:['rinde-manana'],comment:'Más entretenidos que una tarta, igual de rendidores.',
 ings:[{amount:'4',item:'zapallitos grandes'},{amount:'200g',item:'carne picada o pollo'},{amount:'c/n',item:'queso, cebolla, sal, aceite'}],
 steps:['Cortás los zapallitos al medio y vaciás.','Sofís cebolla con la carne picada, mezclás con la pulpa del zapallito.','Rellenás los zapallitos, cubrís con queso.','Horneás a 180°C 25 min.']},

{id:38,energia:'tranquila',top:false,emoji:'🍚',name:'Arroz primavera',
 energy:'⚡⚡',time:'25 min',porciones:'4',tags:['economico','rinde-manana'],comment:'Colorido, completo, rinde para varios.',
 ings:[{amount:'2 tazas',item:'arroz'},{amount:'1 taza',item:'arvejas'},{amount:'1',item:'zanahoria'},{amount:'1',item:'choclo'},{amount:'c/n',item:'aceite, sal'}],
 steps:['Cocinás el arroz.','Aparte, cocinás las verduras al vapor o hervidas.','Mezclás todo con un chorro de aceite y sal.']},

{id:39,energia:'tranquila',top:false,emoji:'🐔',name:'Wok simple de pollo',
 energy:'⚡⚡',time:'20 min',porciones:'3',tags:['poco-lavar'],comment:'Una sartén grande, todo adentro, listo en veinte minutos.',
 ings:[{amount:'400g',item:'pechuga de pollo en tiritas'},{amount:'2 tazas',item:'verduras variadas (morrón, brócoli, zapallito)'},{amount:'3 cdas',item:'salsa de soja'},{amount:'c/n',item:'aceite, ajo, jengibre opcional'}],
 steps:['Salteás el pollo en sartén o wok con aceite a fuego fuerte.','Agregás las verduras en orden de dureza (primero zanahoria, último zapallito).','Salseás con salsa de soja y ajo picado.','Mezclás y servís sobre arroz.']},

{id:40,energia:'tranquila',top:false,emoji:'🍕',name:'Pizza casera',
 energy:'⚡⚡⚡',time:'60 min',porciones:'4',tags:['chicos','freezable'],comment:'Los chicos la ayudan a armar y comen felices.',
 ings:[{amount:'1',item:'paquete de levadura'},{amount:'2 tazas',item:'harina'},{amount:'1 cda',item:'aceite'},{amount:'c/n',item:'sal, agua tibia, tomate, queso, toppings'}],
 steps:['Disolvés la levadura en agua tibia con azúcar.','Mezclás con harina y sal, amasás 10 min.','Dejás leudar 30 min tapado.','Estirás la masa, cubrís con tomate y queso.','Horneás a 220°C 15-20 min.']},

{id:41,energia:'tranquila',top:false,emoji:'🍝',name:'Lasaña sencilla',
 energy:'⚡⚡⚡',time:'60 min',porciones:'6',tags:['freezable','rinde-manana','chicos'],comment:'Rinde para toda la semana.',
 ings:[{amount:'1 paquete',item:'láminas de lasaña'},{amount:'500g',item:'carne picada'},{amount:'1 lata',item:'tomates'},{amount:'c/n',item:'bechamel, queso, sal'}],
 steps:['Preparás la salsa boloñesa.','Armás capas: pasta, carne, bechamel, queso.','Terminás con bechamel y queso rallado.','Horneás tapado 30 min, destapado 15 más.']},

{id:42,energia:'tranquila',top:false,emoji:'🥩',name:'Carne al horno con vegetales',
 energy:'⚡⚡',time:'70 min',porciones:'5',tags:['rinde-manana','poco-lavar'],comment:'Horno se ocupa de todo. Vos esperás.',
 ings:[{amount:'800g',item:'carne para horno (cuadril o paleta)'},{amount:'c/n',item:'papas, zanahorias, cebollas'},{amount:'c/n',item:'aceite de oliva, sal, hierbas'}],
 steps:['Condimentás la carne con sal y hierbas.','Cortás las verduras en trozos grandes.','Acomodás todo en asadera con aceite.','Cubrís con papel y horneás a 180°C 60 min.','Destapás 10 min para dorar.']},

{id:43,energia:'tranquila',top:false,emoji:'🐔',name:'Pastel de pollo',
 energy:'⚡⚡',time:'50 min',porciones:'5',tags:['freezable','chicos'],comment:'Como el pastel de papa pero con pollo.',
 ings:[{amount:'500g',item:'pollo cocido desmenuzado'},{amount:'4',item:'papas para puré'},{amount:'1',item:'cebolla'},{amount:'c/n',item:'aceite, sal, crema o leche'}],
 steps:['Hacés el puré de papa.','Sofís cebolla, mezclás con el pollo desmenuzado.','Armás en asadera: capa de pollo, capa de puré.','Pintás con huevo y horneás a 180°C hasta dorar.']},

{id:44,energia:'tranquila',top:false,emoji:'🍝',name:'Pastas con salsa casera',
 energy:'⚡⚡',time:'30 min',porciones:'4',tags:['economico','chicos'],comment:'Salsa de tomate hecha en casa, diferencia total.',
 ings:[{amount:'400g',item:'pasta'},{amount:'1 lata grande',item:'tomates perita'},{amount:'1',item:'cebolla'},{amount:'3 dientes',item:'ajo'},{amount:'c/n',item:'aceite, sal, albahaca, orégano'}],
 steps:['Sofís cebolla y ajo picados en aceite.','Agregás los tomates aplastados con las manos.','Cocinás 20 min a fuego medio, salpimentás.','Cocinás la pasta y mezclas con la salsa.']},

// ══ 🍲 HOY COCINO PARA MAÑANA ══
{id:45,energia:'manana',top:true,isBase:true,emoji:'🍅',name:'Salsa de tomate base',
 baseUses:['fideos','pizza','empanadas','milanesas napolitanas','albóndigas'],
 energy:'⚡',time:'20 min',porciones:'8+',tags:['freezable','economico'],comment:'Una vez por semana, muchos problemas resueltos.',
 ings:[{amount:'2 latas',item:'tomates perita'},{amount:'1',item:'cebolla grande'},{amount:'4 dientes',item:'ajo'},{amount:'c/n',item:'aceite de oliva, sal, orégano, albahaca'}],
 steps:['Sofís cebolla y ajo picados en aceite.','Agregás los tomates aplastados.','Cocinás 20 min a fuego medio.','Mixeás si querés textura más lisa.','Dividís en porciones y freezás.']},

{id:46,energia:'manana',top:true,isBase:true,emoji:'🐔',name:'Pollo desmenuzado base',
 baseUses:['tacos','empanadas','tarta de pollo','sándwiches','arroz con pollo','ensaladas'],
 energy:'⚡',time:'30 min',porciones:'6+',tags:['freezable','rinde-manana'],comment:'Cocinás una vez, resolvés cinco comidas distintas.',
 ings:[{amount:'1 kg',item:'pechuga de pollo'},{amount:'c/n',item:'sal, ajo, hierbas'}],
 steps:['Cocinás el pollo en agua hirviendo con sal y ajo 20-25 min.','Dejás entibiar y desmenuzás con dos tenedores.','Dividís en bolsas o tuppers y freezás o guardás en heladera hasta 4 días.']},

{id:47,energia:'manana',top:true,isBase:true,emoji:'🥩',name:'Salsa boloñesa',
 baseUses:['fideos','lasaña','empanadas','relleno de tartas','canelones'],
 energy:'⚡⚡',time:'45 min',porciones:'8+',tags:['freezable','rinde-manana'],comment:'La base que resuelve más comidas que cualquier otra.',
 ings:[{amount:'500g',item:'carne picada'},{amount:'1',item:'cebolla'},{amount:'2',item:'zanahorias'},{amount:'2 dientes',item:'ajo'},{amount:'1 lata',item:'tomates perita'},{amount:'c/n',item:'aceite, sal, orégano'}],
 steps:['Sofís cebolla, zanahoria y ajo picados finos.','Agregás la carne y cocinás hasta cambiar de color.','Sumás los tomates aplastados.','Cocinás 30 min a fuego bajo.','Dividís en porciones y freezás.']},

{id:48,energia:'manana',top:true,emoji:'🍲',name:'Guiso de lentejas grande',
 energy:'⚡⚡',time:'55 min',porciones:'6',tags:['freezable','rinde-manana','economico','una-olla'],comment:'Una olla grande para toda la semana.',
 ings:[{amount:'500g',item:'lentejas'},{amount:'2',item:'chorizos colorados'},{amount:'1',item:'cebolla'},{amount:'2',item:'zanahorias'},{amount:'1 lata',item:'tomates perita'},{amount:'c/n',item:'aceite, sal, pimentón'}],
 steps:['Remojás las lentejas 30 min (o usás las rojas sin remojar).','Sofís cebolla y chorizo en aceite.','Agregás zanahoria, tomates y lentejas.','Cubrís con agua fría y cocinás 35 min a fuego medio.','Salpimentás. Listo para 3-4 días.']},

{id:49,energia:'manana',top:false,isBase:true,emoji:'🍚',name:'Arroz cocido para la semana',
 baseUses:['arroz con huevo','guarnición','arroz con atún','wok','arroz frito'],
 energy:'⚡',time:'20 min',porciones:'8+',tags:['rinde-manana','economico'],comment:'Tenerlo listo en la heladera cambia la semana.',
 ings:[{amount:'2 tazas',item:'arroz'},{amount:'4 tazas',item:'agua'},{amount:'c/n',item:'sal, aceite'}],
 steps:['Lavás el arroz con agua fría.','Herví el agua con sal y aceite.','Agregás el arroz, cocinás tapado a fuego bajo 18 min.','Apagás y dejás reposar 5 min.','Guardás en heladera hasta 5 días.']},

{id:50,energia:'manana',top:false,isBase:true,emoji:'🧅',name:'Base de cebolla y morrón',
 baseUses:['salsas','guisos','carnes','omelettes','pizzas','rellenos'],
 energy:'⚡',time:'25 min',porciones:'10+',tags:['freezable','economico'],comment:'El sofrito que arranca todas las comidas. Hacelo en cantidad.',
 ings:[{amount:'4',item:'cebollas grandes'},{amount:'2',item:'morrones'},{amount:'4 dientes',item:'ajo'},{amount:'c/n',item:'aceite de oliva, sal'}],
 steps:['Picás fino todo.','Cocinás en aceite a fuego bajo 20 min, revolviendo ocasionalmente.','Dejás enfriar y dividís en bolsitas de freezer.','Cucharada por cucharada, según necesites.']},

{id:51,energia:'manana',top:false,emoji:'🟡',name:'Lentejas cocidas base',
 energy:'⚡',time:'35 min',porciones:'8+',tags:['freezable','economico'],comment:'Versátiles para ensaladas, sopas, guisos y más.',
 ings:[{amount:'500g',item:'lentejas'},{amount:'c/n',item:'sal, laurel, ajo'}],
 steps:['Lavás las lentejas.','Cocinás en agua con laurel y ajo 25-30 min hasta tiernas.','Escurrís y guardás en heladera o freezás en porciones.']},

{id:52,energia:'manana',top:false,emoji:'⚪',name:'Garbanzos cocidos',
 energy:'⚡',time:'90 min',porciones:'10+',tags:['freezable','economico'],comment:'En freezer son un tesoro. Ensaladas, guisos, hummus.',
 ings:[{amount:'500g',item:'garbanzos secos'},{amount:'c/n',item:'sal, bicarbonato, laurel'}],
 steps:['Remojás los garbanzos 12 horas.','Cocinás en agua fresca con laurel 60-80 min.','Salás al final.','Guardás en heladera o freezás en porciones con un poco de caldo.']},

{id:53,energia:'manana',top:false,emoji:'🥩',name:'Albóndigas para freezer',
 energy:'⚡⚡',time:'40 min',porciones:'8+',tags:['freezable','chicos'],comment:'Hacelas el doble y guardá la mitad. Semana resuelta.',
 ings:[{amount:'1 kg',item:'carne picada'},{amount:'2',item:'huevos'},{amount:'4 cdas',item:'pan rallado'},{amount:'c/n',item:'sal, ajo, perejil'}],
 steps:['Mezclás todo con las manos.','Formás bolitas del tamaño de una nuez.','Podés freezarlas crudas o cocidas.','Crudas: las ponés en bandeja separadas y freezás 2h, luego bolsa.','Cocidas: dorás y guardás con o sin salsa.']},

{id:54,energia:'manana',top:false,emoji:'🍕',name:'Prepizzas para freezer',
 energy:'⚡⚡⚡',time:'90 min',porciones:'8',tags:['freezable','chicos'],comment:'Un domingo, varias semanas de cenas resueltas.',
 ings:[{amount:'1 kg',item:'harina'},{amount:'2 sobres',item:'levadura seca'},{amount:'c/n',item:'aceite, sal, agua tibia'}],
 steps:['Disolvés levadura en agua tibia con sal.','Mezclás con harina y aceite, amasás 10 min.','Leudás 45 min.','Dividís, estirás y precocinás las bases 7 min en horno fuerte.','Dejás enfriar y freezás entre papeles.']},

{id:55,energia:'manana',top:false,isBase:true,emoji:'🥟',name:'Relleno para tartas y empanadas',
 baseUses:['tartas','empanadas','papas rellenas','canelones'],
 energy:'⚡⚡',time:'30 min',porciones:'8+',tags:['freezable','rinde-manana'],comment:'Hacé un kilo y resolvé varios días.',
 ings:[{amount:'500g',item:'carne picada o verduras'},{amount:'1',item:'cebolla'},{amount:'2',item:'huevos duros'},{amount:'c/n',item:'aceitunas, sal, especias'}],
 steps:['Sofís cebolla, cocinás la carne.','Condimentás y dejás enfriar.','Agregás huevo duro picado y aceitunas.','Dividís en porciones y freezás.']},

{id:56,energia:'manana',top:false,emoji:'🍗',name:'Pollo marinado para freezer',
 energy:'⚡',time:'15 min',porciones:'4',tags:['freezable'],comment:'Listo para asar o al horno directo del freezer.',
 ings:[{amount:'1 kg',item:'presas de pollo'},{amount:'3 cdas',item:'aceite de oliva'},{amount:'c/n',item:'ajo, orégano, sal, jugo de limón'}],
 steps:['Mezclás el marinado en un bol.','Cubrís el pollo y masajeás bien.','Dividís en bolsas de freezer.','Freezás hasta 3 meses.','Para usar: descongelás en heladera y cocinás.']},

{id:57,energia:'manana',top:false,isBase:true,emoji:'🫑',name:'Verduras asadas base',
 baseUses:['ensaladas','pizzas','sandwiches','tortillas','acompañamientos'],
 energy:'⚡',time:'35 min',porciones:'6+',tags:['freezable','economico'],comment:'Una asadera llena de verduras resuelve muchas comidas.',
 ings:[{amount:'c/n',item:'morrón, berenjena, zucchini, cebolla, zapallo'},{amount:'c/n',item:'aceite de oliva, sal, orégano'}],
 steps:['Cortás todo en trozos similares.','Condimentás con aceite y sal.','Horneás a 200°C 30-35 min hasta tiernas y con bordes dorados.','Guardás en heladera hasta 5 días o freezás.']},

{id:58,energia:'manana',top:false,emoji:'🍽️',name:'Viandas para congelar',
 energy:'⚡⚡',time:'60 min',porciones:'5',tags:['freezable','rinde-manana'],comment:'Un domingo de cocina, cinco días resueltos.',
 ings:[{amount:'c/n',item:'cualquier guiso, arroz con pollo, pastel de papa o estofado'}],
 steps:['Cocinás en doble o triple cantidad cualquier guiso o plato de olla.','Dejás enfriar completamente.','Dividís en tuppers individuales.','Rotulás con nombre y fecha.','Freezás. Duran 2-3 meses.']},

{id:59,energia:'manana',top:false,isBase:true,emoji:'🧆',name:'Base de verduras salteadas',
 baseUses:['omelettes','tartas','sopas','arroces','rellenos varios'],
 energy:'⚡',time:'20 min',porciones:'6+',tags:['freezable','economico'],comment:'La base que agiliza cualquier preparación de la semana.',
 ings:[{amount:'c/n',item:'zapallito, morrón, cebolla, espinaca, choclo'},{amount:'c/n',item:'aceite, sal, ajo'}],
 steps:['Cortás todo chico y parejo.','Salteás en aceite con ajo 10 min a fuego medio.','Dejás enfriar.','Guardás en heladera o freezás en porciones.']},

{id:60,energia:'manana',top:false,emoji:'🍖',name:'Estofado simple',
 energy:'⚡⚡',time:'60 min',porciones:'5',tags:['freezable','rinde-manana','una-olla'],comment:'Una olla para varios días. Mejor al día siguiente.',
 ings:[{amount:'600g',item:'carne para estofar (aguja o roast beef)'},{amount:'3',item:'papas'},{amount:'2',item:'zanahorias'},{amount:'1',item:'cebolla'},{amount:'c/n',item:'aceite, vino tinto opcional, caldo, sal'}],
 steps:['Dorás la carne en cubos en aceite.','Agregás cebolla y zanahorias picadas.','Cubrís con caldo y vino si tenés.','Cocinás tapado a fuego bajo 45 min.','Agregás las papas los últimos 20 min.']}
];

// ── sistema de energía — lógica central ──
var REC_CATS = {
  facil:    {label:'🤍 Hoy necesito algo fácil',    ico:'🤍'},
  tranquila:{label:'🌷 Hoy puedo cocinar tranquila', ico:'🌷'},
  manana:   {label:'🍲 Hoy cocino para mañana',      ico:'🍲'}
};
var REC_FILTERS = [
  {key:'todo',    label:'Todo'},
  {key:'15',      label:'⏱ −15 min'},
  {key:'30',      label:'⏱ −30 min'},
  {key:'45',      label:'⏱ −45 min'},
  {key:'una-olla',label:'Una sola olla'},
  {key:'poco-lavar',label:'Poco para lavar'},
  {key:'economico',label:'Económico'},
  {key:'chicos',  label:'Gusta a los chicos'},
  {key:'rinde-manana',label:'Rinde para mañana'},
  {key:'freezable',label:'Freezable'}
];
var recCurrentCat = null;
var recShowingAll = false;
var recActiveFilter = 'todo';
var INITIAL_SHOW = 8;

function recOpenCat(cat) {
  recCurrentCat = cat;
  recShowingAll = false;
  recActiveFilter = 'todo';
  document.getElementById('rec-home-view').style.display = 'none';
  document.getElementById('rec-cat-view').style.display  = 'block';
  document.getElementById('rec-cat-label').textContent = REC_CATS[cat].label;
  // buscador oculto al entrar
  var sb = document.getElementById('rec-search-bar');
  sb.value = '';
  sb.classList.remove('open');
  // renderizar filtros
  var fc = document.getElementById('rec-filters');
  fc.innerHTML = '';
  REC_FILTERS.forEach(function(f){
    var b = document.createElement('button');
    b.className = 'rec-filter-btn' + (f.key==='todo' ? ' active' : '');
    b.textContent = f.label;
    b.onclick = function(){ recSetFilter(f.key, b); };
    fc.appendChild(b);
  });
  recRender();
}
function recGoHome() {
  document.getElementById('rec-cat-view').style.display  = 'none';
  document.getElementById('rec-home-view').style.display = 'flex';
}
function recToggleSearch() {
  var sb = document.getElementById('rec-search-bar');
  sb.classList.toggle('open');
  if(sb.classList.contains('open')) sb.focus();
  else { sb.value=''; recRender(); }
}
function recSetFilter(key, btn) {
  recActiveFilter = key;
  recShowingAll = false;
  document.querySelectorAll('.rec-filter-btn').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  recRender();
}
function recShowAll() {
  recShowingAll = true;
  recRender();
}
function recGetFiltered() {
  var q = (document.getElementById('rec-search-bar').value || '').toLowerCase();
  var list = RECIPES.filter(function(r){ return r.energia === recCurrentCat; });
  // filtro de tiempo
  if(recActiveFilter === '15') list = list.filter(function(r){ return parseInt(r.time)<=15; });
  else if(recActiveFilter === '30') list = list.filter(function(r){ return parseInt(r.time)<=30; });
  else if(recActiveFilter === '45') list = list.filter(function(r){ return parseInt(r.time)<=45; });
  else if(recActiveFilter !== 'todo') list = list.filter(function(r){ return r.tags && r.tags.includes(recActiveFilter); });
  // búsqueda
  if(q) list = list.filter(function(r){ return r.name.toLowerCase().includes(q); });
  return list;
}
function recRender() {
  var list = recGetFiltered();
  // top primero si no hay filtro activo
  if(recActiveFilter === 'todo') {
    list = list.slice().sort(function(a,b){ return (b.top?1:0)-(a.top?1:0); });
  }
  var showing = recShowingAll ? list : list.slice(0, INITIAL_SHOW);
  var grid = document.getElementById('recipe-grid');
  grid.innerHTML = '';
  showing.forEach(function(r){ grid.appendChild(recBuildCard(r)); });
  var btn = document.getElementById('rec-see-more');
  btn.style.display = (!recShowingAll && list.length > INITIAL_SHOW) ? 'block' : 'none';
  if(!recShowingAll && list.length > INITIAL_SHOW)
    btn.textContent = 'Ver más opciones (' + (list.length - INITIAL_SHOW) + ')';
}
function recBuildCard(r) {
  var div = document.createElement('div');
  div.className = 'recipe-card' + (r.top ? ' top-recipe' : '') + (r.isBase ? ' base-card' : '');
  // chips de contexto
  var chips = '';
  chips += '<span class="recipe-chip chip-energy">' + r.energy + ' Energía ' + r.energy + '</span>';
  chips += '<span class="recipe-chip">⏱ ' + r.time + '</span>';
  if(r.tags && r.tags.includes('freezable'))    chips += '<span class="recipe-chip chip-teal">🧊 Freezable</span>';
  if(r.tags && r.tags.includes('rinde-manana')) chips += '<span class="recipe-chip chip-teal">🥡 Rinde para mañana</span>';
  if(r.tags && r.tags.includes('chicos'))       chips += '<span class="recipe-chip chip-green">🧒 Gusta a los chicos</span>';
  if(r.tags && r.tags.includes('economico'))    chips += '<span class="recipe-chip">💰 Económico</span>';
  if(r.tags && r.tags.includes('una-olla'))     chips += '<span class="recipe-chip">🫕 Una sola olla</span>';
  // usos de base (solo categoría mañana)
  var baseHtml = '';
  if(r.isBase && r.baseUses) {
    baseHtml = '<div class="recipe-base-uses"><div class="recipe-base-uses-title">Con esto resolvés</div><div class="recipe-base-uses-list">'
      + r.baseUses.map(function(u){ return '<span class="recipe-chip">'+u+'</span>'; }).join('')
      + '</div></div>';
  }
  div.innerHTML =
    '<div class="recipe-card-top">'
    + '<span class="recipe-emoji">' + r.emoji + '</span>'
    + '<div class="recipe-card-info">'
    + '<div class="recipe-name">' + r.name + '</div>'
    + '<div class="recipe-comment">' + r.comment + '</div>'
    + '</div></div>'
    + '<div class="recipe-chips">' + chips + '</div>'
    + baseHtml;
  div.onclick = function(){ openRecipe(r.id); };
  return div;
}
function recApplyFilters() { recRender(); }

var openRecipeData = null;
function openRecipe(id) {
  var r = RECIPES.find(function(x){ return x.id===id; });
  if(!r) return;
  openRecipeData = r;
  document.getElementById('rm-emoji').textContent = r.emoji;
  document.getElementById('rm-title').textContent = r.name;
  // ficha emocional
  var ficha = document.getElementById('rm-ficha');
  ficha.innerHTML =
    '<span class="ficha-chip">' + r.energy + ' ' + (['⚡','Muy baja','⚡⚡ Media','⚡⚡⚡ Necesita ganas'][['⚡','⚡⚡','⚡⚡⚡'].indexOf(r.energy)] || 'Energía ' + r.energy) + '</span>'
    + '<span class="ficha-chip">⏱ ' + r.time + '</span>'
    + '<span class="ficha-chip">👨‍👩‍👧 ' + r.porciones + (parseInt(r.porciones)>1?' porciones':' porción') + '</span>'
    + (r.tags&&r.tags.includes('freezable') ? '<span class="ficha-chip chip-teal">🧊 Freezable</span>' : '')
    + (r.tags&&r.tags.includes('rinde-manana') ? '<span class="ficha-chip chip-teal">🥡 Rinde para mañana</span>' : '')
    + (r.tags&&r.tags.includes('chicos') ? '<span class="ficha-chip chip-green">🧒 Gusta a los chicos</span>' : '')
    + '<div class="ficha-comentario">💛 ' + r.comment + '</div>';
  document.getElementById('rm-meta').innerHTML = '';
  document.getElementById('rm-progress').style.width = '0%';
  var ings = document.getElementById('rm-ings');
  ings.innerHTML = '';
  r.ings.forEach(function(ing,i){
    var d = document.createElement('div');
    d.className = 'recipe-ing-item'; d.id = 'ing-'+i;
    d.innerHTML = '<input type="checkbox" onchange="toggleIng('+i+')"/><span class="recipe-ing-text">'+ing.item+'</span><span class="recipe-ing-amount">'+ing.amount+'</span>';
    ings.appendChild(d);
  });
  var steps = document.getElementById('rm-steps');
  steps.innerHTML = '';
  r.steps.forEach(function(s,i){
    var d = document.createElement('div');
    d.className = 'recipe-step';
    d.innerHTML = '<div class="step-num">'+(i+1)+'</div><div class="step-text">'+s+'</div>';
    steps.appendChild(d);
  });
  document.getElementById('recipe-modal-overlay').classList.add('open');
}
function toggleIng(i) {
  if(!openRecipeData) return;
  var item = document.getElementById('ing-'+i);
  item.classList.toggle('checked');
  var total = openRecipeData.ings.length;
  var checked = document.querySelectorAll('#rm-ings .recipe-ing-item.checked').length;
  document.getElementById('rm-progress').style.width = (checked/total*100)+'%';
}
function closeRecipe() { document.getElementById('recipe-modal-overlay').classList.remove('open'); }

// ─── RUTINAS PERSONALIZADAS ───
var quizAnswers = {};
var RUTINAS_DB = {
  '5_cansada_mente': {badge:'✨ Mini Reset',title:'Micro rutina restauradora',desc:'5 minutos para bajar revoluciones y volver a vos.',steps:[
    {icon:'🫁',name:'Respiración 4-7-8',desc:'Inhalás 4 seg, sostenés 7, exhalás 8. Repetís 4 veces.',time:'2 min'},
    {icon:'💧',name:'Vaso de agua',desc:'Con limón si tenés. Hidratarte cambia todo.',time:'1 min'},
    {icon:'📝',name:'Una palabra que te defina hoy',desc:'Escribila en tu bloc. Solo una.',time:'2 min'},
  ]},
  '5_energia_cuerpo': {badge:'⚡ Express Activa',title:'Un poco de movimiento',desc:'Algo de movimiento cuando tenés un ratito.',steps:[
    {icon:'🏃‍♀️',name:'10 sentadillas',desc:'Pies al ancho de cadera, espalda recta.',time:'1 min'},
    {icon:'💪',name:'10 flexiones de rodillas',desc:'A tu ritmo, enfocándote en la forma.',time:'1.5 min'},
    {icon:'🦵',name:'Jumping jacks x 30 seg',desc:'Activás la circulación y el humor.',time:'30 seg'},
    {icon:'🧘',name:'Estiramiento de columna',desc:'Cat-cow: 5 repeticiones lentas.',time:'2 min'},
  ]},
  '5_estres_piel': {badge:'🌸 SOS Skincare',title:'Ritual exprés de piel',desc:'Tu piel absorbe el estrés. Devolvele el amor.',steps:[
    {icon:'💦',name:'Limpiar el rostro',desc:'Con agua fría si podés. Activás y despertás.',time:'1 min'},
    {icon:'🌊',name:'Serum o aceite facial',desc:'3 gotas, masajeás en movimientos hacia arriba.',time:'2 min'},
    {icon:'☀️',name:'Hidratante + FPS',desc:'Aunque no salgas, protegés la barrera cutánea.',time:'1 min'},
    {icon:'🧊',name:'Cubo de hielo en los ojos',desc:'30 seg. Reduce la inflamación del estrés al instante.',time:'1 min'},
  ]},
  '5_feliz_orden': {badge:'📋 Micro Organización',title:'Claridad en 5 minutos',desc:'Cuando todo está en tu cabeza, ponerlo en papel libera.',steps:[
    {icon:'📝',name:'3 tareas del día',desc:'Solo 3. Las más importantes. Las escribís.',time:'1 min'},
    {icon:'📧',name:'Bandeja de entrada',desc:'Un vistazo rápido, sin responder. Solo tomar nota.',time:'1 min'},
    {icon:'🗑️',name:'Mini limpieza del escritorio',desc:'Una cosa fuera de lugar, a su lugar.',time:'1 min'},
    {icon:'✅',name:'Algo pequeño, completalo ya',desc:'Un pendiente de 2 minutos. La satisfacción es real.',time:'2 min'},
  ]},
  '15_cansada_mente': {badge:'🌙 Restauración',title:'Rutina de reconexión',desc:'15 minutos para volverte a encontrar.',steps:[
    {icon:'🫁',name:'Respiración abdominal',desc:'Mano en el pecho, mano en la panza. 5 min respirando hacia la panza.',time:'5 min'},
    {icon:'📔',name:'Journaling libre',desc:'Escribí sin pensar: ¿qué te pesa hoy? No hay respuesta incorrecta.',time:'7 min'},
    {icon:'🌿',name:'Té o infusión',desc:'Preparártelo es el ritual. Tomarlo es la recompensa.',time:'3 min'},
  ]},
  '15_energia_cuerpo': {badge:'🔥 Hoy toca moverse',title:'15 minutos para el cuerpo',desc:'15 minutos para el cuerpo, cuando tenés resto.',steps:[
    {icon:'🤸',name:'Calentamiento dinámico',desc:'Círculos de hombros, cadera, rodillas. 2 min.',time:'2 min'},
    {icon:'🏋️‍♀️',name:'Ronda 1 · Fuerza',desc:'10 sentadillas, 10 flexiones, 15 abdominales. A tu ritmo.',time:'4 min'},
    {icon:'⚡',name:'Ronda 2 · Cardio',desc:'20 jumping jacks, 10 mountain climbers, 10 burpees.',time:'4 min'},
    {icon:'💪',name:'Ronda 3 · Resistencia',desc:'Plancha 45 seg, sentadilla isométrica 30 seg, glúteos en 4 apoyos.',time:'3 min'},
    {icon:'🧘',name:'Estiramiento final',desc:'Cuádriceps, isquiotibiales, espalda. Importante no saltear.',time:'2 min'},
  ]},
  '30_estres_mente': {badge:'🧘 Bajar el ruido',title:'Rutina antiéstres de 30 min',desc:'Para cuando el ruido mental no para.',steps:[
    {icon:'🚶‍♀️',name:'Caminata sin teléfono',desc:'15 minutos al aire libre o en casa. Sin música, sin podcast. Solo vos.',time:'15 min'},
    {icon:'📖',name:'Lectura placentera',desc:'Algo que te guste, no "que debés". Cualquier formato.',time:'10 min'},
    {icon:'🌸',name:'Skincare completo',desc:'Como ritual, no como obligación. Cada producto es un acto de amor.',time:'5 min'},
  ]},
  '30_energia_piel': {badge:'🌟 Glow Completo',title:'Ritual de belleza + movimiento',desc:'Para cuando querés brillar por dentro y por fuera.',steps:[
    {icon:'🏃‍♀️',name:'20 min de movimiento',desc:'Baile libre, yoga, caminata. Lo que te pida el cuerpo.',time:'20 min'},
    {icon:'🧴',name:'Doble limpieza',desc:'Aceite desmaquillante primero, espuma suave segundo.',time:'3 min'},
    {icon:'💆',name:'Mascarilla + masaje facial',desc:'10 min con la mascarilla, masajeás con rodillo o con los dedos.',time:'10 min'},
    {icon:'💧',name:'Hidratación completa',desc:'Serum, contorno de ojos, hidratante, FPS.',time:'5 min'},
  ]},
  '60_cansada_orden': {badge:'🌈 Domingo Reset',title:'La hora de volver a ser vos',desc:'Una hora completa para recargar y organizar.',steps:[
    {icon:'🛁',name:'Baño ritual',desc:'Con sales, aceite o simplemente agua caliente. Sin apuros.',time:'20 min'},
    {icon:'🌸',name:'Skincare completo',desc:'Todos los pasos, con calma.',time:'10 min'},
    {icon:'📋',name:'Planificación semanal',desc:'Anotás 3 metas, 3 tareas y una cosa solo para vos.',time:'15 min'},
    {icon:'🥗',name:'Meal prep express',desc:'Dejás lavado y cortado: lechuga, zanahoria, huevos duros.',time:'15 min'},
  ]},
  // ── Combos faltantes: feliz ──
  '5_feliz_cuerpo': {badge:'✨ Movimiento Feliz',title:'¡Movete con alegría!',desc:'Cuando estás feliz el cuerpo quiere moverse. Dale lo que pide.',steps:[
    {icon:'💃',name:'Baile libre 2 min',desc:'Ponés tu canción favorita y bailás como si nadie mirara.',time:'2 min'},
    {icon:'🤸',name:'10 saltos de alegría',desc:'Jumping jacks o simplemente saltar en el lugar.',time:'1 min'},
    {icon:'🧘',name:'Postura del guerrero',desc:'Un minuto por lado. La energía positiva se vuelve fuerza.',time:'2 min'},
  ]},
  '5_feliz_mente': {badge:'✨ Gratitud Express',title:'Un ratito para vos',desc:'Cuando te sentís bien, unos minutos de gratitud lo multiplican.',steps:[
    {icon:'📝',name:'3 cosas hermosas de hoy',desc:'Escribilas. Lo que te hizo sonreír, aunque sea pequeño.',time:'2 min'},
    {icon:'🌬️',name:'Respiración energizante',desc:'5 inhalaciones profundas, exhalando con una sonrisa.',time:'1 min'},
    {icon:'💌',name:'Mensaje a alguien especial',desc:'Una persona que quieras. Un mensaje corto. Sembrás alegría.',time:'2 min'},
  ]},
  '5_feliz_piel': {badge:'🌸 Glow de felicidad',title:'Ritual express radiante',desc:'Tu piel brilla cuando estás feliz. Potencialo.',steps:[
    {icon:'💧',name:'Agua fría en el rostro',desc:'Cierra los poros, activa la circulación y te deja luminosa.',time:'1 min'},
    {icon:'✨',name:'Serum vitamina C',desc:'3 gotas, masajeás hacia arriba con los dedos tibios.',time:'2 min'},
    {icon:'🌟',name:'Hidratante y fijador',desc:'El toque final que transforma cualquier look.',time:'2 min'},
  ]},
  '15_feliz_cuerpo': {badge:'💃 Cardio Feliz',title:'Mover el cuerpo con alegría',desc:'Tenés 15 minutos y energía de sobra. A disfrutarlos.',steps:[
    {icon:'🎵',name:'Calentamiento bailado',desc:'Pones una playlist que te encante. 5 minutos de movimiento libre.',time:'5 min'},
    {icon:'🏃‍♀️',name:'Cardio divertido',desc:'20 jumping jacks, 10 mountain climbers, 10 sentadillas. 2 rondas.',time:'7 min'},
    {icon:'🧘',name:'Cierre con gratitud',desc:'Estiramiento final respirando profundo y sonriendo.',time:'3 min'},
  ]},
  '15_feliz_mente': {badge:'🌟 Un rato para la cabeza',title:'Un rato tranquila con tus pensamientos',desc:'Un ratito tranquila con lo que te gusta pensar.',steps:[
    {icon:'📖',name:'Lectura inspiradora',desc:'10 páginas de algo que te encante, sin apuros.',time:'10 min'},
    {icon:'💭',name:'Visualización positiva',desc:'Cerras los ojos y te imaginás 3 cosas que querés lograr.',time:'3 min'},
    {icon:'📝',name:'Una meta concreta',desc:'La escribís. Con fecha. Hoy es un buen día para comprometerte.',time:'2 min'},
  ]},
  '15_feliz_piel': {badge:'🌸 Ritual Completo',title:'Belleza con alegría',desc:'15 minutos de cuidado personal que son puro placer.',steps:[
    {icon:'🧴',name:'Doble limpieza',desc:'Aceite desmaquillante + espuma suave. El ritual empieza así.',time:'4 min'},
    {icon:'💆',name:'Masaje facial',desc:'Con tu serum favorito, movimientos hacia arriba y afuera.',time:'5 min'},
    {icon:'🌟',name:'Mascarilla hidratante',desc:'La dejás actuar mientras respirás y disfrutás el momento.',time:'6 min'},
  ]},
  '15_feliz_orden': {badge:'✅ Ordenar con calma',title:'Organización con energía',desc:'Cuando estás bien, ordenar un poco se siente fácil.',steps:[
    {icon:'🎯',name:'Una o dos cosas para hoy',desc:'Las escribís. Solo las que hoy tiene sentido hacer.',time:'5 min'},
    {icon:'📧',name:'Los mails urgentes',desc:'Respondés lo urgente, el resto puede esperar.',time:'5 min'},
    {icon:'✨',name:'Un espacio ordenado',desc:'Tu escritorio, tu cartera, o tu mesita de luz. Un lugar que brille.',time:'5 min'},
  ]},
  '30_feliz_cuerpo': {badge:'🔥 Workout de Alegría',title:'30 minutos moviéndote',desc:'Cuando tenés tiempo y energía, mover el cuerpo se siente bien.',steps:[
    {icon:'🤸',name:'Calentamiento completo',desc:'5 min de movilidad articular y cardio suave.',time:'5 min'},
    {icon:'💪',name:'Circuito de fuerza',desc:'3 rondas: 15 sentadillas, 12 flexiones, 20 abdominales.',time:'15 min'},
    {icon:'🧘',name:'Yoga suave + estiramientos',desc:'Postura del perro boca abajo, triángulo, paloma. Con calma.',time:'10 min'},
  ]},
  '30_feliz_mente': {badge:'🌟 Expansión Mental',title:'Un rato para aprender algo',desc:'Cuando estás bien, aprender algo que te gusta se disfruta más.',steps:[
    {icon:'📚',name:'Lectura o podcast',desc:'20 min de algo que te nutra y te inspire.',time:'20 min'},
    {icon:'✍️',name:'Journaling creativo',desc:'¿Qué soñás para los próximos 3 meses? Escribilo libre.',time:'7 min'},
    {icon:'🎨',name:'Un pequeño proyecto creativo',desc:'Dibujo, playlist nueva, foto artística. Lo que te salga.',time:'3 min'},
  ]},
  '30_feliz_piel': {badge:'💫 Ritual Glow Completo',title:'30 minutos de amor propio',desc:'Piel radiante para un estado de ánimo radiante.',steps:[
    {icon:'🛁',name:'Baño o ducha ritual',desc:'Con tiempo, con música, con el jabón que más te gusta.',time:'10 min'},
    {icon:'💆',name:'Exfoliación suave',desc:'Circular, ascendente. Renovás la piel y la energía.',time:'5 min'},
    {icon:'🌸',name:'Skincare completo',desc:'Tónico, serum, contorno de ojos, hidratante, fijador.',time:'10 min'},
    {icon:'🧴',name:'Hidratación corporal',desc:'Crema o aceite en piernas y brazos. Massage incluido.',time:'5 min'},
  ]},
  '30_feliz_orden': {badge:'🌼 Hoy puedo ordenar',title:'La hora de ponerte al día',desc:'Si hoy tenés ganas, es un buen momento para avanzar con algo.',steps:[
    {icon:'📋',name:'Planificación semanal',desc:'Objetivos, compromisos y al menos una cosa solo para vos.',time:'10 min'},
    {icon:'🗑️',name:'Limpieza rápida',desc:'Un cajón, una parte del armario, el escritorio. Lo que esté pendiente.',time:'10 min'},
    {icon:'📲',name:'Organización digital',desc:'Fotos, notas, apps. Un espacio digital ordenado libera la mente.',time:'10 min'},
  ]},
  '60_feliz_cuerpo': {badge:'🏆 Un rato para vos y tu cuerpo',title:'Una hora moviéndote a tu ritmo',desc:'Una hora entera para vos y tu cuerpo.',steps:[
    {icon:'🤸',name:'Calentamiento dinámico',desc:'Movilidad completa, articulaciones, cardio suave. 10 minutos.',time:'10 min'},
    {icon:'💪',name:'Bloque de fuerza',desc:'4 rondas: sentadillas, peso muerto rumano, estocadas, flexiones.',time:'20 min'},
    {icon:'⚡',name:'Bloque de cardio',desc:'Tabata: 20 seg de trabajo, 10 de descanso. 8 ejercicios.',time:'15 min'},
    {icon:'🧘',name:'Yoga y estiramientos',desc:'15 min de posturas de recuperación. Te lo merecés.',time:'15 min'},
  ]},
  '60_feliz_mente': {badge:'🌟 Leer y crear',title:'Una hora para la cabeza',desc:'Un buen momento para dedicarte un rato a algo que te interese.',steps:[
    {icon:'📚',name:'Lectura o curso',desc:'30 min de algo que te inspire, nutra o desafíe.',time:'30 min'},
    {icon:'✍️',name:'Journaling profundo',desc:'¿Dónde querés estar en 1 año? Escribilo con detalle.',time:'15 min'},
    {icon:'🎨',name:'Proyecto creativo personal',desc:'Música, arte, escritura, manualidades. Lo que te haga fluir.',time:'15 min'},
  ]},
  '60_feliz_piel': {badge:'💫 Spa Day en Casa',title:'Una hora de puro lujo',desc:'Tu cuerpo se merece esta atención completa.',steps:[
    {icon:'🛁',name:'Baño ritual largo',desc:'Sales de baño o aceites esenciales. Sin apuros, sin culpa.',time:'20 min'},
    {icon:'🌸',name:'Exfoliación facial y corporal',desc:'Suave y circular. Renovás la piel de cabeza a pies.',time:'10 min'},
    {icon:'💆',name:'Mascarilla + masaje facial',desc:'15 min con la mascarilla. Masajeás con rodillo o con los dedos.',time:'15 min'},
    {icon:'🧴',name:'Skincare completo + hidratación',desc:'Todos los pasos faciales + crema o aceite en el cuerpo.',time:'15 min'},
  ]},
  '60_feliz_orden': {badge:'🌈 Tiempo para acomodarte',title:'Una hora para poner un poco de orden',desc:'Con tiempo y energía, podés adelantar cosas sin apuro.',steps:[
    {icon:'🗂️',name:'Organización profunda',desc:'Un espacio que necesite orden: armario, cocina, escritorio.',time:'20 min'},
    {icon:'📋',name:'Planificación semanal detallada',desc:'Metas, compromisos, espacios de tiempo para vos.',time:'15 min'},
    {icon:'🛒',name:'Lista de compras inteligente',desc:'Despensa, semana de menú, lo que necesitás tener en casa.',time:'10 min'},
    {icon:'🌱',name:'Un proyecto personal',desc:'Algo pequeño que tenías pendiente solo para vos. Hoy es el día.',time:'15 min'},
  ]},

  // ── Combos faltantes: 5 min ──
  '5_cansada_cuerpo': {badge:'🌿 Stretch Suave',title:'Movimiento que restaura',desc:'Cuando estás cansada, el cuerpo pide suavidad, no exigencia.',steps:[
    {icon:'🧘',name:'Cat-cow x5',desc:'En 4 apoyos. Columna lenta. Soltás la tensión acumulada.',time:'2 min'},
    {icon:'🌊',name:'Postura del niño',desc:'Frente al suelo, brazos extendidos. Respirás profundo.',time:'2 min'},
    {icon:'💧',name:'Hidratate',desc:'Un vaso de agua, despacio. Tu cuerpo lo necesita.',time:'1 min'},
  ]},
  '5_cansada_piel': {badge:'💦 SOS Hidratación',title:'Rescate exprés de piel',desc:'Cuando estás cansada tu piel también lo está. Devolvele vida.',steps:[
    {icon:'💧',name:'Agua fría en el rostro',desc:'Cierra los poros y despierta la circulación al instante.',time:'1 min'},
    {icon:'🌊',name:'Contorno de ojos',desc:'Un toque de crema y suave golpeteo con los dedos anulares.',time:'2 min'},
    {icon:'✨',name:'Hidratante express',desc:'Una capa fina de hidratante. Cerrás la piel y la protegés.',time:'2 min'},
  ]},
  '5_cansada_orden': {badge:'📝 Mínimo Vital',title:'Una sola cosa',desc:'Cuando estás cansada, solo un pequeño paso hacia adelante.',steps:[
    {icon:'📝',name:'Una tarea pendiente',desc:'Solo una. La más urgente. La anotás en papel.',time:'1 min'},
    {icon:'🗑️',name:'Un objeto fuera de lugar',desc:'Lo ponés donde va. Solo uno.',time:'1 min'},
    {icon:'🌸',name:'Recordarte que está bien',desc:'No tenés que hacerlo todo hoy. Esto alcanza.',time:'3 min'},
  ]},
  '5_energia_mente': {badge:'⚡ Activar la cabeza',title:'Activar la cabeza un rato',desc:'Con energía tu mente puede volar. Dale un objetivo.',steps:[
    {icon:'🎯',name:'Un objetivo claro',desc:'¿Qué querés lograr en las próximas 2 horas? Lo escribís.',time:'1 min'},
    {icon:'📵',name:'Silencio activo',desc:'Teléfono boca abajo, 3 respiraciones profundas.',time:'1 min'},
    {icon:'⚡',name:'Una tarea, ahora',desc:'La más importante de tu lista. Solo esa, nada más.',time:'3 min'},
  ]},
  '5_energia_piel': {badge:'✨ Glow Exprés',title:'Brilla en 5 minutos',desc:'Tu energía se nota en la piel. Amplifícala.',steps:[
    {icon:'💦',name:'Spray refrescante',desc:'Agua termal o spray hidratante. Te refresca y activa.',time:'1 min'},
    {icon:'✨',name:'Corrector e iluminador',desc:'Dos toques bajo los ojos y en el arco de ceja.',time:'2 min'},
    {icon:'💋',name:'Toque de color',desc:'Un labial nude o coral. Menos de 1 minuto de aplicación.',time:'2 min'},
  ]},
  '5_energia_orden': {badge:'⚡ Micro Sprint',title:'5 minutos de productividad pura',desc:'Con energía hasta 5 minutos rinden el doble.',steps:[
    {icon:'🗑️',name:'Limpieza flash',desc:'30 segundos tirando lo que no sirve del escritorio.',time:'1 min'},
    {icon:'📧',name:'3 emails prioritarios',desc:'Solo los urgentes. Respondés breve y vas.',time:'2 min'},
    {icon:'✅',name:'Un pendiente quick',desc:'Algo de tu lista que se resuelve en 2 minutos. Ya.',time:'2 min'},
  ]},
  '5_estres_cuerpo': {badge:'🌬️ Liberar la Tensión',title:'Soltar el estrés del cuerpo',desc:'El estrés se guarda en el cuerpo. Lo liberamos con movimiento.',steps:[
    {icon:'🌬️',name:'Respiración 4-7-8',desc:'Inhalás 4 seg, sostenés 7, exhalás 8. Repetís 4 veces.',time:'2 min'},
    {icon:'💆',name:'Masaje de cuello y hombros',desc:'Con los pulgares en la base del cráneo. Círculos suaves.',time:'2 min'},
    {icon:'🤸',name:'Sacudite',desc:'Pies, piernas, brazos, manos. Literalmente sacudirte suelta tensión.',time:'1 min'},
  ]},
  '5_estres_mente': {badge:'🧠 Calma Mental',title:'5 minutos para bajar revoluciones',desc:'La mente estresada necesita un ancla. Esto la encuentra.',steps:[
    {icon:'🫁',name:'Box breathing',desc:'4 seg inhalás, 4 sostenés, 4 exhalás, 4 esperas. x4 rondas.',time:'2 min'},
    {icon:'👁️',name:'Técnica 5-4-3-2-1',desc:'5 cosas que ves, 4 que tocás, 3 que oís, 2 que olés, 1 que saboreás.',time:'2 min'},
    {icon:'🌿',name:'Una frase de anclaje',desc:'Te decís: "esto también pasa". Lo sentís de verdad.',time:'1 min'},
  ]},
  '5_estres_orden': {badge:'🌊 Claridad Express',title:'Orden para calmar el caos',desc:'A veces ordenar algo pequeño calma la cabeza grande.',steps:[
    {icon:'📝',name:'Vuelca todo a papel',desc:'Todo lo que tenés en la cabeza, a una lista. Sale de ahí.',time:'2 min'},
    {icon:'🗂️',name:'Prioridad única',desc:'De todo lo que anotaste, ¿cuál es solo una cosa importante? Marcála.',time:'2 min'},
    {icon:'🌸',name:'Lo demás puede esperar',desc:'Todo lo otro lo dejás para mañana. Sin culpa.',time:'1 min'},
  ]},
  // ── Combos faltantes: 15 min ──
  '15_cansada_cuerpo': {badge:'🌿 Restauración Activa',title:'Movimiento suave de 15 min',desc:'No hace falta exigirse cuando uno está cansada. La suavidad también es fuerza.',steps:[
    {icon:'🧘',name:'Yoga suave de apertura',desc:'Postura del gato, del niño, torsión suave. 10 minutos sin apuro.',time:'10 min'},
    {icon:'🌬️',name:'Respiración consciente',desc:'5 respiraciones profundas antes y después de cada postura.',time:'3 min'},
    {icon:'🌸',name:'Descanso final',desc:'Shavasana. 2 minutos tumbada. Tu cuerpo lo merece.',time:'2 min'},
  ]},
  '15_cansada_piel': {badge:'🌙 Ritual Nocturno',title:'Skincare de recarga',desc:'Cuando estás cansada, el skincare es cuidado y descanso al mismo tiempo.',steps:[
    {icon:'💦',name:'Doble limpieza suave',desc:'Bálsamo desmaquillante + gel suave. Quitás el día de encima.',time:'5 min'},
    {icon:'🌊',name:'Sérum de noche',desc:'Retinol o vitamina C nocturno, según tu piel.',time:'3 min'},
    {icon:'💆',name:'Mascarilla en crema',desc:'Hidratante densa o mascarilla de noche. La dejás toda la noche.',time:'7 min'},
  ]},
  '15_cansada_orden': {badge:'🌙 Reset Suave',title:'Un orden mínimo para descansar bien',desc:'Ordenar un poco antes de dormir ayuda a desconectar mejor.',steps:[
    {icon:'🌙',name:'Cerrar el día',desc:'Anotás en 3 líneas: qué lograste, qué dejás para mañana, una cosa buena del día.',time:'5 min'},
    {icon:'🗂️',name:'Escritorio o mesita',desc:'Un espacio físico despejado. No todo, solo uno.',time:'5 min'},
    {icon:'📲',name:'Teléfono en modo noche',desc:'No notification, modo avión o alcance limitado. Tu mente descansa.',time:'5 min'},
  ]},
  '15_energia_mente': {badge:'🔥 Foco Total',title:'15 minutos de concentración pura',desc:'La energía que tenés, la canalizás hacia lo que más importa.',steps:[
    {icon:'🎯',name:'Pomodoro exprés',desc:'Elegís UNA tarea. Ponés 15 min en el timer. Sin interrupciones.',time:'12 min'},
    {icon:'📝',name:'Cierre y próximo paso',desc:'Al terminar: ¿qué lograste? ¿cuál es el siguiente paso concreto?',time:'3 min'},
  ]},
  '15_energia_piel': {badge:'🌟 Ritual AM Completo',title:'Skincare de mañana, paso a paso',desc:'Cuando tenés tiempo y energía, cada paso cuenta.',steps:[
    {icon:'💦',name:'Limpieza y tónico',desc:'Piel limpia, tónico equilibrante. La base de todo.',time:'3 min'},
    {icon:'✨',name:'Vitamina C + sérum',desc:'Protección antioxidante y activos según tu piel.',time:'4 min'},
    {icon:'☀️',name:'Hidratante + FPS 50',desc:'El paso que no se saltea. Nunca.',time:'3 min'},
    {icon:'💄',name:'Opcionales de maquillaje',desc:'Lo que te salga ese día: base, corrector, máscara.',time:'5 min'},
  ]},
  '15_energia_orden': {badge:'⚡ Productividad Express',title:'15 minutos, máximo rendimiento',desc:'Con energía cada minuto rinde mucho. A aprovecharlos.',steps:[
    {icon:'🎯',name:'Lista de las 3 más importantes',desc:'Solo tres. Las tareas del día que SÍ van a mover la aguja.',time:'2 min'},
    {icon:'📧',name:'Inbox zero parcial',desc:'Respondés urgentes, archivás el resto, borrás lo que sobra.',time:'8 min'},
    {icon:'📅',name:'Revisión de agenda',desc:'¿Qué compromisos tenés? ¿Hay algo que pueda moverse?',time:'5 min'},
  ]},
  '15_estres_cuerpo': {badge:'💆 Soltar la Tensión',title:'Cuerpo antistrés en 15 min',desc:'El estrés vive en el cuerpo. Con 15 min lo podés soltar.',steps:[
    {icon:'🚶‍♀️',name:'Caminata corta sin pantallas',desc:'10 minutos afuera si podés, o por la casa. Sin teléfono.',time:'10 min'},
    {icon:'🧘',name:'Postura de piernas en pared',desc:'Acostada, piernas apoyadas en la pared. 5 minutos. Calma el sistema nervioso.',time:'5 min'},
  ]},
  '15_estres_mente': {badge:'🌊 Reset Mental',title:'15 minutos para tu cabeza',desc:'Cuando la mente no para, le das un lugar donde sí puede.',steps:[
    {icon:'📔',name:'Stream of consciousness',desc:'Escribís sin parar 10 minutos. Todo lo que aparezca. Sin releer.',time:'10 min'},
    {icon:'🫁',name:'Respiración de coherencia',desc:'5 seg inhalás, 5 exhalás. Durante 5 minutos. Equilibra el sistema nervioso.',time:'5 min'},
  ]},
  '15_estres_piel': {badge:'🌸 SOS Piel Estresada',title:'Calma para piel y mente',desc:'El skincare como meditación activa.',steps:[
    {icon:'💧',name:'Agua fría + limpieza',desc:'El agua fría activa. La limpieza suave resetea.',time:'3 min'},
    {icon:'🌿',name:'Mascarilla calmante',desc:'Caolín, aloe o avena. Para pieles reactivas al estrés.',time:'8 min'},
    {icon:'🌊',name:'Cierre con hidratante',desc:'Textura cremosa, movimientos lentos y hacia arriba.',time:'4 min'},
  ]},
  '15_estres_orden': {badge:'🌿 Un Solo Paso',title:'Solo una cosa, bien hecha',desc:'Cuando todo se acumula, la clave es un solo paso.',steps:[
    {icon:'📝',name:'Lo que tenés en la cabeza, al papel',desc:'Todo lo que ronda, sin orden ni filtro. 5 minutos para sacarlo de ahí.',time:'5 min'},
    {icon:'🔴',name:'Solo una cosa urgente',desc:'De todo lo que anotaste, cuál es la más urgente. Solo esa.',time:'2 min'},
    {icon:'⏱️',name:'10 minutos de acción',desc:'Solo esa tarea. Timer en 10 min. Al terminar, cerrás.',time:'8 min'},
  ]},
  // ── Combos faltantes: 30 min ──
  '30_cansada_cuerpo': {badge:'🌿 Yoga Restaurativo',title:'Movimiento que recarga',desc:'30 minutos de yoga para reponer energía.',steps:[
    {icon:'🧘',name:'Apertura de cadera suave',desc:'Postura de la paloma, 3 minutos por lado.',time:'6 min'},
    {icon:'🌊',name:'Torsiones espinales',desc:'Acostada, rodillas al pecho, torsión lenta a cada lado.',time:'8 min'},
    {icon:'🌙',name:'Posturas de tierra',desc:'Perro boca abajo, postura del niño, gato-vaca.',time:'10 min'},
    {icon:'🌸',name:'Shavasana extendido',desc:'6 minutos de descanso consciente. Merecido.',time:'6 min'},
  ]},
  '30_cansada_mente': {badge:'🌙 Descanso Mental',title:'Ritual de desconexión',desc:'La mente cansada necesita permiso para descansar.',steps:[
    {icon:'📵',name:'Sin pantallas',desc:'Teléfono boca abajo, notificaciones silenciadas.',time:'1 min'},
    {icon:'🍵',name:'Infusión ritual',desc:'Preparás el té o mate con consciencia. Cada paso importa.',time:'7 min'},
    {icon:'📖',name:'Lectura suave',desc:'Algo de placer. Sin información, sin urgencia.',time:'20 min'},
    {icon:'🌸',name:'Journaling de 2 líneas',desc:'¿Cómo te sentiste hoy? Solo dos oraciones.',time:'2 min'},
  ]},
  '30_cansada_piel': {badge:'🌙 Spa Nocturno',title:'Ritual de belleza reparador',desc:'Cuando el cuerpo está cansado, el skincare es medicina.',steps:[
    {icon:'🛁',name:'Baño o ducha caliente',desc:'15 minutos. Con aceite o sal de baño si tenés.',time:'15 min'},
    {icon:'🌸',name:'Skincare completo',desc:'Limpieza, tónico, sérum de noche, hidratante.',time:'10 min'},
    {icon:'🧴',name:'Crema de manos y pies',desc:'Lo que más olvidamos. Cerrás el día cuidándote completa.',time:'5 min'},
  ]},
  '30_cansada_orden': {badge:'🌈 Reset Gentil',title:'Organización sin exigencia',desc:'Ordenar cuando estás cansada es solo un paso pequeño.',steps:[
    {icon:'🌙',name:'Cierre del día',desc:'¿Qué hiciste hoy? ¿Qué dejás para mañana? 3 líneas máximo.',time:'5 min'},
    {icon:'🗂️',name:'Una zona pequeña',desc:'La cocina, el baño, la mesita. Solo una y chica.',time:'15 min'},
    {icon:'📲',name:'Digital order',desc:'Fotos del día organizadas, pantalla del celu limpia.',time:'10 min'},
  ]},
  '30_energia_cuerpo': {badge:'🔥 Circuito Express',title:'30 minutos de potencia',desc:'Tenés energía para dar y llevar. A usarla.',steps:[
    {icon:'🤸',name:'Calentamiento completo',desc:'5 min de movilidad articular y cardio suave.',time:'5 min'},
    {icon:'💪',name:'Fuerza funcional',desc:'4 series: sentadillas, peso muerto, fondos, abdominales.',time:'15 min'},
    {icon:'⚡',name:'Finisher cardio',desc:'5 min de HIIT: burpees, mountain climbers, saltos.',time:'5 min'},
    {icon:'🧘',name:'Estiramientos',desc:'5 min de cierre para no quedar rígida.',time:'5 min'},
  ]},
  '30_energia_mente': {badge:'🧠 Aprendizaje Activo',title:'Media hora para crecer',desc:'Con energía el aprendizaje se asienta mejor.',steps:[
    {icon:'📚',name:'Lectura técnica o de desarrollo',desc:'20 min de algo que te nutra o desafíe.',time:'20 min'},
    {icon:'✍️',name:'Síntesis propia',desc:'¿Qué aprendiste? ¿Cómo lo usás? Lo escribís en tus palabras.',time:'7 min'},
    {icon:'🎯',name:'Una acción concreta',desc:'Algo que vas a aplicar esta semana. Lo ponés en tu agenda.',time:'3 min'},
  ]},
  '30_energia_orden': {badge:'🌈 Tenés resto hoy',title:'Media hora para avanzar tranquila',desc:'Con un rato y algo de energía, podés dejar la semana un poco más ordenada.',steps:[
    {icon:'📋',name:'Revisión y planificación',desc:'¿Qué pendientes tenés? Los organizás por urgencia e importancia.',time:'10 min'},
    {icon:'📧',name:'Comunicaciones al día',desc:'Emails, mensajes, respuestas pendientes. Limpiás el backlog.',time:'10 min'},
    {icon:'🏠',name:'Un espacio físico',desc:'El escritorio, la cocina, el placard. Lo que más necesite.',time:'10 min'},
  ]},
  '30_estres_cuerpo': {badge:'💆 Movimiento Terapéutico',title:'Soltar el estrés del cuerpo',desc:'El estrés acumulado en el cuerpo se disuelve con movimiento consciente.',steps:[
    {icon:'🚶‍♀️',name:'Caminata sin teléfono',desc:'15 min afuera si podés. Respirás, mirás, no pensás.',time:'15 min'},
    {icon:'🧘',name:'Yoga suave de apertura',desc:'Cadera, pecho, hombros. Donde el estrés más se acumula.',time:'10 min'},
    {icon:'🫁',name:'Respiración de cierre',desc:'4-7-8 x5 repeticiones. Bajas el sistema nervioso.',time:'5 min'},
  ]},
  '30_estres_piel': {badge:'🌿 Ritual Calmante',title:'Skincare como meditación',desc:'El ritual de belleza puede ser tu meditación cuando estás estresada.',steps:[
    {icon:'💦',name:'Limpieza doble',desc:'Bálsamo + espuma suave. El proceso ya es calmante.',time:'5 min'},
    {icon:'🌿',name:'Mascarilla calmante',desc:'Aloe vera, centella asiática o avena. 15 minutos de pausa real.',time:'15 min'},
    {icon:'🌊',name:'Sérum + hidratante',desc:'Capas livianas, movimientos suaves hacia arriba.',time:'7 min'},
    {icon:'🌸',name:'Contorno de ojos',desc:'El toque de cuidado que muchas veces se olvida.',time:'3 min'},
  ]},
  '30_estres_orden': {badge:'🌊 Calma Organizada',title:'Ordenar para respirar',desc:'Un espacio ordenado calma una mente en caos.',steps:[
    {icon:'🫁',name:'Respira antes',desc:'3 minutos de respiración. Antes de tocar nada.',time:'3 min'},
    {icon:'📝',name:'Lo que está en tu cabeza, al papel',desc:'Sin orden, sin filtro. Solo sacarlo de ahí.',time:'7 min'},
    {icon:'🗂️',name:'Prioridad única del día',desc:'De toda esa lista, ¿cuál es la más importante? Solo esa.',time:'5 min'},
    {icon:'🏠',name:'Un espacio físico',desc:'Solo uno. El que más te molesta ver desordenado.',time:'15 min'},
  ]},
  // ── Combos faltantes: 60 min ──
  '60_cansada_cuerpo': {badge:'🌿 Yoga Reparador',title:'Una hora de movimiento restaurativo',desc:'Cuando estás cansada y tenés tiempo, el yoga reparador es el regalo.',steps:[
    {icon:'🧘',name:'Yoga restaurativo',desc:'Posturas apoyadas con cojines o mantas. Sin esfuerzo.',time:'30 min'},
    {icon:'🚶‍♀️',name:'Caminata suave',desc:'20 min lentos, sin destino, sin ritmo, sin teléfono.',time:'20 min'},
    {icon:'🌸',name:'Shavasana largo',desc:'10 minutos de descanso consciente al final.',time:'10 min'},
  ]},
  '60_cansada_mente': {badge:'🌙 Día de Silencio',title:'Una hora para no hacer nada',desc:'A veces el mejor cuidado es simplemente descansar la mente.',steps:[
    {icon:'📵',name:'Desconexión total',desc:'Teléfono apagado o en modo avión. Si podés, vale la pena.',time:'2 min'},
    {icon:'🛁',name:'Baño largo',desc:'Agua caliente, sin apuros, sin música ni podcast.',time:'20 min'},
    {icon:'📖',name:'Lectura placentera',desc:'Algo que hayas querido leer hace tiempo, sin presión.',time:'25 min'},
    {icon:'🌙',name:'Siesta o descanso',desc:'Si el cuerpo pide dormir, escuchalo. 13 minutos son suficientes.',time:'13 min'},
  ]},
  '60_cansada_piel': {badge:'💆 Spa Completo',title:'Una hora de puro cuidado',desc:'Cuando estás cansada y tenés tiempo, el spa en casa es el regalo perfecto.',steps:[
    {icon:'🛁',name:'Baño ritual largo',desc:'Con sales de baño o aceite esencial. Sin apuros.',time:'20 min'},
    {icon:'🌸',name:'Exfoliación suave',desc:'Corporal o facial, o ambas. Piel nueva para mente nueva.',time:'10 min'},
    {icon:'💆',name:'Mascarilla + masaje facial',desc:'15 min con mascarilla, masajeás cuello y escote.',time:'15 min'},
    {icon:'🧴',name:'Hidratación total',desc:'Cara, cuello, brazos, piernas, manos. Todo.',time:'15 min'},
  ]},
  '60_estres_piel': {badge:'🌿 Ritual Antiestrés',title:'Una hora de skincare terapéutico',desc:'Una hora entera de cuidado personal para bajar el cortisol.',steps:[
    {icon:'🛁',name:'Baño de inmersión',desc:'Sales de baño con lavanda o manzanilla. 20 minutos sin prisa.',time:'20 min'},
    {icon:'💆',name:'Masaje corporal suave',desc:'Aceite de almendras o coco. Movimientos lentos, descendentes.',time:'15 min'},
    {icon:'🌿',name:'Mascarilla facial calmante',desc:'Centella asiática o avena. La dejás actuar 15 minutos.',time:'15 min'},
    {icon:'🌸',name:'Skincare facial completo',desc:'Todos los pasos, sin apuros. Ritualizás cada producto.',time:'10 min'},
  ]},
  // ── Otros combos faltantes ──
  '60_energia_cuerpo': {badge:'🏆 Energía en movimiento',title:'Una hora moviéndote a tu ritmo',desc:'Hoy parece uno de esos días donde podés avanzar un poco más.',steps:[
    {icon:'🤸',name:'Calentamiento completo',desc:'10 min de movilidad articular y activación muscular.',time:'10 min'},
    {icon:'💪',name:'Fuerza funcional',desc:'4 rondas de: sentadillas, peso muerto, estocadas, flexiones.',time:'20 min'},
    {icon:'⚡',name:'Cardio HIIT',desc:'Tabata completo: 8 ejercicios, 20 seg cada uno.',time:'15 min'},
    {icon:'🧘',name:'Vuelta a la calma',desc:'Yoga restaurativo y estiramientos profundos.',time:'15 min'},
  ]},
  '60_energia_mente': {badge:'📚 Tiempo para aprender algo que te gusta',title:'Una hora para tu mente',desc:'Energía + tiempo = la combinación perfecta para crecer.',steps:[
    {icon:'📚',name:'Aprendizaje activo',desc:'Un curso, un libro técnico, o un podcast de alto valor. Tomás notas.',time:'30 min'},
    {icon:'✍️',name:'Síntesis y aplicación',desc:'¿Qué aprendiste? ¿Cómo lo aplicás a tu vida? Lo escribís.',time:'15 min'},
    {icon:'🎯',name:'Plan de acción',desc:'Una cosa concreta que vas a implementar esta semana.',time:'15 min'},
  ]},
  '60_energia_piel': {badge:'💎 Glow Total',title:'Un spa day completo',desc:'Con energía se disfruta más el autocuidado.',steps:[
    {icon:'🛁',name:'Baño con rituales',desc:'Sales, aceites, velas. El proceso completo sin apuros.',time:'20 min'},
    {icon:'🌸',name:'Exfoliación + mascarilla',desc:'Peeling suave y mascarilla nutritiva según tu tipo de piel.',time:'15 min'},
    {icon:'💆',name:'Skincare completo',desc:'Todos los pasos, con masaje facial de 5 minutos incluido.',time:'15 min'},
    {icon:'🧴',name:'Hidratación total',desc:'Cuerpo, manos y pies. Crema rica, sin saltear ningún punto.',time:'10 min'},
  ]},
  '60_energia_orden': {badge:'⚡ Si hoy tenés energía',title:'Una hora con energía',desc:'Si hoy tenés energía, ordenar un poco puede aliviar la semana.',steps:[
    {icon:'🗂️',name:'Ordenar lo digital',desc:'Emails, fotos, archivos. Lo que más te pese tener pendiente.',time:'20 min'},
    {icon:'📋',name:'Un vistazo al mes',desc:'Compromisos, cosas pendientes y al menos algo solo para vos.',time:'20 min'},
    {icon:'🏠',name:'Un espacio que lo necesite',desc:'Uno solo. El que más te pese ver desordenado.',time:'20 min'},
  ]},
  '60_estres_cuerpo': {badge:'💪 Mover Para Soltar',title:'Movimiento que libera',desc:'El estrés acumulado en el cuerpo se libera con movimiento.',steps:[
    {icon:'🚶‍♀️',name:'Caminata lenta sin teléfono',desc:'20 min al aire libre. Respirás, mirás alrededor, nada de pantallas.',time:'20 min'},
    {icon:'🧘',name:'Yoga suave',desc:'Posturas de apertura: corazón, caderas, espalda. Sin forzar.',time:'25 min'},
    {icon:'🫁',name:'Respiración 4-7-8',desc:'El cierre. 5 repeticiones completas para bajar el sistema nervioso.',time:'5 min'},
    {icon:'💧',name:'Vaso de agua',desc:'Y un momento de quietud. Ya hiciste mucho.',time:'10 min'},
  ]},
  '60_estres_mente': {badge:'🌿 Reset Profundo',title:'Una hora para resetear',desc:'Cuando la cabeza no para, le das espacio para que sí pare.',steps:[
    {icon:'🚶‍♀️',name:'Caminata sin destino',desc:'30 min. Sin podcast, sin música. Solo tus pensamientos y el aire.',time:'30 min'},
    {icon:'📔',name:'Journaling de descarga',desc:'Todo lo que pesa. Sin censura. Solo para vos.',time:'15 min'},
    {icon:'🫁',name:'Meditación guiada',desc:'Una app de meditación o simplemente silencio con respiración.',time:'10 min'},
    {icon:'🍵',name:'Infusión y nada más',desc:'5 minutos de no hacer absolutamente nada.',time:'5 min'},
  ]},
  '60_estres_orden': {badge:'🌊 Calma Organizada',title:'Orden para calmar la mente',desc:'A veces ordenar el espacio externo ordena el interno.',steps:[
    {icon:'🫁',name:'Primero: respirar',desc:'5 respiraciones profundas antes de empezar. Solo eso.',time:'2 min'},
    {icon:'🗂️',name:'Una zona a la vez',desc:'Solo una. El escritorio, la mesa, la mesita. No todo.',time:'25 min'},
    {icon:'📋',name:'Lista de pendientes',desc:'Todo lo que está en tu cabeza, a papel. Sale de ahí.',time:'15 min'},
    {icon:'🌸',name:'Ritual de cierre',desc:'Skincare o algo pequeño que te guste. Cierre suave del día.',time:'18 min'},
  ]},
};
function selectQuiz(key, val, btn) {
  quizAnswers[key] = val;
  var siblings = btn.parentElement.querySelectorAll('.quiz-opt');
  siblings.forEach(function(b){b.classList.remove('selected');});
  btn.classList.add('selected');
  if(navigator.vibrate) navigator.vibrate(10);
  // detectar step actual recorriendo el árbol padre
  var step = 0;
  var el = btn;
  while(el && el !== document.body) {
    if(el.id && el.id.indexOf('quiz-step-') === 0) {
      step = parseInt(el.id.replace('quiz-step-',''));
      break;
    }
    el = el.parentElement;
  }
  if(step > 0 && step < 3) {
    setTimeout(function(){ quizNext(step + 1); }, 220);
  } else if(step === 3) {
    setTimeout(function(){ generateRutina(); }, 220);
  }
}
function quizNext(step) {
  // validar que el paso actual tenga selección antes de avanzar
  if(step > 1) {
    var keys = ['','tiempo','estado','foco'];
    var needed = keys[step - 1];
    if(needed && !quizAnswers[needed]) {
      // sacudir el step actual para indicar que falta selección
      var cur = document.getElementById('quiz-step-'+(step-1));
      if(cur) { cur.style.transition='transform .1s'; cur.style.transform='translateX(6px)'; setTimeout(function(){cur.style.transform='translateX(-6px)';setTimeout(function(){cur.style.transform='';},100);},100); }
      return;
    }
  }
  for(var i=1;i<=3;i++){
    var el = document.getElementById('quiz-step-'+i);
    if(el) el.style.display = (i===step)?'block':'none';
  }
  var dots = document.querySelectorAll('#quiz-dots .quiz-dot');
  dots.forEach(function(d,i){
    d.classList.remove('active','done');
    if(i+1 < step) d.classList.add('done');
    else if(i+1 === step) d.classList.add('active');
  });
}
function generateRutina() {
  var t = quizAnswers.tiempo||'15';
  var e = quizAnswers.estado||'energia';
  var f = quizAnswers.foco||'cuerpo';
  var key = t+'_'+e+'_'+f;
  var rutina = RUTINAS_DB[key];
  if(!rutina) {
    var fallbackKeys = Object.keys(RUTINAS_DB).filter(function(k){return k.startsWith(t+'_')||k.includes('_'+e+'_');});
    rutina = RUTINAS_DB[fallbackKeys[0]] || RUTINAS_DB['15_energia_cuerpo'];
  }
  document.getElementById('rutina-quiz').style.display='none';
  var result = document.getElementById('rutina-result');
  result.classList.add('show');
  document.getElementById('rutina-badge').textContent = rutina.badge;
  document.getElementById('rutina-title').textContent = rutina.title;
  document.getElementById('rutina-desc').textContent = rutina.desc;
  var stepsEl = document.getElementById('rutina-steps');
  stepsEl.innerHTML = '';
  rutina.steps.forEach(function(s){
    var div = document.createElement('div');
    div.className = 'rutina-step fade-up';
    div.innerHTML = '<div class="rutina-step-icon">'+s.icon+'</div><div class="rutina-step-info"><div class="rutina-step-name">'+s.name+'</div><div class="rutina-step-desc">'+s.desc+'</div><div class="rutina-step-time">⏱ '+s.time+'</div></div>';
    stepsEl.appendChild(div);
  });
  // Re-observe new fade-up elements
  stepsEl.querySelectorAll('.fade-up').forEach(function(el){obs.observe(el);});
  result.scrollIntoView({behavior:'smooth',block:'start'});
}
// Add pointerdown to quiz-opts for immediate visual feedback
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.quiz-opt').forEach(function(btn){
    btn.addEventListener('pointerdown', function(){
      this.style.opacity = '0.75';
    });
    btn.addEventListener('pointerup', function(){
      this.style.opacity = '';
    });
    btn.addEventListener('pointercancel', function(){
      this.style.opacity = '';
    });
  });
});
function resetRutina() {
  quizAnswers = {};
  document.getElementById('rutina-quiz').style.display='block';
  document.getElementById('rutina-result').classList.remove('show');
  document.querySelectorAll('.quiz-opt').forEach(function(b){b.classList.remove('selected');});
  quizNext(1);
}

// Init toolbox switchTool override to render hábitos
// switchTool override removed (habitos/galeria now handled inside switchTool)


// ─── DAILY CHECK-IN ───────────────────────────────────────────────────────
var _DCI_DATA = {
  llena: {
    titulo: 'Bajemos el ruido juntas.',
    frase: 'Nada que completar. Solo estar un rato.',
    principal: { ico:'🫁', bg:'rgba(106,155,132,.15)', nombre:'Respirá 5 minutos', hint:'guiado · sin esfuerzo', fn:'openCinco()' },
    secundarias: [
      { ico:'💬', bg:'rgba(166,123,91,.12)', nombre:'Vaciá un poco la cabeza', hint:'journaling libre', fn:"abrirBloc()" },
      { ico:'🆘', bg:'rgba(200,168,120,.15)', nombre:'Kit de calma urgente', hint:'para cuando es mucho', fn:'openEmergency()' }
    ]
  },
  bien: {
    titulo: 'Este rato es tuyo.',
    frase: 'Sin agenda. Sin tarea. Solo vos y lo que necesitás ahora.',
    principal: { ico:'🎵', bg:'rgba(106,155,132,.12)', nombre:'Música o silencio', hint:'lo que te pida el cuerpo', fn:'toggleMusic()' },
    secundarias: [
      { ico:'📖', bg:'rgba(166,123,91,.12)', nombre:'Leer algo tranquilo', hint:'biblioteca · sin prisa', fn:"showPanel('biblioteca')" },
      { ico:'🫁', bg:'rgba(106,155,132,.15)', nombre:'Respirar despacio', hint:'5 minutos · solo eso', fn:'openCinco()' }
    ]
  },
  energia: {
    titulo: 'Buena energía. ¿Qué querés mover hoy?',
    frase: 'Todo lo que necesitás está acá.',
    principal: { ico:'🔥', bg:'rgba(200,168,120,.15)', nombre:'Empezar una rutina', hint:'suave · media · completa', fn:"showPanel('rutinas')" },
    secundarias: [
      { ico:'🥗', bg:'rgba(106,155,132,.12)', nombre:'Comer algo rico y sano', hint:'recetas fáciles', fn:"showPanel('recetario')" },
      { ico:'✍️', bg:'rgba(166,123,91,.12)', nombre:'Escribir lo que sentís', hint:'journaling intencional', fn:"abrirBloc()" }
    ]
  },
  nose: {
    titulo: 'Está bien no saber.',
    frase: 'KALMA no necesita que estés definida. Podés explorar despacio.',
    principal: { ico:'🫁', bg:'rgba(106,155,132,.15)', nombre:'Algo tranquilo', hint:'respiración guiada · 5 min', fn:'openCinco()' },
    secundarias: [
      { ico:'💬', bg:'rgba(166,123,91,.12)', nombre:'Escribir sin filtro', hint:'sin estructura · sin presión', fn:"abrirBloc()" },
      { ico:'✨', bg:'rgba(200,168,120,.12)', nombre:'Sorprendeme', hint:'algo al azar de KALMA', fn:'_dciSorpresa()' }
    ]
  }
};

// ─── DAILY CHECK-IN ────────────────────────────────────────────────────────

// Arranca la app según el estado de la usuaria:
// - Sin onboarding → nada (el onboarding se encarga)

// ── KALMA — funciones pantalla inicial ──────────────────────────────────
function kalmaElegir(estado) {
  // Guardar estado
  try {
    var conteo = parseInt(localStorage.getItem('kalma-checkin-count') || '0', 10);
    localStorage.setItem('kalma-checkin-date',   new Date().toDateString());
    localStorage.setItem('kalma-checkin-estado', estado);
    localStorage.setItem('kalma-checkin-count',  conteo + 1);
  } catch(e){}

  var data = (typeof _DCI_DATA !== 'undefined') ? _DCI_DATA[estado] : null;
  if(!data){ kalmaVerTodo(); return; }

  // Pre-llenar panel-hoy
  if(typeof _dciLlenarCards === 'function')        _dciLlenarCards(data);
  if(typeof _dciActualizarPanelHoy === 'function') _dciActualizarPanelHoy(data);

  // Llenar panel-recomendacion con 1 sola sugerencia
  var c = data.principal;
  var get = function(id){ return document.getElementById(id); };
  if(get('rec-titulo')) get('rec-titulo').textContent = data.titulo;
  if(get('rec-frase'))  get('rec-frase').textContent  = data.frase;
  if(get('rec-card-ico')){
    get('rec-card-ico').textContent    = c.ico;
    get('rec-card-ico').style.background = c.bg;
  }
  if(get('rec-card-nombre')) get('rec-card-nombre').textContent = c.nombre;
  if(get('rec-card-hint'))   get('rec-card-hint').textContent   = c.hint;
  var card = get('rec-card');
  if(card) card.onclick = function(){ try{ eval(c.fn); }catch(e){} };

  showPanel('recomendacion');
}

function kalmaVerTodo() {
  document.body.classList.add('bnav-visible');
  var estadoUlt = localStorage.getItem('kalma-checkin-estado');
  var data = (typeof _DCI_DATA !== 'undefined' && estadoUlt) ? _DCI_DATA[estadoUlt] : null;
  if(data) {
    if(typeof _dciLlenarCards === 'function')        _dciLlenarCards(data);
    if(typeof _dciActualizarPanelHoy === 'function') _dciActualizarPanelHoy(data);
  }
  showPanel('hoy');
}

function kalmaInicio() {
  showPanel('calma');
}

// - Onboarded + ya hizo check-in hoy → ir directo a panel-hoy personalizado
// - Onboarded + menos de 7 check-ins históricos → mostrar overlay (pregunta)
// - Onboarded + 7+ check-ins → ir directo a panel-hoy con estado de ayer + chip de actualización
function _dciArrancar() {
  // ── V1: sin onboarding — el check-in es siempre la primera pantalla ──
  // (antes requería kalma-onboarded; ahora arranca siempre)

  var hoy       = new Date().toDateString();
  var fechaUlt  = localStorage.getItem('kalma-checkin-date');
  var estadoUlt = localStorage.getItem('kalma-checkin-estado');
  var conteo    = parseInt(localStorage.getItem('kalma-checkin-count') || '0', 10);

  // Ya respondió hoy → panel-hoy directo
  if(fechaUlt === hoy && estadoUlt && _DCI_DATA[estadoUlt]) {
    _dciLlenarCards(_DCI_DATA[estadoUlt]);
    _dciActualizarPanelHoy(_DCI_DATA[estadoUlt]);
    showPanel('hoy');
    return;
  }

  // 7+ check-ins y tiene estado guardado → patrón conocido, va directo con chip
  if(conteo >= 7 && estadoUlt && _DCI_DATA[estadoUlt]) {
    _dciLlenarCards(_DCI_DATA[estadoUlt]);
    _dciActualizarPanelHoy(_DCI_DATA[estadoUlt]);
    _dciMostrarChipActualizar();
    showPanel('hoy');
    return;
  }

  // Primera visita o nuevo día → mostrar "¿Cómo llegás hoy?"
  var el = document.getElementById('daily-checkin-overlay');
  if(el) {
    el.style.display = 'block';
    history.pushState({ overlay: 'checkin-p1' }, '');
  }
}
// Esperar a que el DOM esté listo para que getElementById encuentre los elementos
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _dciArrancar);
} else {
  _dciArrancar();
}

function dciElegir(estado) {
  try {
    // Guardar estado y sumar al conteo histórico
    var conteo = parseInt(localStorage.getItem('kalma-checkin-count') || '0', 10);
    localStorage.setItem('kalma-checkin-date',   new Date().toDateString());
    localStorage.setItem('kalma-checkin-estado', estado);
    localStorage.setItem('kalma-checkin-count',  conteo + 1);

    var data = _DCI_DATA[estado];
    if(!data) { _dciCerrar(); return; }

    // Pre-llenar panel-hoy (en background, para cuando lleguen)
    _dciLlenarCards(data);
    _dciActualizarPanelHoy(data);

    // Poblar p2 del overlay
    var t2 = document.getElementById('dci2-titulo');
    var f2 = document.getElementById('dci2-frase');
    if(t2) t2.textContent = data.titulo;
    if(f2) f2.textContent = data.frase;

    var cards2 = document.getElementById('dci2-cards');
    if(cards2) {
      cards2.innerHTML = '';
      var c = data.principal;
      var big = document.createElement('button');
      big.className = 'dci-card-big';
      big.setAttribute('onclick', "dciEntrar('" + c.fn.replace(/'/g,"\\'") + "');");
      big.innerHTML = '<div class="dci-card-ico" style="background:'+c.bg+'">'+c.ico+'</div>'
        +'<div style="flex:1"><div class="dci-card-name">'+c.nombre+'</div><div class="dci-card-hint">'+c.hint+'</div></div>'
        +'<div class="dci-card-arrow">›</div>';
      cards2.appendChild(big);
      data.secundarias.forEach(function(s){
        var sm = document.createElement('button');
        sm.className = 'dci-card-sm';
        sm.setAttribute('onclick', "dciEntrar('" + s.fn.replace(/'/g,"\\'") + "');");
        sm.innerHTML = '<div class="dci-card-sm-ico" style="background:'+s.bg+'">'+s.ico+'</div>'
          +'<div style="flex:1"><div class="dci-card-sm-name">'+s.nombre+'</div><div class="dci-card-sm-hint">'+s.hint+'</div></div>'
          +'<div class="dci-card-sm-arrow">›</div>';
        cards2.appendChild(sm);
      });
    }

    // Transición p1 → p2
    var p1 = document.getElementById('dci-p1');
    var p2 = document.getElementById('dci-p2');
    if(p1) { p1.style.transition='opacity .3s'; p1.style.opacity='0'; }
    setTimeout(function(){
      if(p1) p1.style.display = 'none';
      if(p2) { p2.style.display='flex'; p2.style.opacity='0'; p2.style.transition='opacity .35s'; setTimeout(function(){ p2.style.opacity='1'; },20); }
      // atrás vuelve a p1 del check-in en vez de salir
      history.pushState({ panel: 'dci-p2' }, '', '');
    }, 300);
  } catch(e) { dciEntrar(); }
}

function _dciLlenarCards(data) {
  var pEl = document.getElementById('hoy-principal');
  var sEl = document.getElementById('hoy-secundarias');
  if(pEl) {
    var c = data.principal;
    pEl.innerHTML = '<button class="hoy-card-main" onclick="'+c.fn+'"><div class="hoy-card-main-icon" style="background:'+c.bg+'">'+c.ico+'</div><div style="flex:1"><div class="hoy-card-main-name">'+c.nombre+'</div><div class="hoy-card-main-hint">'+c.hint+'</div></div><div class="hoy-card-main-arrow">›</div></button>';
  }
  if(sEl) {
    sEl.innerHTML = '';
    data.secundarias.forEach(function(s){
      sEl.innerHTML += '<button class="hoy-card-sec" onclick="'+s.fn+'"><div class="hoy-card-sec-icon" style="background:'+s.bg+'">'+s.ico+'</div><div style="flex:1"><div class="hoy-card-sec-name">'+s.nombre+'</div><div class="hoy-card-sec-hint">'+s.hint+'</div></div><div class="hoy-card-sec-arrow">›</div></button>';
    });
  }
}

function _dciActualizarPanelHoy(data) {
  var tEl = document.getElementById('hoy-titulo');
  var fEl = document.getElementById('hoy-frase');
  if(tEl) tEl.textContent = data.titulo;
  if(fEl) fEl.textContent = data.frase;
}

// Muestra un chip sutil en panel-hoy para que la usuaria pueda actualizar su estado del día
function _dciMostrarChipActualizar() {
  var wrap = document.getElementById('hoy-wrap');
  if(!wrap || document.getElementById('hoy-chip-actualizar')) return;
  var chip = document.createElement('div');
  chip.id = 'hoy-chip-actualizar';
  chip.style.cssText = 'margin-top:clamp(12px,3vw,18px);display:flex;justify-content:center;';
  chip.innerHTML = '<button onclick="dciAbrirOverlay()" class="hoy-chip" style="font-size:11px;opacity:.55;">¿Cómo estás hoy? →</button>';
  wrap.appendChild(chip);
}

// Permite a la usuaria re-abrir el overlay para actualizar su estado
function dciAbrirOverlay() {
  _dciReset();
  var el = document.getElementById('daily-checkin-overlay');
  if(el) { el.style.opacity='0'; el.style.display='block'; setTimeout(function(){ el.style.transition='opacity .3s'; el.style.opacity='1'; },10); }
}

function dciEntrar(fn) {
  showPanel('hoy');
  var el = document.getElementById('daily-checkin-overlay');
  if(el) { el.style.opacity='0'; el.style.transition='opacity .35s'; setTimeout(function(){ el.style.display='none'; _dciReset(); },350); }
  if(fn) setTimeout(function(){ try{ eval(fn); }catch(e){} }, 400);
}

function _dciCerrar() {
  var el = document.getElementById('daily-checkin-overlay');
  if(el) { el.style.opacity='0'; el.style.transition='opacity .35s'; setTimeout(function(){ el.style.display='none'; _dciReset(); },350); }
}

function _dciReset() {
  var p1 = document.getElementById('dci-p1');
  var p2 = document.getElementById('dci-p2');
  if(p1) { p1.style.opacity='1'; p1.style.display='flex'; }
  if(p2) { p2.style.display='none'; p2.style.opacity='0'; }
  var overlay = document.getElementById('daily-checkin-overlay');
  if(overlay) overlay.style.opacity='1';
}

function cerrarSesion() {
  if(confirm('¿Querés cerrar sesión? Esto va a borrar tu perfil y datos guardados en este dispositivo.')) {
    localStorage.clear();
    location.reload();
  }
}


function _dciSorpresa() {
  // Rutinas suaves y concretas para cuando no se sabe cómo se está.
  // Nunca emergencia, nunca menú. Una propuesta concreta y cálida.
  var opciones = [
    { fn: 'openCinco()',        nombre: '5 minutos de respiración',   hint: 'suave · sin esfuerzo' },
    { fn: "abrirBloc()",        nombre: 'Escribir sin filtro',         hint: 'sin estructura · sin presión' },
    { fn: "showPanel('recetario')", nombre: 'Algo rico y simple',      hint: 'sin tener que pensar mucho' },
    { fn: "toggleMusic()",      nombre: 'Un rato de música',           hint: 'lo que te pida el cuerpo' },
    { fn: "showPanel('biblioteca')", nombre: 'Leer algo tranquilo',    hint: 'sin prisa · lo que tengas ganas' },
  ];
  var elegida = opciones[Math.floor(Math.random() * opciones.length)];

  // Mostrar la propuesta como una card, no ejecutar directamente
  var cards2 = document.getElementById('dci2-cards');
  var t2 = document.getElementById('dci2-titulo');
  var f2 = document.getElementById('dci2-frase');
  if(t2) t2.textContent = 'Hoy Kalma elige por vos.';
  if(f2) f2.textContent = 'No tenés que decidir nada. Solo dejate llevar.';
  if(cards2) {
    cards2.innerHTML = '';
    var big = document.createElement('button');
    big.className = 'dci-card-big';
    big.setAttribute('onclick', "dciEntrar('" + elegida.fn.replace(/'/g,"\\'") + "');");
    big.innerHTML = '<div class="dci-card-ico" style="background:rgba(106,155,132,.15)">✨</div>'
      + '<div style="flex:1"><div class="dci-card-name">' + elegida.nombre + '</div>'
      + '<div class="dci-card-hint">' + elegida.hint + '</div></div>'
      + '<div class="dci-card-arrow">›</div>';
    cards2.appendChild(big);

    // Opción secundaria: ver todo sin presión
    var sm = document.createElement('button');
    sm.className = 'dci-card-sm';
    sm.setAttribute('onclick', "dciEntrar(\"showPanel('calma')\");");
    sm.innerHTML = '<div class="dci-card-sm-ico" style="background:rgba(166,123,91,.1)">🌿</div>'
      + '<div style="flex:1"><div class="dci-card-sm-name">Ver todo a mi ritmo</div>'
      + '<div class="dci-card-sm-hint">sin presión · cuando estés lista</div></div>'
      + '<div class="dci-card-sm-arrow">›</div>';
    cards2.appendChild(sm);
  }
}

// ─── FEEDBACK FORMSPREE ───────────────────────────────────────────────────
function submitFeedback() {
  var text = (document.getElementById('feedback-text')||{}).value||'';
  var email = (document.getElementById('feedback-email')||{}).value||'';
  if(!text.trim()) { if(typeof showReward==='function') showReward('💬','Escribí tu mensaje primero.',''); return; }
  var btn = document.querySelector('#feedback-form-wrap button');
  if(btn) { btn.textContent='Enviando…'; btn.disabled=true; }
  fetch('https://formspree.io/f/XXXXXXXX', {
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body: JSON.stringify({message:text, email:email||'sin email', _subject:'KALMA Feedback'})
  }).then(function(r){
    if(r.ok) {
      if(typeof showReward==='function') showReward('💜','¡Gracias!','Tu feedback fue enviado.');
      document.getElementById('feedback-text').value='';
      document.getElementById('feedback-email').value='';
    } else {
      if(typeof showReward==='function') showReward('⚠️','No se pudo enviar.','Intentá de nuevo.');
    }
  }).catch(function(){
    if(typeof showReward==='function') showReward('⚠️','Sin conexión.','Revisá tu internet.');
  }).finally(function(){ if(btn){ btn.textContent='Enviar feedback'; btn.disabled=false; } });
}

// ─── ONBOARDING — DESACTIVADO TEMPORALMENTE (V1 sin fricción) ───
// El código está intacto. Para reactivar: eliminar la línea classList.add('done') de abajo.
var obAnswers = {};
(function(){
  // Siempre oculto — la app abre directo en el check-in
  var ob = document.getElementById('onboarding-overlay');
  if(ob) ob.classList.add('done');
  // Marcar como onboarded para que el resto del flujo funcione
  if(!localStorage.getItem('kalma-onboarded')) {
    localStorage.setItem('kalma-onboarded', '1');
  }
})();
function obUpdateDots(step) {
  document.querySelectorAll('.ob-dot').forEach(function(d,i){
    d.classList.remove('active','done');
    if(i+1 < step) d.classList.add('done');
    else if(i+1 === step) d.classList.add('active');
  });
}
function obNext(step) {
  for(var i=1;i<=4;i++){
    var el = document.getElementById('ob-'+i);
    if(el) el.classList.toggle('active', i===step);
  }
  obUpdateDots(step);
  if(step===4) obBuildWelcome();
}
function obSel(btn, key, val) {
  btn.closest('.ob-opts').querySelectorAll('.ob-opt').forEach(function(b){b.classList.remove('sel');});
  btn.classList.add('sel');
  obAnswers[key] = val;
}
function obToggle(btn, key, val) {
  btn.classList.toggle('sel');
  if(!obAnswers[key]) obAnswers[key] = [];
  var idx = obAnswers[key].indexOf(val);
  if(idx > -1) obAnswers[key].splice(idx,1); else obAnswers[key].push(val);
}
function obBuildWelcome() {
  var name = document.getElementById('ob-name-field').value.trim() || 'hermosa';
  var avs = {'cuidarme':'🌸','organizar':'📋','tiempo':'⚡','espacio':'🏠'};
  var motivos = obAnswers.motivo || [];
  var av = motivos.length ? (avs[motivos[0]] || '🌸') : '🌸';
  document.getElementById('ob-av').textContent = av;
  document.getElementById('ob-welcome-name').textContent = 'Hola, ' + name + ' 💜';
  var msgs = {
    'cuidarme': 'Estás en el lugar indicado. Acá te cuidamos y te acompañamos.',
    'organizar': 'Juntas ordenamos el caos. Tenemos todas las herramientas que necesitás.',
    'tiempo': 'Aunque sean 5 minutos, son tuyos. Y los aprovechamos bien.',
    'espacio': 'Este es tu espacio. Nadie te apura, nadie te juzga. Bienvenida.'
  };
  var msg = motivos.length ? (msgs[motivos[0]] || msgs['espacio']) : 'KALMA es tuya. Todo lo que necesitás, en un solo lugar.';
  document.getElementById('ob-welcome-msg').textContent = msg;
}
function finishOnboarding() {
  var name = document.getElementById('ob-name-field').value.trim();
  var p = JSON.parse(localStorage.getItem('kalma-profile') || '{}');
  if(name) {
    p.name = name;
    p.av = document.getElementById('ob-av') ? document.getElementById('ob-av').textContent : '🌸';
  }
  if(!p.since) p.since = Date.now();
  localStorage.setItem('kalma-profile', JSON.stringify(p));
  localStorage.setItem('kalma-onboarded', '1');
  document.getElementById('onboarding-overlay').classList.add('done');
  // Aplicar nombre en toda la UI inmediatamente
  if(typeof applyProfile === 'function') applyProfile();
  document.querySelectorAll('.profile-name-display, #profile-name').forEach(function(el){
    if(name) el.value ? (el.value = name) : (el.textContent = name);
  });
  if(name) showReward('💜', '¡Bienvenida, ' + name + '!', 'Tu espacio está listo.');
  setTimeout(function(){ showPanel('calma'); }, 300);
}


// ═══ RELOJ Y SALUDO ═══
function actualizarReloj(){
  var ahora=new Date();
  var h=ahora.getHours(),m=ahora.getMinutes().toString().padStart(2,'0'),s=ahora.getSeconds().toString().padStart(2,'0');
  var el=document.getElementById('profile-hora');
  if(el) el.textContent=h+':'+m+':'+s;
  var dias=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  var meses=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var fel=document.getElementById('profile-fecha');
  if(fel) fel.textContent=dias[ahora.getDay()]+', '+ahora.getDate()+' de '+meses[ahora.getMonth()]+' de '+ahora.getFullYear();
  var p=JSON.parse(localStorage.getItem('kalma-profile')||'{}');
  var n=p.name?(', '+p.name):'';
  var sal='';
  if(h>=6&&h<12) sal='Buenos días'+n+' 🌅';
  else if(h>=12&&h<19) sal='Buenas tardes'+n+' ☀️';
  else if(h>=19&&h<23) sal='Buenas noches'+n+' 🌙';
  else sal='Hola'+n+' 🌙';
  var sel=document.getElementById('profile-saludo');
  if(sel) sel.textContent=sal;
}
setInterval(actualizarReloj,1000);
actualizarReloj();

function toggleEstado(){
  var op=document.getElementById('estado-opciones');
  if(op) op.style.display=op.style.display==='none'?'block':'none';
}
function setEstado(estado,emoji){
  var p=JSON.parse(localStorage.getItem('kalma-profile')||'{}');
  p.estado={val:estado,emoji:emoji,fecha:new Date().toDateString()};
  localStorage.setItem('kalma-profile',JSON.stringify(p));
  var op=document.getElementById('estado-opciones');
  var ac=document.getElementById('estado-actual');
  var btn=document.getElementById('estado-toggle-btn');
  if(op) op.style.display='none';
  if(ac){ac.style.display='block';ac.textContent='Hoy te sentís '+emoji+' '+estado;}
  if(btn) btn.textContent=emoji+' '+estado.charAt(0).toUpperCase()+estado.slice(1);
  showNotif(emoji+' ¡Anotado!');
}
setTimeout(function(){
  var p=JSON.parse(localStorage.getItem('kalma-profile')||'{}');
  if(p.estado&&p.estado.fecha===new Date().toDateString()){
    var btn=document.getElementById('estado-toggle-btn');
    var ac=document.getElementById('estado-actual');
    if(btn) btn.textContent=p.estado.emoji+' '+p.estado.val;
    if(ac){ac.style.display='block';ac.textContent='Hoy te sentís '+p.estado.emoji+' '+p.estado.val;}
  }
},600);



// ═══ VOZ ALTA ═══
var _vozActiva=false,_vozUtt=null;
function toggleVozLector(){
  if(_vozActiva){detenerVoz();return;}
  var txt='';
  var tv=document.getElementById('txt-viewer');
  if(tv&&tv.style.display!=='none') txt=tv.innerText||'';
  txt=txt.trim();
  if(!txt||txt.length<10){showNotif('No hay texto para leer en esta página.');return;}
  if(!window.speechSynthesis){showNotif('Tu navegador no soporta voz alta.');return;}
  window.speechSynthesis.cancel();
  _vozUtt=new SpeechSynthesisUtterance(txt);
  _vozUtt.lang='es-AR';_vozUtt.rate=0.9;_vozUtt.pitch=1.05;
  var voces=window.speechSynthesis.getVoices();
  var v=voces.find(function(x){return x.lang.startsWith('es')&&x.name.toLowerCase().includes('female');})||voces.find(function(x){return x.lang.startsWith('es');});
  if(v)_vozUtt.voice=v;
  _vozUtt.onstart=function(){_vozActiva=true;showNotif('🔊 Leyendo en voz alta…');};
  _vozUtt.onend=_vozUtt.onerror=function(){_vozActiva=false;};
  window.speechSynthesis.speak(_vozUtt);
}
function detenerVoz(){
  if(window.speechSynthesis)window.speechSynthesis.cancel();
  _vozActiva=false;
}

// ═══ LECTOR DE LIBROS ═══
function abrirLector(entry) {
  if(!entry) return;
  if(!entry.archivo || !entry.archivo.dataUrl) {
    if(entry.link) { window.open(entry.link,'_blank'); return; }
    showNotif('📎 Subí el archivo EPUB, PDF o TXT para leerlo aquí.');
    return;
  }
  var fname = (entry.archivo.name||'').toLowerCase();
  var dataUrl = entry.archivo.dataUrl;
  var win = window.open('','_blank');
  if(!win) { showNotif('Permitir ventanas emergentes para abrir el lector.'); return; }
  if(fname.endsWith('.pdf')) {
    win.document.write('<html><body style="margin:0;"><iframe src="'+dataUrl+'" style="width:100%;height:100vh;border:none;"></iframe></body></html>');
  } else if(fname.endsWith('.txt')) {
    var b64=dataUrl.split(',')[1], txt='';
    try{ txt=decodeURIComponent(escape(atob(b64))); }catch(e){ txt=atob(b64); }
    win.document.write('<html><head><meta charset="UTF-8"><style>body{font-family:Georgia,serif;max-width:680px;margin:40px auto;padding:20px;font-size:1.1rem;line-height:1.9;color:#2C2018;background:#F9F5EE;}pre{white-space:pre-wrap;font-family:inherit;}</style></head><body><pre>'+txt.replace(/</g,'&lt;')+'</pre></body></html>');
  } else {
    // EPUB y otros
    win.document.write('<html><head><meta charset="UTF-8"><style>body{margin:0;background:#1a1510;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;font-family:sans-serif;color:#C8A878;}</style></head><body><p>Descargando '+entry.archivo.name+'...</p><a href="'+dataUrl+'" download="'+entry.archivo.name+'" style="background:#A67B5B;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">⬇ Descargar para leer</a><p style="font-size:.8rem;opacity:.6;">Los EPUB se abren con tu app de lectura preferida</p></body></html>');
  }
}

// ─── IA KALMA ───
var iaOpen = false;
var iaResponses = {
  'tiempo': [
    'Con 5 minutos podés hacer mucho: una respiración guiada, tildar tus hábitos del día, o escribir una línea en tu micro-diario. Lo pequeño suma.',
    '¿Tenés solo 5 minutos? Abrí el "Modo 5 min para mí" — te guío con la respiración y te dejás una frase para el día. Ya es suficiente.'
  ],
  'receta': [
    'Para algo rápido y nutritivo: bowl de palta y huevo cocido, 10 minutos. O avena con banana y canela, 5 minutos. ¿Querés que abra el recetario?',
    'La sopa de lentejas rojas es lista en 25 minutos y rinde para varios días. Perfecta para preparar el domingo y no pensar en qué comer.'
  ],
  'skincare': [
    'La rutina mínima que funciona: limpieza suave + hidratante con FPS. Solo eso, todos los días, cambia la piel en semanas. Lo demás es extra.',
    'Si empezás de cero: primero identificá tu tipo de piel (seca, mixta, grasa). Después: limpieza mañana y noche, hidratante, FPS de día. Menos es más.'
  ],
  'estres': [
    'Pará. Literalmente. Tres respiraciones profundas ahora mismo. Inhala 4 segundos, sostené 4, exhala 4. Tu sistema nervioso escucha.',
    'Cuando todo es urgente, nada es urgente. ¿Querés que abra el modo 5 minutos para vos? Una pausa cortita puede resetear todo el día.'
  ],
  'motivar': [
    'Ya estás haciendo algo. Entraste acá, estás leyendo esto, estás buscando algo mejor. Eso cuenta. No se necesita un gran cambio — se necesita el siguiente pequeño paso.',
    'Hoy no tiene que ser perfecto. Solo tiene que existir. Lo que hacés todos los días importa más que lo que hacés de vez en cuando.'
  ],
  'ejercicio': [
    'Sin tiempo ni equipo: 10 sentadillas + 10 flexiones de rodilla + 20 segundos de plancha. Tres rondas. Doce minutos. Listo.',
    'La mejor rutina es la que hacés. Empezá con algo tan pequeño que parezca ridículo: 5 minutos de movimiento libre. Lo que sea. Cuenta.'
  ],
  'habito': [
    'El truco de los hábitos: enlazalos a algo que ya hacés. "Después de lavarme los dientes, hago 2 minutos de estiramiento." Sin esfuerzo extra.',
    'Un hábito nuevo tarda entre 18 y 66 días en instalarse. Empezá con uno solo, hacelo mínimo y celebrá cada vez que lo completás.'
  ],
  'dormir': [
    'Lo más efectivo antes de dormir: pantallas apagadas 30 min antes, temperatura fresca en el cuarto, y nada de trabajo en la cama. Tu cerebro necesita asociar la cama con descanso.',
    'Si te cuesta apagar la mente: escribí 3 cosas que hiciste bien hoy. Cambia el modo del cerebro de "alerta" a "cierre del día".'
  ],
  'default': [
    'Eso que me contás es importante. Aunque no tengo toda la información, lo que sí sé es que estás prestando atención a cómo te sentís — y eso ya es mucho.',
    'Buena pregunta. Lo que te puedo decir es que tu bienestar no tiene una sola respuesta correcta. ¿Querés explorar alguna sección específica de KALMA?',
    'Todavía estoy aprendiendo, pero lo que más me importa es acompañarte. ¿Hay algo concreto en lo que pueda ayudarte ahora mismo?'
  ]
};
function toggleIA() {
  iaOpen = !iaOpen;
  document.getElementById('ia-panel').classList.toggle('open', iaOpen);
  if(iaOpen && document.getElementById('ia-msgs').children.length === 0) {
    var name = '';
    try { name = JSON.parse(localStorage.getItem('kalma-profile')||'{}').name || ''; } catch(e){}
    iaAddMsg('bot', 'Hola' + (name ? ', ' + name : '') + ' 💜 Soy KALMA. Podés preguntarme sobre recetas, skincare, ejercicio, hábitos, o simplemente contarme cómo estás.');
  }
}
function iaAddMsg(type, text) {
  var msgs = document.getElementById('ia-msgs');
  var div = document.createElement('div');
  div.className = 'ia-msg ' + type;
  if(type === 'bot') {
    div.innerHTML = '<div class="ia-msg-av">✦</div><div class="ia-bubble">' + text + '</div>';
  } else {
    div.innerHTML = '<div class="ia-bubble">' + text + '</div>';
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
function iaThink(cb) {
  var msgs = document.getElementById('ia-msgs');
  var typing = document.createElement('div');
  typing.className = 'ia-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;
  setTimeout(function(){
    typing.remove();
    cb();
  }, 900 + Math.random()*600);
}
function iaSend() {
  var inp = document.getElementById('ia-input');
  var q = inp.value.trim();
  if(!q) return;
  inp.value = '';
  iaAsk(q);
}
function iaAsk(q) {
  if(!iaOpen) toggleIA();
  iaAddMsg('user', q);
  var ql = q.toLowerCase();
  var key = 'default';
  if(ql.match(/tiempo|r.*pido|ocup|apurada|minuto/)) key='tiempo';
  else if(ql.match(/receta|comer|cocin|aliment|ingrediente/)) key='receta';
  else if(ql.match(/skin|piel|crema|limpi|hidrat|maquilla/)) key='skincare';
  else if(ql.match(/estres|ansiedad|agobiada|presion|nervios|mal/)) key='estres';
  else if(ql.match(/motiv|fuerza|puedo|me animo|arranco/)) key='motivar';
  else if(ql.match(/ejercicio|entrena|fitness|mover|deporte/)) key='ejercicio';
  else if(ql.match(/habito|constancia|rutina|todos los d/)) key='habito';
  else if(ql.match(/dormir|sue.o|descanso|insomnio/)) key='dormir';
  var arr = iaResponses[key];
  var resp = arr[Math.floor(Math.random()*arr.length)];
  iaThink(function(){ iaAddMsg('bot', resp); });
}

// ─── MÚSICA ───
function toggleMusic() {
  var panel = document.getElementById('music-panel');
  var backdrop = document.getElementById('music-backdrop');
  var isOpen = panel.classList.toggle('open');
  if(backdrop) backdrop.classList.toggle('open', isOpen);
}
function switchMusicTab(tab, btn) {
  document.querySelectorAll('.music-tab').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  document.getElementById('music-yt-body').style.display = tab==='yt' ? 'block' : 'none';
  document.getElementById('music-sp-body').style.display = tab==='sp' ? 'block' : 'none';
}
function getYTId(url) {
  var patterns = [
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/watch\?.*v=([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
    /youtube\.com\/v\/([\w-]{11})/
  ];
  for(var i=0;i<patterns.length;i++){
    var m = url.match(patterns[i]);
    if(m) return m[1];
  }
  return null;
}
function getYTList(url) {
  var m = url.match(/[?&]list=([-\w]+)/);
  return m ? m[1] : null;
}
function buildYTEmbed(src, label) {
  var isFile = location.protocol === 'file:';
  var area = document.getElementById('music-embed-area');
  if(isFile) {
    area.innerHTML = '<div style="text-align:center;padding:24px">'
      + '<p style="margin-bottom:12px;opacity:.8">Los iframes de YouTube requieren servidor. Abrí el link directo:</p>'
      + '<a href="'+src+'" target="_blank" rel="noopener" style="display:inline-block;padding:10px 20px;background:var(--accent);color:#fff;border-radius:8px;text-decoration:none;font-weight:600">▶ Abrir en YouTube</a>'
      + '</div>';
  } else {
    var safeSrc = src.replace('youtube.com', 'youtube-nocookie.com');
    area.innerHTML = '<iframe src="'+safeSrc+'" height="200" allow="autoplay; encrypted-media" allowfullscreen style="width:100%;border:none;border-radius:8px"></iframe>';
    showReward('🎵', 'Música activada', 'Que fluya mientras hacés lo tuyo.');
  }
}
function loadMusicYT() {
  var url = document.getElementById('music-yt-url').value.trim();
  if(!url){ showNotif('Pegá un link de YouTube'); return; }
  var vid = getYTId(url);
  var list = getYTList(url);
  var src = '';
  if(list && vid) src = 'https://www.youtube.com/embed/'+vid+'?list='+list+'&autoplay=1&rel=0';
  else if(list) src = 'https://www.youtube.com/embed/videoseries?list='+list+'&autoplay=1&rel=0';
  else if(vid) src = 'https://www.youtube.com/embed/'+vid+'?autoplay=1&rel=0';
  else { showNotif('No reconocí ese link de YouTube. Probá con un link directo al video o playlist.'); return; }
  buildYTEmbed(src, 'YouTube');
}
function loadMusicPreset(type, url) {
  var vid = getYTId(url);
  var list = getYTList(url);
  var src = '';
  if(list && vid) src = 'https://www.youtube.com/embed/'+vid+'?list='+list+'&autoplay=1&rel=0';
  else if(list) src = 'https://www.youtube.com/embed/videoseries?list='+list+'&autoplay=1&rel=0';
  else if(vid) src = 'https://www.youtube.com/embed/'+vid+'?autoplay=1&rel=0';
  if(src) buildYTEmbed(src, type);
  else { window.open(url, '_blank'); }
}
function loadMusicSP() {
  var url = document.getElementById('music-sp-url').value.trim();
  if(!url){ showNotif('Pegá un link de Spotify'); return; }
  var m = url.match(/spotify\.com\/(playlist|album|track|episode)\/([A-Za-z0-9]+)/);
  if(!m){ showNotif('No reconocí ese link de Spotify. Copiá el link desde la app.'); return; }
  var src = 'https://open.spotify.com/embed/'+m[1]+'/'+m[2]+'?utm_source=generator&theme=0';
  document.getElementById('music-embed-area').innerHTML =
    '<iframe src="'+src+'" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style="width:100%;border-radius:8px"></iframe>';
  showReward('🎵', 'Spotify activado', 'Disfrutá tu música favorita.');
}
function embedMusic(src) {
  buildYTEmbed(src, '');
}

// ─── RECORDATORIOS ─── 
// Sistema robusto: Notification API + fallback in-app
// Funciona en Chrome/Edge/Firefox. En iOS Safari solo si la PWA está instalada.
var remTimers = {};

function notifSupported() {
  return ('Notification' in window);
}

function notifGranted() {
  return notifSupported() && Notification.permission === 'granted';
}

function requestNotifPerm(cb) {
  if(!notifSupported()) {
    showNotif('⚠️ Tu navegador no soporta notificaciones push. Usaremos recordatorios en pantalla.');
    if(cb) cb(false);
    return;
  }
  if(notifGranted()) { if(cb) cb(true); return; }
  if(Notification.permission === 'denied') {
    showNotif('🔕 Las notificaciones están bloqueadas. Habilitálas en Ajustes > Notificaciones de tu navegador.');
    if(cb) cb(false);
    return;
  }
  Notification.requestPermission().then(function(p) {
    if(cb) cb(p === 'granted');
  }).catch(function() {
    // Older browsers use callback
    Notification.requestPermission(function(p) {
      if(cb) cb(p === 'granted');
    });
  });
}

function sendNotif(title, body, icon) {
  // Siempre mostrar in-app también (visible aunque la app esté abierta)
  showNotif((icon||'💜') + ' ' + body);
  // Push notification si tiene permiso y HTTPS
  if(notifGranted() && location.protocol !== 'file:') {
    try {
      // Intentar via Service Worker primero (persiste aunque la app esté en background)
      if(navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(function(reg) {
          reg.showNotification(title, {
            body: body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: title,
            renotify: true,
            vibrate: [200, 100, 200]
          });
        }).catch(function() {
          new Notification(title, { body: body });
        });
      } else {
        new Notification(title, { body: body });
      }
    } catch(e) {
      console.log('Notif error:', e);
    }
  }
}

function startReminder(key, ms, title, body) {
  stopReminder(key);
  requestNotifPerm(function(granted) {
    remTimers[key] = setInterval(function(){ sendNotif(title, body); }, ms);
    localStorage.setItem('rem-'+key, JSON.stringify({ms:ms, title:title, body:body}));
    showNotif('⏰ Recordatorio activado: ' + title + (granted ? '' : ' (solo en pantalla)'));
  });
}

function stopReminder(key) {
  if(remTimers[key]) { clearInterval(remTimers[key]); delete remTimers[key]; }
  localStorage.removeItem('rem-'+key);
}

function toggleReminder(key, ms, title, body, btn) {
  btn.classList.toggle('on');
  if(btn.classList.contains('on')) startReminder(key, ms, title, body);
  else { stopReminder(key); showNotif('Recordatorio desactivado'); }
}

// ─── RECOMPENSAS ───
var rewardTimeout;
function showReward(icon, msg, sub) {
  clearTimeout(rewardTimeout);
  document.getElementById('reward-icon').textContent = icon;
  document.getElementById('reward-msg').textContent = msg;
  document.getElementById('reward-sub').textContent = sub || '';
  var toast = document.getElementById('reward-toast');
  toast.classList.add('show');
  rewardTimeout = setTimeout(function(){ toast.classList.remove('show'); }, 3800);
}
// Hook hábitos → recompensa
var _origToggleHabit = typeof toggleHabit !== 'undefined' ? toggleHabit : null;
document.addEventListener('DOMContentLoaded', function(){
  // Recompensa al completar todos los hábitos del día
  var _habOrig = window.toggleHabit;
  window.toggleHabit = function(i) {
    if(_habOrig) _habOrig(i);
    var done = (JSON.parse(localStorage.getItem('kalma-habits-today-'+new Date().toDateString())||'[]')).filter(function(h){return h&&h.done;}).length;
    var total = (JSON.parse(localStorage.getItem('kalma-habits-def')||'[]')).length || 7;
    if(done === total) showReward('🌟', '¡Todos los hábitos de hoy!', 'Eso es consistencia. Sos increíble.');
    else if(done === 1) showReward('🌱', 'Primer hábito del día', 'Un paso es todo lo que se necesita.');
    else if(done === Math.floor(total/2)) showReward('💪', 'Mitad del camino', 'Ya llegaste a la mitad. Seguís vos.');
  };
  // Recompensa al cerrar modo 5 min
  var _closeCincoOrig = window.closeCinco;
  window.closeCinco = function() {
    if(_closeCincoOrig) _closeCincoOrig();
    if(cincoSecs <= 0 || cincoSecs < 60) showReward('🫁', 'Tomaste tu pausa', 'Esos minutos fueron solo tuyos.');
  };
});

// ─── PREMIUM MODAL ───
function openPremiumModal() { document.getElementById('premium-modal-overlay').classList.add('open'); }
function closePremiumModal() { document.getElementById('premium-modal-overlay').classList.remove('open'); }


// ─── MENÚ HAMBURGER ───
function toggleMenu() {
  var links = document.getElementById('nav-links');
  var btn = document.getElementById('hamburger');
  var open = links.classList.toggle('open');
  btn.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
}
document.querySelectorAll('.nav-links a').forEach(function(a){
  a.addEventListener('click', function(){
    document.getElementById('nav-links').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  });
});

// ─── CONFIGURACIÓN / ACCESIBILIDAD ───
var A11Y_KEY = 'kalma-a11y';
var a11yState = JSON.parse(localStorage.getItem(A11Y_KEY) || '{}');
var fontLevel = a11yState.fontLevel || 0; // -1, 0, 1, 2

function applyA11y() {
  var root = document.documentElement;
  root.classList.toggle('high-contrast', !!a11yState.contrast);
  root.classList.toggle('dyslexia-font', !!a11yState.dyslexia);
  root.classList.toggle('wide-line', !!a11yState.lines);
  root.classList.toggle('no-animations', !!a11yState.motion);
  // Font size
  root.classList.remove('big-text','bigger-text');
  if(fontLevel === 1) root.classList.add('big-text');
  if(fontLevel >= 2) root.classList.add('bigger-text');
  var pct = [85,100,110,125][Math.max(0,Math.min(3,fontLevel+1))];
  var el = document.getElementById('font-size-val');
  if(el) el.textContent = pct + '%';
  // Sync toggles
  ['contrast','dyslexia','lines','motion'].forEach(function(k){
    var t = document.getElementById('toggle-'+k);
    if(t) t.classList.toggle('on', !!a11yState[k]);
  });
  localStorage.setItem(A11Y_KEY, JSON.stringify(Object.assign({}, a11yState, {fontLevel: fontLevel})));
}

function toggleA11y(key, btn) {
  a11yState[key] = !a11yState[key];
  btn.classList.toggle('on', !!a11yState[key]);
  btn.setAttribute('aria-pressed', !!a11yState[key]);
  applyA11y();
}

function changeFontSize(dir) {
  fontLevel = Math.max(-1, Math.min(2, fontLevel + dir));
  a11yState.fontLevel = fontLevel;
  applyA11y();
}

function updateNotifStatusBar() {
  var bar = document.getElementById('notif-status-bar');
  if(!bar) return;
  if(!('Notification' in window)) {
    bar.style.cssText='background:rgba(239,68,68,.12);color:rgba(239,68,68,.8);padding:8px 12px;border-radius:10px;font-size:.75rem;margin-bottom:10px;';
    bar.textContent='⚠️ Tu navegador no soporta notificaciones push. Los recordatorios se mostrarán solo en pantalla.';
  } else if(Notification.permission === 'denied') {
    bar.style.cssText='background:rgba(239,68,68,.12);color:rgba(239,68,68,.8);padding:8px 12px;border-radius:10px;font-size:.75rem;margin-bottom:10px;line-height:1.5;';
    bar.innerHTML='🔕 <strong>Notificaciones bloqueadas.</strong><br>Para habilitarlas: tocá el 🔒 o ⓘ en la barra del navegador → Notificaciones → Permitir.';
  } else if(Notification.permission === 'granted') {
    bar.style.cssText='background:rgba(20,184,166,.1);color:rgba(20,184,166,.9);padding:8px 12px;border-radius:10px;font-size:.75rem;margin-bottom:10px;';
    bar.textContent='✓ Notificaciones activadas. Recibirás avisos aunque la app esté en segundo plano.';
  } else {
    bar.style.cssText='background:rgba(200,168,120,.1);color:rgba(200,168,120,.9);padding:8px 12px;border-radius:10px;font-size:.75rem;margin-bottom:10px;';
    bar.textContent='📲 Al activar un recordatorio te pediremos permiso para notificarte.';
  }
}
function toggleSettings() {
  var panel = document.getElementById('settings-panel');
  var fab = document.getElementById('config-fab');
  var isOpen = panel.classList.toggle('open');
  document.body.classList.toggle('panel-open', isOpen);
  fab.classList.add('spinning');
  setTimeout(function(){ fab.classList.remove('spinning'); }, 600);
  if(isOpen) updateNotifStatusBar();
}

function openSettings() {
  document.getElementById('settings-panel').classList.add('open');
}

function confirmDeleteAll() {
  if(confirm('¿Borrar todos tus datos de KALMA? Esta acción no se puede deshacer.')) {
    localStorage.clear();
    showNotif('🗑️ Todos los datos borrados.');
    setTimeout(function(){ location.reload(); }, 1500);
  }
}

// ─── RECORDATORIOS DESDE SETTINGS ───
var remIntervals = {};

function toggleRemSettings(key, btn) {
  btn.classList.toggle('on');
  var on = btn.classList.contains('on');
  btn.setAttribute('aria-pressed', on);
  if(on) {
    requestNotifPerm(function(granted) {
      if(key === 'agua') {
        var ms = parseInt(document.getElementById('rem-agua-interval').value) || 7200000;
        clearInterval(remIntervals['agua']);
        remIntervals['agua'] = setInterval(function(){
          sendNotif('💧 KALMA', 'Tomaste agua hoy? Hidratarte es cuidarte.', '💧');
        }, ms);
        localStorage.setItem('rem-agua', JSON.stringify({ms: ms}));
        showNotif('💧 Recordatorio de agua activado' + (granted ? '' : ' (en pantalla)'));
      }
      if(key === 'breath') {
        var timeVal = document.getElementById('rem-breath-time').value || '12:00';
        scheduleBreathReminder(timeVal);
        localStorage.setItem('rem-breath', JSON.stringify({time: timeVal}));
        showNotif('🫁 Recordatorio de respiración activado para las ' + timeVal + (granted ? '' : ' (en pantalla)'));
      }
    });
  } else {
    clearInterval(remIntervals[key]);
    clearTimeout(remIntervals[key+'_timeout']);
    delete remIntervals[key];
    localStorage.removeItem('rem-'+key);
    showNotif('Recordatorio desactivado');
    btn.setAttribute('aria-pressed', 'false');
  }
}

function scheduleBreathReminder(timeStr) {
  clearTimeout(remIntervals['breath_timeout']);
  var parts = (timeStr||'12:00').split(':');
  var now = new Date();
  var target = new Date();
  target.setHours(parseInt(parts[0])||12, parseInt(parts[1])||0, 0, 0);
  if(target <= now) target.setDate(target.getDate() + 1);
  var ms = target - now;
  remIntervals['breath_timeout'] = setTimeout(function(){
    sendNotif('🫁 KALMA', 'Tu momento de respirar. Abrí KALMA y tomá tu pausa.', '🫁');
    scheduleBreathReminder(timeStr); // reprogramar para mañana
  }, ms);
}

// ─── RESTAURAR RECORDATORIOS AL CARGAR ───
// Los intervalos/timeouts se pierden al cerrar la app.
// Los restauramos leyendo qué había guardado en localStorage.
function restoreReminders() {
  // Agua
  var aguaData = localStorage.getItem('rem-agua');
  if(aguaData) {
    try {
      var d = JSON.parse(aguaData);
      var ms = d.ms || 7200000;
      clearInterval(remIntervals['agua']);
      remIntervals['agua'] = setInterval(function(){
        sendNotif('💧 KALMA', 'Tomaste agua hoy? Hidratarte es cuidarte.', '💧');
      }, ms);
      // Marcar el toggle como activo
      var btnA = document.getElementById('toggle-agua');
      if(btnA) { btnA.classList.add('on'); btnA.setAttribute('aria-pressed','true'); }
    } catch(e) {}
  }
  // Respiración
  var breathData = localStorage.getItem('rem-breath');
  if(breathData) {
    try {
      var d2 = JSON.parse(breathData);
      scheduleBreathReminder(d2.time || '12:00');
      var btnB = document.getElementById('toggle-breath');
      if(btnB) { btnB.classList.add('on'); btnB.setAttribute('aria-pressed','true'); }
      // Actualizar el input de hora
      var inp = document.getElementById('rem-breath-time');
      if(inp && d2.time) inp.value = d2.time;
    } catch(e) {}
  }
}

// Restore a11y + recordatorios al cargar
(function(){
  applyA11y();
  ['contrast','dyslexia','lines','motion'].forEach(function(k){
    var t = document.getElementById('toggle-'+k);
    if(t && a11yState[k]) { t.classList.add('on'); t.setAttribute('aria-pressed','true'); }
  });
  // Restaurar recordatorios después de que el DOM esté listo
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreReminders);
  } else {
    restoreReminders();
  }
})();


// ── PANEL NAVIGATION ──────────────────────────────────────────────────────
function showPanel(name, fromPopstate) {
  // Si va a sección real, mostrar bottom-nav
  var secReal = ['hoy','inicio','categorias','tienda','comunidad','recetario','rutinas','salud','biblioteca'];
  if(secReal.indexOf(name) > -1){ document.body.classList.add('bnav-visible'); }
  // hide all panels
  document.querySelectorAll('.page-panel').forEach(function(p){
    p.classList.remove('active');
  });
  // show target
  var target = document.getElementById('panel-'+name);
  if(target) {
    target.classList.add('active');
    window.scrollTo(0,0);
    // Activar fade-up elements que estaban ocultos en el panel
    setTimeout(function(){
      target.querySelectorAll('.fade-up').forEach(function(el){
        el.classList.add('visible');
      });
    }, 60);
  }
  // keep inicio-footer visible with inicio
  if(name==='inicio') {
    var footer = document.getElementById('panel-inicio-footer');
    if(footer) footer.classList.add('active');
  }
  // update nav active states
  document.querySelectorAll('.nav-panel-link').forEach(function(a){
    a.classList.toggle('active', a.dataset.panel===name);
  });
  document.querySelectorAll('.dot-nav a').forEach(function(a){
    a.classList.toggle('active', a.dataset.panel===name);
  });
  document.querySelectorAll('.bnav-item[data-panel]').forEach(function(b){
    b.classList.toggle('active', b.dataset.panel===name);
  });
  // Historial para que "atrás" navegue entre paneles en vez de salir de la app
  if(!fromPopstate) {
    history.pushState({ panel: name }, '', '');
  }
}

// Escuchar el botón "atrás" del navegador/celular
window.addEventListener('popstate', function(e) {
  // Cerrar overlays con historial propio
  if(e.state && e.state.overlay) {
    var ov = e.state.overlay;
    if(ov === 'checkin-p1') {
      var el = document.getElementById('daily-checkin-overlay');
      if(el) { el.style.transition='opacity .25s'; el.style.opacity='0'; setTimeout(function(){ el.style.display='none'; el.style.opacity=''; el.style.transition=''; },250); }
      return;
    }
    if(ov === 'music') { var mp=document.getElementById('music-panel'); if(mp) mp.classList.remove('open'); return; }
    if(ov === 'toolbox') { var tp=document.getElementById('toolbox-panel'); if(tp) tp.classList.remove('open'); return; }
    if(ov === 'cinco') { if(typeof closeCinco==='function') closeCinco(); return; }
    if(ov === 'sos') { if(typeof closeEmergency==='function') closeEmergency(); return; }
    if(ov === 'ia') { iaOpen=false; var iap=document.getElementById('ia-panel'); if(iap) iap.classList.remove('open'); return; }
  }

  var panel = (e.state && e.state.panel) ? e.state.panel : (localStorage.getItem('kalma-onboarded') ? 'hoy' : 'calma');

  // Si atrás viene desde p2 del check-in → volver a p1
  if(panel === 'dci-p2') {
    var p1 = document.getElementById('dci-p1');
    var p2 = document.getElementById('dci-p2');
    if(p2) { p2.style.transition='opacity .25s'; p2.style.opacity='0'; setTimeout(function(){ p2.style.display='none'; },250); }
    if(p1) { p1.style.display='flex'; p1.style.opacity='0'; p1.style.transition='opacity .3s'; setTimeout(function(){ p1.style.opacity='1'; },20); }
    return;
  }

  showPanel(panel, true);
});

// Empujar estado inicial al historial para que la primera vez que se toca "atrás
// no salga de la app sino que quede en el panel de inicio
// Estado inicial del historial — siempre hoy (onboarding desactivado en V1)
(function(){
  history.replaceState({ panel: 'hoy' }, '', '');
})();

// ── SCROLL PROGRESS ────────────────────────────────────────────────────────
(function(){
  var bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', function(){
    var scrolled = window.scrollY;
    var total = document.body.scrollHeight - window.innerHeight;
    if(bar) bar.style.width = (total>0 ? (scrolled/total*100) : 0)+'%';
  }, {passive:true});
})();
// ── GALERÍA DE MEMORIAS ──────────────────────────────────────────────────
var GALERIA_KEY = 'kalma-galeria';
function galeriaLoad() {
  var grid = document.getElementById('galeria-grid');
  if(!grid) return;
  var photos = JSON.parse(localStorage.getItem('kalma-galeria') || '[]');
  if(!photos.length) {
    grid.innerHTML = '<div style="color:var(--text2);font-size:.82rem;padding:16px 0;text-align:center;">Tu galería está vacía. Agregá tu primera foto 📸</div>';
    return;
  }
  grid.innerHTML = photos.map(function(p, i) {
    return '<div class="galeria-item" style="position:relative;">'
      + '<img src="'+p.src+'" style="width:100%;border-radius:8px;display:block;" alt="'+(p.cap||'')+'">'
      + (p.cap ? '<div style="font-size:.72rem;color:var(--text2);padding:4px 2px;">'+p.cap+'</div>' : '')
      + '<button onclick="galeriaDelete('+i+')" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,.5);color:#fff;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;font-size:12px;">✕</button>'
      + '</div>';
  }).join('');
}
function galeriaDelete(idx) {
  var photos = JSON.parse(localStorage.getItem('kalma-galeria') || '[]');
  photos.splice(idx, 1);
  localStorage.setItem('kalma-galeria', JSON.stringify(photos));
  galeriaLoad();
}
function galeriaAddPhoto(input) {
  var file = input.files[0]; if(!file) return;
  var caption = (document.getElementById('galeria-caption').value||'').trim();
  var reader = new FileReader();
  reader.onerror = function(){ showNotif('No se pudo leer la imagen.'); };
  reader.onload = function(e) {
    var img = new Image();
    img.onerror = function(){ showNotif('Formato no compatible.'); };
    img.onload = function() {
      try {
        var canvas = document.createElement('canvas');
        var max=480, ratio=Math.min(max/img.width,max/img.height,1);
        canvas.width=Math.round(img.width*ratio);
        canvas.height=Math.round(img.height*ratio);
        canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
        var compressed = canvas.toDataURL('image/jpeg',0.7);
        var items=JSON.parse(localStorage.getItem(GALERIA_KEY)||'[]');
        items.unshift({src:compressed,caption:caption,
          date:new Date().toLocaleDateString('es-AR',{day:'2-digit',month:'short',year:'numeric'})});
        if(items.length>30) items=items.slice(0,30);
        localStorage.setItem(GALERIA_KEY,JSON.stringify(items));
        galeriaLoad();
        var capEl=document.getElementById('galeria-caption');
        if(capEl) capEl.value='';
        input.value='';
        showNotif('Foto guardada en tu galeria.');
      } catch(err){ showNotif('Error al guardar: '+err.message); }
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}
function galeriaDel(i) {
  var items=JSON.parse(localStorage.getItem(GALERIA_KEY)||'[]');
  items.splice(i,1);
  localStorage.setItem(GALERIA_KEY,JSON.stringify(items));
  galeriaLoad();
}
// ── HERO DINÁMICO ────────────────────────────────────────────────────────
function initHeroGreeting() {
  var greet = document.getElementById('hero-greeting');
  var sub = document.getElementById('hero-habit-sub');
  if(!greet) return;
  var name = '';
  try { name = (JSON.parse(localStorage.getItem('ellea-profile')||'{}')).name || ''; } catch(e){}
  var hour = new Date().getHours();
  var saludo = hour < 12 ? 'Buenos dias' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  greet.textContent = name ? saludo + ', ' + name.split(' ')[0] : 'KALMA';
  if(sub) {
    var hoy = new Date().toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'});
    sub.textContent = hoy.charAt(0).toUpperCase() + hoy.slice(1);
  }
}
// DOMContentLoaded ya disparó (script al final del body), llamar directo
initHeroGreeting();
function handleProfilePhoto(input) {
  var file = input.files[0];
  if(!file) return;
  var reader = new FileReader();
  reader.onerror = function(){ showNotif('No se pudo leer la foto. Probá con otra imagen.'); };
  reader.onload = function(e) {
    var srcData = e.target.result;
    var img = new Image();
    img.onerror = function(){ showNotif('Formato de imagen no compatible.'); };
    img.onload = function() {
      try {
        var canvas = document.createElement('canvas');
        var size = 240;
        canvas.width = size; canvas.height = size;
        var ctx = canvas.getContext('2d');
        var s = Math.min(img.width, img.height);
        var ox = (img.width - s)/2, oy = (img.height - s)/2;
        ctx.drawImage(img, ox, oy, s, s, 0, 0, size, size);
        var compressed = canvas.toDataURL('image/jpeg', 0.75);
        try {
          localStorage.setItem('kalma-profile-photo', compressed);
        } catch(qe) {
          // quota exceeded - try smaller
          canvas.width = 120; canvas.height = 120;
          ctx.drawImage(img, ox, oy, s, s, 0, 0, 120, 120);
          compressed = canvas.toDataURL('image/jpeg', 0.6);
          localStorage.setItem('kalma-profile-photo', compressed);
        }
        applyProfilePhoto(compressed);
        showNotif('📸 Foto guardada.');
      } catch(err) {
        showNotif('Error al guardar la foto: ' + err.message);
      }
    };
    img.src = srcData;
  };
  reader.readAsDataURL(file);
}
function applyProfilePhoto(src) {
  var navAv = document.getElementById('nav-av');
  var avBig = document.getElementById('profile-av-big');
  if(src) {
    if(navAv) navAv.innerHTML = '<img src="'+src+'" style="width:26px;height:26px;border-radius:50%;object-fit:cover;"/>';
    if(avBig) { avBig.innerHTML = '<img src="'+src+'" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;"/>'; avBig.style.fontSize='0'; }
  } else {
    if(navAv) navAv.textContent = '🌸';
    if(avBig) { avBig.innerHTML = '🌸'; avBig.style.fontSize=''; }
  }
}

// Restore photo LAST so it doesn't get overwritten by applyProfile
(function(){
  var photo = localStorage.getItem('kalma-profile-photo');
  if(photo) setTimeout(function(){ applyProfilePhoto(photo); }, 50);
})();

// ── SPEED-DIAL ────────────────────────────────────────────────────────
var _dialOpen = false;
// Cerrar cualquier panel al tocar fuera
document.addEventListener('click', function(e) {
  // Cerrar settings si click fuera
  var sp = document.getElementById('settings-panel');
  if(sp && sp.classList.contains('open') && !sp.contains(e.target) && !e.target.closest('.sd-item')) {
    sp.classList.remove('open');
  }
  // Cerrar toolbox si click fuera
  var tb = document.getElementById('toolbox-panel');
  if(tb && tb.classList.contains('open') && !tb.contains(e.target) && !e.target.closest('.sd-item')) {
    tb.classList.remove('open');
  }
  // Cerrar música si click fuera
  var mp = document.getElementById('music-panel');
  if(mp && mp.classList.contains('open') && !mp.contains(e.target) && !e.target.closest('.sd-item')) {
    mp.classList.remove('open');
  }
  // Cerrar IA si click fuera
  var ia = document.getElementById('ia-panel');
  if(ia && ia.classList.contains('open') && !ia.contains(e.target) && !e.target.closest('.sd-item')) {
    ia.classList.remove('open');
    iaOpen = false;
  }
}, true);

function toggleDial() {
  _dialOpen = !_dialOpen;
  var items = document.getElementById('sd-items');
  var trigger = document.getElementById('sd-trigger');
  var backdrop = document.getElementById('sd-backdrop');
  if(items) items.classList.toggle('open', _dialOpen);
  if(trigger) trigger.classList.toggle('open', _dialOpen);
  if(trigger) trigger.setAttribute('aria-expanded', String(_dialOpen));
  if(backdrop) backdrop.classList.toggle('open', _dialOpen);
}
function closeDial() {
  _dialOpen = false;
  ['sd-items','sd-trigger','sd-backdrop'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.classList.remove('open');
  });
  var t = document.getElementById('sd-trigger');
  if(t) t.setAttribute('aria-expanded','false');
}
// ── SEÑALADORES ──────────────────────────────────────────────────────
// ── SEÑALADOR — ESTILOS Y PERSONALIZACIÓN ─────────────────────────────
var BM_STYLE_KEY = 'kalma-bm-style';
var BM_EMOJI_KEY = 'kalma-bm-emoji';
var BM_WORD_KEY  = 'kalma-bm-word';
var BM_FOTO_KEY  = 'kalma-bm-foto';

function setBMStyle(style) {
  localStorage.setItem(BM_STYLE_KEY, style);
  // Marcar opción activa en UI
  document.querySelectorAll('.bm-opt').forEach(function(el){ el.classList.remove('selected'); });
  var map = {claro:'bm-opt-1', oscuro:'bm-opt-2', personal:'bm-opt-3', foto:'bm-opt-4'};
  var sel = document.getElementById(map[style]);
  if(sel) sel.classList.add('selected');
  // NO usar fi.click() — iOS Safari bloquea .click() programático
  // El label for="bm-foto-input" abre el selector directamente al tocar
  applyBMStyleAll();
}

function updateBMEmoji(val) {
  if(!val) return;
  localStorage.setItem(BM_EMOJI_KEY, val);
  var prev = document.getElementById('bm-preview-emoji');
  if(prev) prev.textContent = val;
  applyBMStyleAll();
}

function updateBMWord(val) {
  localStorage.setItem(BM_WORD_KEY, val || '');
  var prevTxt = document.getElementById('bm-word-preview-text');
  if(prevTxt) prevTxt.textContent = val || '';
  applyBMStyleAll();
}

function handleBMFoto(input) {
  var file = input.files[0];
  if(!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    // Comprimir a max 80x80
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      var maxSide = 80;
      var scale = Math.min(maxSide/img.width, maxSide/img.height);
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      var dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      localStorage.setItem(BM_FOTO_KEY, dataUrl);
      applyBMFotoPreview(dataUrl);
      setBMStyle('foto');
      showNotif('Foto guardada en tu señalador 📎');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function applyBMFotoPreview(dataUrl) {
  var prev = document.getElementById('bm-foto-preview');
  if(!prev) return;
  prev.style.backgroundImage = 'url('+dataUrl+')';
  prev.style.backgroundSize = 'cover';
  prev.style.backgroundPosition = 'center';
  prev.textContent = '';
}

function applyBMStyleAll() {
  var style  = localStorage.getItem(BM_STYLE_KEY) || 'claro';
  var emoji  = localStorage.getItem(BM_EMOJI_KEY) || '🌸';
  var word   = localStorage.getItem(BM_WORD_KEY)  || '';
  var foto   = localStorage.getItem(BM_FOTO_KEY)  || '';

  // Actualizar todos los señaladores personales
  document.querySelectorAll('.senalador-personal').forEach(function(btn) {
    var cont = btn.querySelector('.bm-custom-content');
    if(!cont) {
      cont = document.createElement('div');
      cont.className = 'bm-custom-content';
      btn.appendChild(cont);
    }
    if(style === 'foto' && foto) {
      cont.innerHTML = '<img src="'+foto+'" style="width:18px;height:32px;object-fit:cover;border-radius:2px 2px 8px 8px;display:block;" alt="foto"/>';
    } else if(style === 'personal' && word) {
      cont.innerHTML = '<span style="font-size:4px;font-weight:700;letter-spacing:0;line-height:1;color:#fff;word-break:break-all;text-align:center;display:block;padding:2px 1px;">'+word.toUpperCase()+'</span>';
    } else if(style === 'personal') {
      cont.innerHTML = '<span style="font-size:9px;">'+emoji+'</span>';
    } else {
      cont.innerHTML = '';
    }
  });

  // Aplicar clase de estilo base
  document.querySelectorAll('.senalador').forEach(function(btn) {
    btn.classList.remove('senalador-claro','senalador-oscuro','senalador-personal');
    if(style === 'oscuro') {
      btn.classList.add('senalador-oscuro');
    } else if(style === 'personal' || style === 'foto') {
      btn.classList.add('senalador-personal');
    } else {
      btn.classList.add('senalador-claro');
    }
  });

  // Actualizar señalador EPUB (tiene SVG propio, no usa clase senalador-personal)
  var epubSena = document.getElementById('epub-page-senalador');
  if(epubSena) {
    var epubSvg = epubSena.querySelector('svg');
    if(!epubSvg) return;
    // Quitar img anterior si existe
    var oldImg = epubSena.querySelector('img.epub-sena-foto');
    if(oldImg) oldImg.remove();

    if(style === 'foto' && foto) {
      // Mostrar foto encima del SVG
      var img = document.createElement('img');
      img.className = 'epub-sena-foto';
      img.src = foto;
      img.style.cssText = 'position:absolute;top:2px;left:50%;transform:translateX(-50%);width:20px;height:32px;object-fit:cover;border-radius:2px 2px 8px 8px;z-index:2;';
      epubSena.style.position = 'relative';
      epubSena.appendChild(img);
    } else if(style === 'personal' && word) {
      var t = epubSvg.querySelector('text.epub-label');
      if(!t) { t = document.createElementNS('http://www.w3.org/2000/svg','text'); t.className.baseVal='epub-label'; epubSvg.appendChild(t); }
      t.setAttribute('x','14');t.setAttribute('y','18');t.setAttribute('text-anchor','middle');
      t.setAttribute('font-size','5');t.setAttribute('fill','white');t.setAttribute('font-weight','700');
      t.textContent = word.toUpperCase().slice(0,6);
    }
  }
}

function initBMStyle() {
  var style  = localStorage.getItem(BM_STYLE_KEY) || 'claro';
  var emoji  = localStorage.getItem(BM_EMOJI_KEY) || '🌸';
  var word   = localStorage.getItem(BM_WORD_KEY)  || '';
  var foto   = localStorage.getItem(BM_FOTO_KEY)  || '';

  // Restaurar UI
  var emojiInput = document.getElementById('bm-emoji-input');
  if(emojiInput) emojiInput.value = emoji;
  var prevEmoji = document.getElementById('bm-preview-emoji');
  if(prevEmoji) prevEmoji.textContent = emoji;
  var wordInput = document.getElementById('bm-word-input');
  if(wordInput) wordInput.value = word;
  var prevTxt = document.getElementById('bm-word-preview-text');
  if(prevTxt) prevTxt.textContent = word;
  if(foto) applyBMFotoPreview(foto);

  // Marcar opción seleccionada
  document.querySelectorAll('.bm-opt').forEach(function(el){ el.classList.remove('selected'); });
  var map = {claro:'bm-opt-1', oscuro:'bm-opt-2', personal:'bm-opt-3', foto:'bm-opt-4'};
  var sel = document.getElementById(map[style]);
  if(sel) sel.classList.add('selected');

  // Adjuntar listener al input foto — más confiable que onchange inline en iOS Safari
  var fotoInput = document.getElementById('bm-foto-input');
  if(fotoInput && !fotoInput._listenerAdded) {
    fotoInput.addEventListener('change', function() { handleBMFoto(this); });
    fotoInput._listenerAdded = true;
  }

  applyBMStyleAll();
}
setTimeout(initBMStyle, 100);

var BM_KEY = 'kalma-bm';

function toggleBM(id, btn) {
  var bms = JSON.parse(localStorage.getItem(BM_KEY)||'{}');
  var wasActive = !!bms[id];
  if(wasActive) { delete bms[id]; }
  else { bms[id] = Date.now(); }
  localStorage.setItem(BM_KEY, JSON.stringify(bms));
  if(btn) {
    btn.classList.toggle('active', !wasActive);
    waveBM(btn);
  }
}

function waveBM(el) {
  if(!el) return;
  el.classList.remove('waving');
  void el.offsetWidth; // force reflow
  el.classList.add('waving');
  el.addEventListener('animationend', function(){
    el.classList.remove('waving');
  }, {once:true});
}

function waveAllBookmarks() {
  var bms = JSON.parse(localStorage.getItem(BM_KEY)||'{}');
  // Wave all active bookmarks on visible panels after a short delay
  setTimeout(function(){
    document.querySelectorAll('.senalador.active').forEach(function(el, i){
      setTimeout(function(){ waveBM(el); }, i * 80);
    });
  }, 200);
}

// Init cinco bookmark state
(function(){
  var bms = JSON.parse(localStorage.getItem(BM_KEY)||'{}');
  var bmCinco = document.getElementById('bm-cinco');
  if(bmCinco && bms['cinco-fav']) bmCinco.classList.add('active');
})();


// ── SALUD ─────────────────────────────────────────────────────────────
var SALUD_KEY = 'kalma-salud';
var _saludMode = 'ciclo';
function setSaludMode(mode, btn) {
  _saludMode = mode;
  document.querySelectorAll('.salud-mode-btn').forEach(function(b){ b.classList.remove('active'); });
  if(btn) btn.classList.add('active');
}
function toggleSintoma(btn) { btn.classList.toggle('active'); }
function saveSaludEntry() {
  var fecha = (document.getElementById('salud-fecha')||{}).value || new Date().toISOString().slice(0,10);
  var nota = ((document.getElementById('salud-nota')||{}).value||'').trim();
  var sintomas = [];
  document.querySelectorAll('.sintoma-btn.active').forEach(function(b){ sintomas.push(b.textContent.trim()); });
  var entry = {fecha:fecha,modo:_saludMode,sintomas:sintomas,nota:nota,ts:Date.now()};
  var data = JSON.parse(localStorage.getItem(SALUD_KEY)||'[]');
  data.unshift(entry);
  if(data.length>90) data=data.slice(0,90);
  localStorage.setItem(SALUD_KEY,JSON.stringify(data));
  renderSaludHistorial();
  var notaEl = document.getElementById('salud-nota');
  if(notaEl) notaEl.value='';
  document.querySelectorAll('.sintoma-btn.active').forEach(function(b){ b.classList.remove('active'); });
  showNotif('Registro guardado.');
}
function renderSaludHistorial() {
  var data = JSON.parse(localStorage.getItem(SALUD_KEY)||'[]');
  var el = document.getElementById('salud-historial');
  if(!el) return;
  if(!data.length){ el.innerHTML='<div style="color:var(--text2);font-size:.82rem;padding:8px 0;">Sin registros aún.</div>'; return; }
  el.innerHTML = data.slice(0,10).map(function(e){
    return '<div class="salud-entry"><strong>'+e.fecha+'</strong>'+(e.sintomas&&e.sintomas.length?' · '+e.sintomas.join(', '):'')+(e.nota?'<br><em style="font-size:.75rem;">'+e.nota+'</em>':'')+'</div>';
  }).join('');
}

// ── BIBLIOTECA ────────────────────────────────────────────────────────
var BIB_KEY = 'kalma-biblioteca';
var _bibFilter = 'todas';
var CAT_LABELS = {leyendo:'📖 Leyendo',quiero:'🔖 Quiero leer',leido:'✅ Leída',favorito:'⭐ Favorito'};
// archivo seleccionado para biblioteca
var _bibFileData = null;
function bibHandleFile(input) {
  var file = input.files[0];
  if(!file) return;
  var nameEl = document.getElementById('bib-file-name');
  var tituloEl = document.getElementById('bib-titulo');
  if(!tituloEl.value.trim()) {
    tituloEl.value = file.name.replace(/\.(epub|pdf|txt|mobi)$/i,'').replace(/_/g,' ');
  }
  // Leer como dataUrl para poder abrirlo después
  var r = new FileReader();
  r.onload = function(e) {
    _bibFileData = { name: file.name, size: file.size, type: file.type, dataUrl: e.target.result };
    if(nameEl) nameEl.textContent = '✓ ' + file.name + ' (' + (file.size/1024/1024).toFixed(1) + ' MB)';
  };
  r.readAsDataURL(file);
}

function addBibEntry() {
  var titulo = ((document.getElementById('bib-titulo')||{}).value||'').trim();
  if(!titulo){ showNotif('Ingresá el título.'); return; }
  var entry = {
    id:Date.now(),
    titulo:titulo,
    autor:((document.getElementById('bib-autor')||{}).value||'').trim(),
    link:((document.getElementById('bib-link')||{}).value||'').trim(),
    cat:(document.getElementById('bib-cat')||{value:'quiero'}).value,
    nota:((document.getElementById('bib-nota')||{}).value||'').trim(),
    archivo: _bibFileData || null
  };
  _bibFileData = null;
  var fnEl = document.getElementById('bib-file-name');
  if(fnEl) fnEl.textContent = '';
  var fi = document.getElementById('bib-file-input');
  if(fi) fi.value = '';
  var data = JSON.parse(localStorage.getItem(BIB_KEY)||'[]');
  data.unshift(entry);
  localStorage.setItem(BIB_KEY,JSON.stringify(data));
  renderBib();
  ['bib-titulo','bib-autor','bib-link','bib-nota'].forEach(function(id){
    var el=document.getElementById(id); if(el) el.value='';
  });
  showNotif('Libro agregado.');
}
function filterBib(cat, btn) {
  _bibFilter = cat;
  document.querySelectorAll('.bib-filtro').forEach(function(b){ b.classList.remove('active'); });
  if(btn) btn.classList.add('active');
  renderBib();
}
function deleteBib(id) {
  var data = JSON.parse(localStorage.getItem(BIB_KEY)||'[]');
  data = data.filter(function(e){ return e.id!==id; });
  localStorage.setItem(BIB_KEY,JSON.stringify(data));
  renderBib();
}
function renderBib() {
  var data = JSON.parse(localStorage.getItem(BIB_KEY)||'[]');
  if(_bibFilter!=='todas') data=data.filter(function(e){ return e.cat===_bibFilter; });
  var el = document.getElementById('bib-grid');
  if(!el) return;
  if(!data.length){
    el.innerHTML='<div style="color:var(--text2);font-size:.85rem;padding:20px 0;">Tu biblioteca está vacía. Agregá tu primer libro.</div>';
    return;
  }
  var bms = JSON.parse(localStorage.getItem('kalma-bm')||'{}');
  el.innerHTML = data.map(function(e){
    var bmActive = bms['bib-'+e.id] ? 'active' : '';
    // Botón abrir archivo
    var abrirBtn = '';
    var leerBtn = '';
    if(e.archivo && e.archivo.dataUrl) {
      var isTxt = /\.(txt)$/i.test(e.archivo.name);
      var isReadable = /\.(txt|pdf|epub)$/i.test(e.archivo.name);
      abrirBtn = '<a class="bib-card-link" href="'+e.archivo.dataUrl+'" target="_blank" download="'+e.archivo.name+'" style="display:inline-flex;align-items:center;gap:4px;margin-top:4px;">📎 Descargar '+e.archivo.name+'</a>';
      if(isReadable) leerBtn = '<button class="bib-card-link" onclick="openBibReader(\''+e.id+'\')" style="display:inline-flex;align-items:center;gap:4px;margin-top:6px;background:none;border:none;cursor:pointer;color:var(--accent);font-size:.75rem;padding:0;">📖 Leer en KALMA</button>';
    } else if(e.link) {
      abrirBtn = '<a class="bib-card-link" href="'+e.link+'" target="_blank" rel="noopener">🔗 Abrir enlace →</a>';
    } else if(e.archivo) {
      abrirBtn = '<div class="bib-card-file" style="color:var(--text2);">📎 '+e.archivo.name+' <span style="font-size:.68rem;opacity:.6;">(volvé a subir para abrir)</span></div>';
    }
    return '<div class="bib-card" style="padding-top:44px;">'
      // Señalador — esquina superior IZQUIERDA
      +'<button class="senalador '+bmActive+'" style="position:absolute;top:4px;left:8px;right:auto;z-index:2;background:none;border:none;padding:0;width:28px;height:48px;" onclick="toggleBM(\'bib-'+e.id+'\',this)" title="Señalar" aria-label="Marcar libro">'
      +'<svg viewBox="0 0 20 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path class="bm-fill" d="M2 0h16a2 2 0 0 1 2 2v32l-10-8L0 34V2a2 2 0 0 1 2-2z" stroke-linejoin="round"/><text x="10" y="18" text-anchor="middle" font-size="8" fill="white" font-family="serif" font-weight="bold" opacity=".9">K</text></svg>'
      +'</button>'
      // X eliminar — esquina superior DERECHA
      +'<button class="bib-card-del" onclick="deleteBib('+e.id+')" title="Eliminar">✕</button>'
      +'<div class="bib-cat-badge">'+(CAT_LABELS[e.cat]||e.cat)+'</div>'
      +'<div class="bib-card-title">'+e.titulo+'</div>'
      +(e.autor?'<div class="bib-card-autor">'+e.autor+'</div>':'')
      +(e.nota?'<div class="bib-card-nota">"'+e.nota+'"</div>':'')
      +abrirBtn
      +(leerBtn||'')
      +'</div>';
  }).join('');
}

// Panel-specific renders on showPanel
var _sp2 = showPanel;
showPanel = function(name) {
  _sp2(name);
  if(name==='salud') renderSaludHistorial();
  if(name==='biblioteca') { renderBib(); }
};

/* =============================================
   LECTOR DE TEXTO + LECTURA EN VOZ ALTA (TTS)
   ============================================= */
var _ttsUtterance = null;
var _ttsChunks = [];
var _ttsChunkIdx = 0;
var _ttsPaused = false;
var _ttsActive = false;

function openBibReader(entryId) {
  var data = JSON.parse(localStorage.getItem(BIB_KEY)||'[]');
  var entry = data.find(function(e){ return String(e.id) === String(entryId); });
  if(!entry || !entry.archivo || !entry.archivo.dataUrl) return;

  var overlay = document.getElementById('bib-reader-overlay');
  var titleEl = document.getElementById('bib-reader-title');
  // ocultar todo
  document.getElementById('bib-reader-body').style.display = 'none';
  document.getElementById('bib-pdf-frame').style.display = 'none';
  document.getElementById('bib-epub-viewer').style.display = 'none';
  document.getElementById('bib-tts-bar').style.display = 'none';
  document.getElementById('bib-epub-bar').style.display = 'none';

  titleEl.textContent = entry.titulo + (entry.autor ? ' — ' + entry.autor : '');
  var fname = (entry.archivo.name||'').toLowerCase();

  if(/\.pdf$/.test(fname)) {
    // PDF: usar ObjectURL (dataUrl en iframe está bloqueado por browsers modernos)
    var frame = document.getElementById('bib-pdf-frame');
    try {
      var b64pdf = entry.archivo.dataUrl.split(',')[1];
      var binPdf = atob(b64pdf);
      var bytesPdf = new Uint8Array(binPdf.length);
      for(var i=0; i<binPdf.length; i++) bytesPdf[i] = binPdf.charCodeAt(i);
      var blobPdf = new Blob([bytesPdf], {type:'application/pdf'});
      var objUrl = URL.createObjectURL(blobPdf);
      frame.src = objUrl;
      // liberar cuando se cierre
      frame._objUrl = objUrl;
    } catch(e) {
      frame.src = entry.archivo.dataUrl;
    }
    frame.style.display = 'block';
  } else if(/\.epub$/.test(fname)) {
    // EPUB: cargar epub.js
    var viewer = document.getElementById('bib-epub-viewer');
    viewer.style.display = 'block';
    document.getElementById('bib-epub-bar').style.display = 'flex';
    viewer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text2);font-size:.9rem;gap:10px;"><span>⏳</span> Cargando libro…</div>';
    _epubCurrentId = String(entry.id);
    _epubSavedCfi = localStorage.getItem('kalma-epub-pos-'+_epubCurrentId) || null;
    // Modo pantalla completa para dos páginas
    document.getElementById('bib-reader-overlay').classList.add('epub-mode');
    document.body.classList.add('epub-reading');
    // Mostrar señalador
    var sena = document.getElementById('epub-page-senalador');
    if(sena) { sena.style.display = 'block'; applyBMStyleAll(); }
    loadEpubJs(function(){
      initEpubReader(entry.archivo.dataUrl, viewer);
    });
  } else if(/\.txt$/.test(fname)) {
    // TXT: lector con voz
    var bodyEl = document.getElementById('bib-reader-body');
    bodyEl.style.display = 'block';
    document.getElementById('bib-tts-bar').style.display = 'flex';
    var raw = entry.archivo.dataUrl;
    var txt = '';
    try { txt = decodeURIComponent(escape(atob(raw.split(',')[1]))); }
    catch(ex) { txt = atob(raw.split(',')[1]||''); }
    var paragraphs = txt.split(/\n{2,}/).map(function(p){ return p.replace(/\n/g,' ').trim(); }).filter(Boolean);
    if(!paragraphs.length) paragraphs = [txt.trim()];
    bodyEl.innerHTML = paragraphs.map(function(p,i){ return '<p id="tts-p-'+i+'">'+escHtml(p)+'</p>'; }).join('');
    _ttsChunks = paragraphs;
    _ttsChunkIdx = 0;
    _ttsActive = false;
    _ttsPaused = false;
    ttsResetUI();
  }

  overlay.classList.add('open');
}

function closeBibReader() {
  ttsStop();
  if(_epubBook) { try{ _epubBook.destroy(); }catch(e){} _epubBook=null; _epubRendition=null; }
  var frame = document.getElementById('bib-pdf-frame');
  if(frame) {
    if(frame._objUrl) { URL.revokeObjectURL(frame._objUrl); frame._objUrl = null; }
    frame.src = '';
  }
  var overlay = document.getElementById('bib-reader-overlay');
  overlay.classList.remove('open','epub-mode');
  document.body.classList.remove('epub-reading');
  var sena = document.getElementById('epub-page-senalador');
  if(sena) sena.style.display = 'none';
}
// Teclado en lector
document.addEventListener('keydown', function(e){
  var overlay = document.getElementById('bib-reader-overlay');
  if(!overlay || !overlay.classList.contains('open')) return;
  if(e.key === 'Escape') { closeBibReader(); return; }
  if(e.key === 'ArrowRight' || e.key === 'ArrowDown') { epubNext(); e.preventDefault(); }
  if(e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { epubPrev(); e.preventDefault(); }
});

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function ttsToggle() {
  if(!window.speechSynthesis) { showNotif('Tu navegador no soporta lectura en voz alta.'); return; }
  if(_ttsActive && !_ttsPaused) {
    // Pausar
    window.speechSynthesis.pause();
    _ttsPaused = true;
    document.getElementById('tts-play-btn').textContent = '▶ Continuar';
  } else if(_ttsPaused) {
    // Reanudar
    window.speechSynthesis.resume();
    _ttsPaused = false;
    document.getElementById('tts-play-btn').textContent = '⏸ Pausar';
  } else {
    // Empezar desde el principio
    ttsStop();
    _ttsActive = true;
    _ttsChunkIdx = 0;
    ttsReadNext();
  }
}

function ttsReadNext() {
  if(_ttsChunkIdx >= _ttsChunks.length) {
    ttsStop();
    showNotif('✓ Lectura completada.');
    return;
  }
  var chunk = _ttsChunks[_ttsChunkIdx];
  var u = new SpeechSynthesisUtterance(chunk);
  u.lang = 'es-AR';
  var speed = parseFloat((document.getElementById('tts-speed')||{value:'1'}).value) || 1;
  u.rate = speed;
  u.pitch = 1;

  // Highlight párrafo actual
  ttsHighlight(_ttsChunkIdx);
  // Scroll al párrafo
  var pEl = document.getElementById('tts-p-'+_ttsChunkIdx);
  if(pEl) pEl.scrollIntoView({behavior:'smooth', block:'center'});
  // Progreso
  var pct = Math.round((_ttsChunkIdx / _ttsChunks.length) * 100);
  var bar = document.getElementById('tts-progress-bar');
  if(bar) bar.style.width = pct + '%';
  var info = document.getElementById('tts-info');
  if(info) info.textContent = (_ttsChunkIdx+1) + ' / ' + _ttsChunks.length;

  document.getElementById('tts-play-btn').textContent = '⏸ Pausar';
  document.getElementById('tts-stop-btn').disabled = false;

  u.onend = function() {
    if(!_ttsActive) return;
    _ttsChunkIdx++;
    ttsReadNext();
  };
  u.onerror = function(ev) {
    if(ev.error !== 'interrupted') showNotif('Error de voz: ' + ev.error);
  };
  _ttsUtterance = u;
  window.speechSynthesis.speak(u);
}

function ttsStop() {
  _ttsActive = false;
  _ttsPaused = false;
  if(window.speechSynthesis) window.speechSynthesis.cancel();
  ttsResetUI();
  ttsHighlight(-1);
}

function ttsChangeSpeed(val) {
  if(_ttsActive && !_ttsPaused) {
    // Reiniciar desde el chunk actual con nueva velocidad
    window.speechSynthesis.cancel();
    setTimeout(function(){ ttsReadNext(); }, 100);
  }
}

function ttsHighlight(idx) {
  document.querySelectorAll('#bib-reader-body p').forEach(function(p, i){
    if(i === idx) p.classList.add('bib-reader-highlight');
    else p.classList.remove('bib-reader-highlight');
  });
}

function ttsResetUI() {
  var playBtn = document.getElementById('tts-play-btn');
  var stopBtn = document.getElementById('tts-stop-btn');
  var bar = document.getElementById('tts-progress-bar');
  var info = document.getElementById('tts-info');
  if(playBtn) playBtn.textContent = '🔊 Leer';
  if(stopBtn) stopBtn.disabled = true;
  if(bar) bar.style.width = '0%';
  if(info) info.textContent = _ttsChunks.length ? '1 / ' + _ttsChunks.length : '—';
}

/* ── EPUB READER ── */
var _epubBook = null;
var _epubRendition = null;
var _epubSavedCfi = null;
var _epubCurrentId = null;

function loadEpubJs(cb) {
  if(window.ePub) { cb(); return; }
  var viewer = document.getElementById('bib-epub-viewer');
  function fail() {
    if(viewer) viewer.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text2);line-height:1.8;">No se pudo cargar el lector EPUB.<br><small>Verificá tu conexión a internet.</small></div>';
  }
  // epub.js requiere JSZip — cargar en orden: JSZip → epub.js
  function loadScript(src, onok, onerr) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = onok;
    s.onerror = onerr || fail;
    document.head.appendChild(s);
  }
  if(window.JSZip) {
    // JSZip ya está, cargar epub.js
    loadScript('https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js', cb,
      function(){ loadScript('https://unpkg.com/epubjs@0.3.93/dist/epub.min.js', cb, fail); });
  } else {
    // Cargar JSZip primero, luego epub.js
    loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
      function(){
        loadScript('https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js', cb,
          function(){ loadScript('https://unpkg.com/epubjs@0.3.93/dist/epub.min.js', cb, fail); });
      },
      function(){
        loadScript('https://unpkg.com/jszip@3.10.1/dist/jszip.min.js',
          function(){
            loadScript('https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js', cb,
              function(){ loadScript('https://unpkg.com/epubjs@0.3.93/dist/epub.min.js', cb, fail); });
          }, fail);
      }
    );
  }
}

function initEpubReader(dataUrl, container) {
  if(_epubBook) { try{ _epubBook.destroy(); }catch(e){} }
  container.innerHTML = '';
  try {
    // Convertir dataUrl a ArrayBuffer que epub.js maneja mejor
    var b64 = dataUrl.split(',')[1];
    var binary = atob(b64);
    var bytes = new Uint8Array(binary.length);
    for(var i=0; i<binary.length; i++) bytes[i] = binary.charCodeAt(i);
    var buffer = bytes.buffer;

    _epubBook = ePub(buffer);
    // Calcular ancho real disponible
    var cw = Math.max(320, (window.innerWidth || 1024));
    var ch = Math.max(300, (window.innerHeight || 768) - 110);
    // Una sola página en mobile (< 700px), dos en desktop
    var isMobile = cw < 700;
    _epubRendition = _epubBook.renderTo(container, {
      width: cw,
      height: ch,
      spread: isMobile ? 'none' : 'auto',
      flow: 'paginated',
      allowScriptedContent: false
    });
    _epubRendition.display(_epubSavedCfi || undefined);
    // Detectar colores del tema actual
    var htmlEl = document.documentElement;
    var cs = getComputedStyle(htmlEl);
    var bgColor = cs.getPropertyValue('--bg').trim() || '#ffffff';
    var textColor = cs.getPropertyValue('--text').trim() || '#000000';
    var accentColor = cs.getPropertyValue('--accent').trim() || '#A67B5B';
    _epubRendition.themes.default({
      'body,p,div,span,h1,h2,h3,h4,h5,h6,li,td,th': {
        'color': textColor + ' !important',
        'background': 'transparent !important'
      },
      body: {
        'font-family': "'Georgia', serif !important",
        'font-size': '1.05rem !important',
        'line-height': '1.85 !important',
        'padding': '20px 30px !important',
        'max-width': '660px !important',
        'margin': '0 auto !important',
        'background-color': bgColor + ' !important',
        'color': textColor + ' !important'
      },
      'a': { 'color': accentColor + ' !important' }
    });
    _epubBook.ready.then(function(){
      return _epubBook.locations.generate(1024);
    }).then(function(){
      updateEpubInfo();
    });
    _epubRendition.on('relocated', function(loc){
      updateEpubInfo();
      // Guardar posición
      if(loc && loc.start && loc.start.cfi) {
        _epubSavedCfi = loc.start.cfi;
        localStorage.setItem('kalma-epub-pos-'+_epubCurrentId, loc.start.cfi);
      }
    });
    _epubRendition.on('rendered', function(){ updateEpubInfo(); });
  } catch(err) {
    container.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text2);">Error al abrir el EPUB: ' + err.message + '</div>';
  }
}

function updateEpubInfo() {
  var infoEl = document.getElementById('epub-page-info');
  if(!infoEl || !_epubRendition) return;
  try {
    var loc = _epubRendition.currentLocation();
    if(loc && loc.start && loc.start.percentage !== undefined) {
      infoEl.textContent = Math.round(loc.start.percentage * 100) + '% leído';
    }
  } catch(e) {}
}

var _epubNavLocked = false;
function epubPrev() {
  if(!_epubRendition || _epubNavLocked) return;
  _epubNavLocked = true;
  waveSenaladorEpub();
  _epubRendition.prev().then(function(){
    updateEpubInfo();
    _epubNavLocked = false;
  }).catch(function(){
    _epubNavLocked = false;
  });
}
function epubNext() {
  if(!_epubRendition || _epubNavLocked) return;
  _epubNavLocked = true;
  waveSenaladorEpub();
  _epubRendition.next().then(function(){
    updateEpubInfo();
    _epubNavLocked = false;
  }).catch(function(){
    _epubNavLocked = false;
  });
}
function waveSenaladorEpub() {
  var s = document.getElementById('epub-page-senalador');
  if(!s) return;
  s.classList.remove('wave');
  void s.offsetWidth; // force reflow
  s.classList.add('wave');
  s.addEventListener('animationend', function(){ s.classList.remove('wave'); }, {once:true});
}
