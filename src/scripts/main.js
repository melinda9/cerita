

// (See <attachments> above for file contents. You may not need to search or read the file again.)
import App from './pages/app';
import '../styles/style.css';
import { withViewTransition } from './utils/view-transition.js';
import { requestNotificationPermission } from './utils/notification-helper.js';

window.addEventListener('hashchange', () => {
  withViewTransition(() => App.renderPage());
});
window.addEventListener('load', () => App.renderPage());

// Hapus notifikasi otomatis saat pertama kali load,
// notifikasi hanya muncul setelah user klik subscribe di UI

// PWA: Register service worker, push notification, and custom install prompt
let deferredPrompt;
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', reg.scope);

      // Push Notification: Request permission dipindahkan ke aksi user (misal: klik subscribe notifikasi)
      // Tidak lagi meminta izin otomatis saat halaman di-load
    } catch (err) {
      console.error('Service Worker registration or Push failed:', err);
    }
  });

  // Custom install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });
}


// Permintaan izin notifikasi dipindahkan ke aksi user (misal: klik subscribe notifikasi di UI)
// Tidak lagi meminta izin otomatis saat halaman di-load, agar tidak menyebabkan refresh loop atau kedip-kedip

function showInstallButton() {
  let btn = document.getElementById('installPwaBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'installPwaBtn';
    btn.innerText = 'Install Aplikasi StoryIn';
    btn.style.position = 'fixed';
    btn.style.bottom = '24px';
    btn.style.right = '24px';
    btn.style.zIndex = '9999';
    btn.style.background = '#ffd700';
    btn.style.color = '#232a34';
    btn.style.fontWeight = 'bold';
    btn.style.padding = '1em 2em';
    btn.style.borderRadius = '8px';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.13)';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
    btn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          btn.remove();
        }
        deferredPrompt = null;
      }
    });
  }
}

// Helper: Convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Skip to content handler untuk aksesibilitas SPA
const mainContent = document.querySelector('#main-content'); // Seleksi elemen id="main-content"
const skipLink = document.querySelector('.skip-link'); // Seleksi elemen class="skip-link"
if (mainContent && skipLink) {
  skipLink.addEventListener('click', function (event) {
    event.preventDefault(); // Mencegah refresh halaman
    skipLink.blur(); // Menghilangkan fokus skip to content
    mainContent.focus(); // Fokus ke konten utama
    mainContent.scrollIntoView(); // Halaman scroll ke konten utama
  });
}