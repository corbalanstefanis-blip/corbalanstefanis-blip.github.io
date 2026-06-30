// ─── TEMA Y PALETA ───
var _currentPalette = localStorage.getItem('kalma-palette') || 'cebada';
var _currentMode    = localStorage.getItem('kalma-mode')    || 'light';

function _applyTheme() {
  var t;
  if(_currentMode === 'lectura') { t = 'lectura'; }
  else if(_currentMode === 'basic') { t = 'basic'; }
  else if(_currentPalette === 'dark') { t = 'dark'; }
  else { t = _currentPalette + (_currentMode === 'dark' ? '-dark' : ''); }
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('kalma-theme', t);
}

function setPalette(palette, btn) {
  _currentPalette = palette;
  localStorage.setItem('kalma-palette', palette);
  if(palette === 'dark') { _currentMode = 'dark'; }
  _applyTheme();
  document.querySelectorAll('.palette-btn').forEach(function(b){ b.classList.remove('active'); });
  if(btn) btn.classList.add('active');
  document.querySelectorAll('.mode-btn').forEach(function(b){
    b.classList.toggle('active', b.dataset.mode === _currentMode);
  });
}

function setMode(mode, btn) {
  _currentMode = mode;
  localStorage.setItem('kalma-mode', mode);
  _applyTheme();
  document.querySelectorAll('.mode-btn').forEach(function(b){ b.classList.remove('active'); });
  if(btn) btn.classList.add('active');
}

function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('kalma-theme', t);
}

(function(){
  var sp = localStorage.getItem('kalma-palette');
  var sm = localStorage.getItem('kalma-mode');
  if(sp) _currentPalette = sp;
  if(sm) _currentMode = sm;
  _applyTheme();
  setTimeout(function(){
    document.querySelectorAll('.palette-btn').forEach(function(b){
      b.classList.toggle('active', b.dataset.palette === _currentPalette);
    });
    document.querySelectorAll('.mode-btn').forEach(function(b){
      b.classList.toggle('active', b.dataset.mode === _currentMode);
    });
  }, 100);
})();
