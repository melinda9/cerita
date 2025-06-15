import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const AddPage = {
  getTemplate() {


    return `
      <section class="add-story">
        <h2>Tambah Cerita Baru</h2>
        <form id="storyForm">
          <div class="form-group">
            <h4 style="margin-bottom:0.7em;">Deskripsi Cerita :</h4>
            <textarea id="description" name="description" placeholder="Tulis cerita kamu di sini..." required style="border:2px solid var(--accent);border-radius:7px; font-size:1.2em; min-height:110px; padding:1em; width:100%; box-sizing:border-box; max-width:600px; margin:auto;"></textarea>
            <div style="margin-top:1em;"></div>
          </div>

          <div class="form-group camera-section" style="display: flex; align-items: flex-end; gap: 1.2em; flex-direction: column; align-items: stretch;">
            <div style="display: flex; flex-direction: row; gap: 0.7em; align-items: center; margin-bottom: 1em;">
              <button type="button" id="captureButton" aria-label="Ambil foto dari kamera"
                style="display:inline-flex;align-items:center;gap:0.7em;cursor:pointer;width:100%;max-width:150px;justify-content:flex-start;background:#ffd600;color:#222;font-weight:bold;border:none;border-radius:8px;padding:0.5em 1.2em;font-size:1em;height:44px;">
                <i class="fa-solid fa-camera"></i>
                <span style="display:inline-block;">Ambil Foto</span>
              </button>
              <label class="btn-yellow" id="photo-btn-label"
                style="display:inline-flex;align-items:center;gap:0.7em;cursor:pointer;width:100%;max-width:600px;justify-content:flex-start;background:#ffd600;color:#222;font-weight:bold;border:none;border-radius:8px;padding:0.5em 1.2em;font-size:1em;height:44px;">
                <i class="fa-solid fa-file-arrow-up"></i>
                <span id="photo-btn-text" style="line-height:1.1;">Upload Foto</span>
                <span id="photo-filename" style="font-size:0.97em;max-width:300px;display:inline-block;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;vertical-align:middle;"></span>
                <input type="file" id="photo" name="photo" accept="image/*" aria-describedby="photo-desc" style="display:none;" />
              </label>
              <p id="photo-desc" class="visually-hidden">Pilih satu gambar dari file atau gunakan kamera</p>
            </div>
            <div style="display: flex; flex-direction: row; gap: 1.2em; align-items: flex-end;">
              <video id="camera" autoplay aria-label="Tampilkan kamera langsung"></video>
              <canvas id="snapshot" style="display: none;"></canvas>
            </div>
            <div id="image-preview" style="margin-top:0.5em;">
              <h4 style="margin-bottom:0.7em;">Preview Gambar :</h4>
              <img id="preview-img" src="" alt="Preview gambar hasil kamera atau upload" style="width: 100%; height: auto; display: none; margin-top:0.7em;" />
            </div>
          </div>

          <div style="margin-top:1.5em;">
            <h4 style="margin-bottom:0.7em;">Peta lokasi cerita :</h4>
            <div id="map" style="height: 300px;"></div>
          </div>

          <label for="lat" class="visually-hidden">Latitude</label>
          <input type="hidden" id="lat" name="lat">

          <label for="lon" class="visually-hidden">Longitude</label>
          <input type="hidden" id="lon" name="lon">

          <div id="message" class="message"></div>

          <button type="submit" id="submitButton" style="margin-top:1.5em"><i class="fa-solid fa-paper-plane"></i> Kirim</button>
        </form>

        
    `;
  },

  initView({ onSubmit, onCapture, onMapClick, onSubscribe }) {


    const form = document.getElementById("storyForm");
    const captureButton = document.getElementById("captureButton");
    const previewImg = document.getElementById("preview-img");
    const fileInput = document.getElementById("photo");
    const photoBtnText = document.getElementById("photo-btn-text");
    const photoFilename = document.getElementById("photo-filename");
    const photoLabel = document.getElementById("photo-btn-label");

    let selectedFile = null;

    // Upload file handler
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      selectedFile = file;
      this.setImagePreview(file);
      if (file) {
        photoBtnText.textContent = 'Ganti File';
        // tampilkan hanya nama file pendek, bukan path penuh
        photoFilename.textContent = file.name.length > 18
          ? file.name.slice(0, 8) + '...' + file.name.slice(-8)
          : file.name;
      } else {
        photoBtnText.textContent = 'Upload File';
        photoFilename.textContent = '';
      }
    });

    captureButton?.addEventListener("click", () => {
      onCapture();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.showMessage(""); // Kosongkan pesan sebelum validasi/submit
      const description = document.getElementById("description").value.trim();
      const lat = document.getElementById("lat").value;
      const lon = document.getElementById("lon").value;

      // Validasi form
      if (!description) {
        this.showMessage("Deskripsi tidak boleh kosong.");
        return;
      }
      if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        this.showMessage("Silakan pilih lokasi pada peta.");
        return;
      }

      onSubmit({
        description,
        photo: selectedFile,
        lat,
        lon,
      });
      this.showMessage("Cerita berhasil terkirim.");
      setTimeout(() => {
        // Pastikan pesan tidak tertimpa oleh handler async di onSubmit
        if (document.getElementById("message").innerText !== "Cerita berhasil terkirim.") {
          this.showMessage("Cerita berhasil terkirim.");
        }
      }, 100);
    });


    const map = L.map("map").setView([-6.2, 106.816666], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let marker = null;

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }
      this.setLatLon(lat, lng);
      onMapClick(lat, lng);
    });
  },

  setImagePreview(fileOrBlob) {
    const previewImg = document.getElementById("preview-img");
    previewImg.src = URL.createObjectURL(fileOrBlob);
    previewImg.style.display = "block";
  },

  setLatLon(lat, lon) {
    document.getElementById("lat").value = lat;
    document.getElementById("lon").value = lon;
  },

  showMessage(text) {
    document.getElementById("message").innerText = text;
  },

  resetForm() {
    const form = document.getElementById("storyForm");
    form.reset();
    const previewImg = document.getElementById("preview-img");
    previewImg.src = "";
    previewImg.style.display = "none";
  },
};

export default AddPage;