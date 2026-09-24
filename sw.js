const CACHE = 'zahi-fit-v3.4.0';
const ASSETS = [
  './','./index.html','./app.css','./app.js','./v24.css','./v24.js',
  './v25.css','./v25.js','./v251.js','./v27.css','./v27.js','./v33.js','./v34.js',
  './v31.css','./manifest.json','./icon-192.png','./icon-512.png',
  './pt-assets/world-stretch-step1.jpg','./pt-assets/world-stretch-step2.jpg','./pt-assets/world-stretch-step3.jpg',
  './pt-assets/world-stretch-step4.jpg','./pt-assets/world-stretch-step5.jpg'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request=event.request;
  if(request.method!=='GET') return;
  const url=new URL(request.url);
  if(request.mode==='navigate'){
    event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response;}).catch(()=>caches.match('./index.html')));
    return;
  }
  if(url.origin===self.location.origin){
    event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match(request)));
  }
});
