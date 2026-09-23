const CACHE='zahi-fit-v2.2.1';
const ASSETS=['./','./index.html','./app.css','./app.js','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));return r}).catch(()=>caches.match('./index.html')));return}if(url.origin===self.location.origin){e.respondWith(caches.match(req).then(cached=>{const net=fetch(req).then(r=>{if(r&&r.ok)caches.open(CACHE).then(c=>c.put(req,r.clone()));return r}).catch(()=>cached);return cached||net}))}});
