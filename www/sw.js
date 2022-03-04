self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('my-custom-pwa').then((cache) => cache.addAll([
            "../index.html",
            "script.js",
        ])
    )
)
})

self.addEventListener('fetch', (e) => {
    console.log(e);
    e.respondWith(
  
      caches.match(e.request).then((response) => response || fetch(e.request)),
  
    );
});