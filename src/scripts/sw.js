// Service Worker file
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open('static-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/style.css',
        '/scripts/main.js',
        '/scripts/routes/routes.js',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Updated push event listener to handle dynamic notification data
self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');

  async function chainPromise() {
    let data = {};
    if (event.data) {
      try {
        data = event.data.json();
      } catch (error) {
        console.warn('Push payload is not valid JSON, falling back to text:', error);
        const textData = await event.data.text();
        data = { title: 'Notifikasi Baru', body: textData };
      }
    }

    const title = data.title || 'Notifikasi Baru';
    const options = {
      body: data.body || 'Ada notifikasi baru untuk Anda.',
      icon: '/images/favicon.png',
      badge: '/images/icons/icon-72x72.png',
    };

    await self.registration.showNotification(title, options);
  }

  event.waitUntil(chainPromise());
});
