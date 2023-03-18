const cacheVersion = "v5";
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheVersion).then((cache) => {
      return cache.addAll([
        '/offline.html',
        '/style/both.css',
        '/img/logo.webp',
        '/img/favicon.ico'
      ]);
    })
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        // let responseClone = response.clone();
        // caches.open(cacheVersion).then((cache) => {
        //   cache.put(event.request, responseClone);
        // });
        return response;
      }).catch(() => {
        return caches.match('./offline.html');
      })
    })
  );
});
self.addEventListener('activate', (event) => {
  const cacheKeeplist = [cacheVersion];
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
