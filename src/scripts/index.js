import { postStoryWithLocation } from "./data/repository.js";
import { initCamera, captureImage, stopCamera } from "./utils/camera.js";
import AddView from "./pages/add/add-page.js";
import UserModel from "./data/user-model.js";
import { registerServiceWorker } from "./utils/index.js";
import App from './pages/app';

const AddPresenter = {
  async init() {
    const token = UserModel.getToken();
    if (!token) {
      window.location.hash = "#/login";
      return;
    }

    document.querySelector("#main-content").innerHTML = AddView.getTemplate();

    AddView.initView({
      onSubmit: this.handleSubmit.bind(this),
      onCapture: this.handleCapture.bind(this),
      onMapClick: this.handleMapClick.bind(this),
    });

    initCamera("camera");

    window.addEventListener("hashchange", () => {
      stopCamera();
    });

    this.filePhoto = null;
    this.cameraPhoto = null;
    this.lat = 0;
    this.lon = 0;
  },

  async handleCapture() {
    try {
      this.cameraPhoto = await captureImage("camera", "snapshot");
      AddView.setImagePreview(this.cameraPhoto);
    } catch (error) {
      console.error("Gagal mengambil gambar:", error);
      AddView.showMessage("Gagal mengambil gambar.");
    }
  },

  async handleSubmit({ description, photo, lat, lon }) {
    const f = new FormData();
    f.append("description", description);
    f.append("photo", photo || this.cameraPhoto);
    f.append("lat", +lat);
    f.append("lon", +lon);

    try {
      await postStoryWithLocation(f);
      AddView.showMessage("Cerita berhasil terkirim.");
      stopCamera();
      AddView.resetForm();
      setTimeout(() => { window.location.hash = "#/home"; }, 400);
    } catch (e) {
      AddView.showMessage("Gagal: " + e.message);
    }
  },

  handleMapClick(lat, lon) {
    this.lat = lat;
    this.lon = lon;
  },
};

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered successfully.');

      // Tes push notifikasi
      registration.showNotification('Push Notification', {
        body: 'Ini adalah notifikasi push!',
        icon: '/images/favicon.png',
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
});

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" style="background-color: yellow; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">
      Subscribe to Notifications
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" style="background-color: red; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">
      Unsubscribe from Notifications
    </button>
  `;
}
