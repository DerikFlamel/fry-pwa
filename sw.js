self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open('frz-v1').then(c=>c.addAll(['./','./index.html','./manifest.webmanifest'])));
});
self.addEventListener('activate', (e)=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e)=>{
  e.respondWith(
    caches.match(e.request).then(resp=> resp || fetch(e.request).catch(()=>caches.match('./index.html')))
  );
});
