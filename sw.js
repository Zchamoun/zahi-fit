/* Zahi Fit v4 service worker.
   Core files are precached per release; exercise images are cached the first time they're viewed.
   A new version waits until the user taps "Update" so the app never reloads mid-set. */
const VERSION = "4.1.1";
const CORE = `zahi-fit-core-${VERSION}`;
const MEDIA = "zahi-fit-media-v1";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./data.js", "./app.js", "./manifest.json",
  "./icon-192.png", "./icon-512.png",
  "./fonts/nunito-latin-400-normal.woff2", "./fonts/nunito-latin-600-normal.woff2",
  "./fonts/nunito-latin-700-normal.woff2", "./fonts/nunito-latin-800-normal.woff2",
  "./fonts/barlow-condensed-latin-600-normal.woff2", "./fonts/barlow-condensed-latin-700-normal.woff2"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CORE).then(c => c.addAll(ASSETS.map(u => new Request(u, {cache:"reload"})))));
});
self.addEventListener("message", e => { if(e.data && e.data.type === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CORE && k !== MEDIA && !k.startsWith("zahi-fit-voice")).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;           // AI coach requests go straight to the network

  if(req.mode === "navigate"){
    e.respondWith(caches.match("./index.html").then(r => r || fetch(req)));
    return;
  }
  if(/\/pt-assets-v3[34]\//.test(url.pathname)){
    // Exercise images: cache on first view; a newly uploaded photo replaces a cached miss.
    e.respondWith(caches.open(MEDIA).then(async c => {
      const hit = await c.match(req);
      if(hit) return hit;
      const res = await fetch(req);
      if(res.ok) c.put(req, res.clone());
      return res;
    }));
    return;
  }
  e.respondWith(caches.match(req, {ignoreSearch:true}).then(hit => hit || fetch(req)));
});
