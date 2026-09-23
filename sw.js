const CACHE='zahi-fit-v2.3.0';
const ASSETS=['./','./index.html','./app.css','./app.js','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(CACHE).then(k=>k.put('./index.html',c));return x}).catch(()=>caches.match('./index.html')));return}if(u.origin===self.location.origin)e.respondWith(caches.match(r).then(c=>c||fetch(r).then(x=>{if(x.ok)caches.open(CACHE).then(k=>k.put(r,x.clone()));return x})))});
