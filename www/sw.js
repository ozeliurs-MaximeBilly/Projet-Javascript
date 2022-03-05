self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('my-custom-pwa').then((cache) => cache.addAll([
            "/",
            "/js/script.js",
            "https://cdn.jsdelivr.net/npm/chart.js",
            "/css/style.css",
            "/css/chota.css",
            "/manifest.webmanifest",
            "icons/webIcon.png"
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
