
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('snake').then(function (cache) {
      return cache.addAll([
        '/',
        'index.html',
        'eatApple.mp3',
        'soundtrackGame.mp3',
        'gameOver.mp3',
        '/js/main.js',
        '/js/Sound.js',
        '/js/Snake.js',
        '/js/Apple.js',
        'styles.css',
        'firebase.js',
        'package-lock.js'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        let responseClone = response.clone();
        caches.open('snake').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      })
    }
  }));
});