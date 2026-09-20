/* Service worker: deja el juego disponible sin conexión.
   Si cambiás algún archivo, subí el número de VERSION para que se actualice. */
const VERSION='chirimbolandia-v3';
const CORE=['./','./index.html','./cubolandia.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  e.respondWith(
    caches.match(r).then(hit=>hit||fetch(r).then(res=>{
      /* guarda también las tipografías de Google la primera vez que hay internet */
      if(res&&(res.ok||res.type==='opaque')){const copy=res.clone();caches.open(VERSION).then(c=>c.put(r,copy));}
      return res;
    }).catch(()=>caches.match('./index.html')))
  );
});
