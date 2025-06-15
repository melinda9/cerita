
import { postStoryWithLocation } from "../../data/repository.js";
import { initCamera, captureImage, stopCamera } from "../../utils/camera.js";
import AddView from "./add-page.js";
import UserModel from "../../data/user-model.js";
import { isNotificationAvailable, isNotificationGranted } from "../../utils/notification-helper.js";

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

      // Tampilkan notifikasi browser setelah submit sukses HANYA jika user sudah subscribe push notification
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        // Cek apakah user sudah subscribe push notification
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          registration.showNotification('Cerita baru masuk!', {
            body: 'Ada cerita baru masuk nih.'
          });
        }
      }

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

export default AddPresenter;