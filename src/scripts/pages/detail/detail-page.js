import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DetailPage = {
  render(container) {
    container.innerHTML = this.getTemplate();
  },

  getTemplate() {
    return `
      <section class="story-detail">
        <article id="story-container" class="loading-state">Memuat cerita...</article>
      </section>
    `;
  },

  showError(message) {
    const container = document.getElementById("story-container");
    container.innerHTML = `<p class="error-message">${message}</p>`;
  },

  showStoryDetail(story) {
    const container = document.getElementById("story-container");
    // Pastikan lat/lon valid number
    const hasLocation = typeof story.lat !== "undefined" && typeof story.lon !== "undefined" && !isNaN(Number(story.lat)) && !isNaN(Number(story.lon));
    container.innerHTML = `
      <article aria-label="Detail cerita pengguna" class="story-article">
        <h2>Detail Cerita</h2>

        <img 
          src="${story.photoUrl}" 
          alt="Foto review oleh ${story.name}" 
          class="story-image"
        />

        <p><strong>Nama Pengguna:</strong> ${story.name}</p>
        <p><strong>Deskripsi:</strong> ${story.description}</p>
        <p><strong>Dibuat pada:</strong> ${new Date(story.createdAt).toLocaleString()}</p>
        
        ${hasLocation ? 
          `<p><strong>Lokasi:</strong> ${story.lat}, ${story.lon}</p>
           <div id="map-detail" style="height: 300px; margin-top: 1em;"></div>` : 
          `<p><em>Lokasi tidak tersedia</em></p>`
        }
      </article>
    `;
  },

  showMap(story) {
    const lat = Number(story.lat);
    const lon = Number(story.lon);
    if (
      typeof story.lat === "undefined" || typeof story.lon === "undefined" ||
      story.lat === null || story.lon === null ||
      isNaN(lat) || isNaN(lon) ||
      !document.getElementById('map-detail')
    ) return;

    // Perbaikan: pastikan map tidak double render
    const mapContainer = document.getElementById('map-detail');
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = "";
    }

    const map = L.map("map-detail", {
      zoomControl: true,
      attributionControl: true,
      fadeAnimation: true,
      zoomAnimation: true,
      markerZoomAnimation: true,
    }).setView([lat, lon], 15);

    // Layer Styles
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      className: 'osm-layer',
    });
    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenTopoMap contributors',
      className: 'topo-layer',
    });
    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      className: 'dark-layer',
    });
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      className: 'satellite-layer',
    });

    const baseMaps = {
      "OpenStreetMap": osmLayer,
      "Topographic": topoLayer,
      "Dark": darkLayer,
      "Satellite": satelliteLayer
    };

    L.control.layers(baseMaps, null, { position: 'topright', collapsed: false }).addTo(map);

    const marker = L.marker([lat, lon], {
      bounceOnAdd: true,
      bounceOnAddOptions: {duration: 500, height: 100},
      bounceOnAddCallback: function() {console.log("done");}
    }).addTo(map)
      .bindPopup(`
        <b>${story.name}</b><br>
        <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" style="width:80px; border-radius:6px; margin-bottom:6px;"><br>
        ${story.description ? story.description.substring(0, 60) + (story.description.length > 60 ? '...' : '') : ''}
      `)
      .openPopup();

    // Animasi custom pada marker
    marker._icon.classList.add('animated-marker');

    // Layer default
    osmLayer.addTo(map);
  },

  // Added addNotifyMeEventListener method
  addNotifyMeEventListener() {
    document.getElementById('report-detail-notify-me').addEventListener('click', () => {
      this.presenter.notifyMe();
    });
  }
};

export default DetailPage;