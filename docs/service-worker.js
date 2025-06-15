/* global workbox */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  // Cache halaman utama dan shell
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
    })
  );

  // Cache file statis (js, css, images)
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'assets-cache',
    })
  );

  // Cache API (opsional, sesuaikan endpoint)
  workbox.routing.registerRoute(
    /\/api\//,
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
    })
  );
} else {
  console.error('Workbox gagal dimuat');
}

// Menangani push notifikasi di service worker
self.addEventListener('push', function(event) {
  console.log('Push event received:', event);

  // Periksa apakah event.data ada dan memiliki metode .text()
  const dataPromise = event.data && typeof event.data.text === 'function' 
      ? event.data.text() 
      : Promise.resolve('No payload');

  event.waitUntil(
    Promise.resolve(dataPromise).then((textData) => {
      console.log('Raw push data:', textData);
      let notificationData = {};
      let url = '/';
      try {
        notificationData = JSON.parse(textData);
        url = notificationData.url || '/';
      } catch (e) {
        console.error('Error parsing push data as JSON:', e);
        notificationData = { title: 'Notifikasi', body: textData };
      }
      self.registration.showNotification(
        notificationData.title || 'Ada cerita baru untuk Anda!',
        {
          body: notificationData.body || 'cerita baru masuk nih',
          icon: notificationData.icon || '/images/favicon.png',
          badge: notificationData.badge || '/images/icons/icon-72x72.png',
          data: { url }
        }
      );
    }).catch((e) => {
      console.error('Error handling push event:', e);
      self.registration.showNotification('Notifikasi Error', {
        body: 'Data notifikasi tidak valid.'
      });
    })
  );
});

// Menangani klik pada notifikasi
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // Menutup notifikasi saat diklik
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/'; // Mengambil URL dari data notifikasi
  event.waitUntil(clients.openWindow(url)); // Membuka URL di jendela baru
});
