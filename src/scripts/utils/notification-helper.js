import { convertBase64ToUint8Array } from './index';
import { VAPID_PUBLIC_KEY } from '../config';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api';

export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    alert('Izin notifikasi ditolak.');
    return false;
  }

  if (status === 'default') {
    alert('Izin notifikasi ditutup atau diabaikan.');
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}

// Add detailed logging to debug subscription issues
export async function subscribe() {
  console.log('Subscribe function called');
  console.log('Checking notification permission...');
  if (!(await requestNotificationPermission())) {
    console.error('Notification permission denied.');
    return;
  }

  console.log('Checking current push subscription...');
  if (await isCurrentPushSubscriptionAvailable()) {
    alert('Sudah berlangganan push notification.');
    return;
  }

  console.log('Starting push notification subscription...');

  const failureSubscribeMessage = 'Langganan push notification gagal diaktifkan.';
  const successSubscribeMessage = 'Langganan push notification berhasil diaktifkan.';
  let pushSubscription;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      console.error('Service worker registration not found.');
      alert(failureSubscribeMessage);
      return;
    }

    console.log('Subscribing to push manager...');
    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

    const { endpoint, keys } = pushSubscription.toJSON();
    console.log('Sending subscription data to server:', { endpoint, keys });
    const response = await subscribePushNotification({ endpoint, keys });
    console.log('Server response:', response);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Subscription failed:', errorData);
      alert(failureSubscribeMessage);

      // Undo subscribe to push notification
      await pushSubscription.unsubscribe();

      return;
    }

    // Tampilkan notifikasi browser jika berhasil subscribe
    alert(successSubscribeMessage);
    // Logging tambahan untuk debug
    console.log('Cek Notification API:', 'Notification' in window);
    console.log('Notification.permission:', Notification.permission);
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        console.log('Mencoba menampilkan notifikasi browser...');
        const notif = new Notification('Berhasil!', {
          body: 'Langganan notifikasi berhasil diaktifkan.',
          icon: '/public/images/favicon.png',
        });
        console.log('Notifikasi browser berhasil dipanggil:', notif);
        // Fallback alert jika notifikasi tidak muncul dalam 2 detik
        setTimeout(() => {
          if (!notif || notif.permission !== 'granted') {
            alert('Notifikasi browser gagal ditampilkan. Cek izin notifikasi di browser Anda.');
          }
        }, 2000);
      } catch (e) {
        console.warn('Gagal menampilkan notifikasi browser:', e);
        alert('Notifikasi browser gagal ditampilkan. Cek izin notifikasi di browser Anda.');
      }
    } else {
      alert('Notifikasi browser gagal ditampilkan. Cek izin notifikasi di browser Anda.');
      console.warn('Notification API tidak tersedia atau izin belum granted.');
    }
  } catch (error) {
    console.error('subscribe: error:', error);
    alert(failureSubscribeMessage);

    // Undo subscribe to push notification
    if (pushSubscription) {
      await pushSubscription.unsubscribe();
    }
  }
}

export async function unsubscribe() {
  const failureUnsubscribeMessage = 'Langganan push notification gagal dinonaktifkan.';
  const successUnsubscribeMessage = 'Langganan push notification berhasil dinonaktifkan.';
  try {
    const pushSubscription = await getPushSubscription();
    if (!pushSubscription) {
      alert('Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.');
      return;
    }
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });
    if (!response.ok) {
      alert(failureUnsubscribeMessage);
      console.error('unsubscribe: response:', response);
      return;
    }
    const unsubscribed = await pushSubscription.unsubscribe();
    if (!unsubscribed) {
      alert(failureUnsubscribeMessage);
      await subscribePushNotification({ endpoint, keys });
      return;
    }
    alert(successUnsubscribeMessage);
  } catch (error) {
    alert(failureUnsubscribeMessage);
    console.error('unsubscribe: error:', error);
  }
}
