// ── BLOC DE NOTAS ──
const blocKey='kalma-bloc';
const blocTa=document.getElementById('bloc-text');
blocTa.value=localStorage.getItem(blocKey)||'';
blocTa.addEventListener('input',()=>localStorage.setItem(blocKey,blocTa.value));
function copyBloc(){navigator.clipboard?.writeText(blocTa.value);showNotif('📋 ¡Copiado!');}
function clearBloc(){if(confirm('¿Borrar todas las notas?')){blocTa.value='';localStorage.removeItem(blocKey);}}
function downloadBloc(){
  const a=document.createElement('a');
  a.href='data:text/plain;charset=utf-8,'+encodeURIComponent(blocTa.value);
  a.download='mis-notas-kalma.txt';a.click();
}

function abrirBloc() {
  // Abre el toolbox y activa la tab del bloc de notas
  var panel = document.getElementById('toolbox-panel');
  if(panel && !panel.classList.contains('open')) panel.classList.add('open');
  var btn = document.querySelector('.toolbox-tab[onclick*="bloc"]');
  if(btn) switchTool('bloc', btn);
}

