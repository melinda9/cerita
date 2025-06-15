import L from 'leaflet';

const HomePage = {
  render(container) {
    container.innerHTML = this.getTemplate();
  },

  getTemplate() {
    return `
      <a href="#stories" class="skip-link">Skip to content</a>
      <section class="content">
        <p class="welcome-text">Selamat datang di StoryIn</p>
        <h2>Temukan Cerita Terbaru</h2>
        <div id="map-home" style="height: 320px; margin-bottom: 1.5em; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.13);"></div>
        <div 
          id="stories" 
          tabindex="-1" 
          aria-label="Daftar cerita dan review cerita" 
          class="story-container">
        </div>
      </section>
    `;
  },

  showStories(stories = []) {
    const container = document.getElementById('stories');
    if (!stories.length) {
      container.innerHTML = '<p>Belum ada review untuk saat ini.</p>';
      this.showMap([]); // Kosongkan peta jika tidak ada story
      return;
    }


    container.innerHTML = '';

    stories.forEach(({ id, name, description, photoUrl, createdAt }) => {
      container.innerHTML += `
        <article class="story-card animated fadeIn">
          <a href="#/detail/${id}">
            <img src="${photoUrl}" alt="Foto review oleh ${name}" width="200" class="story-image">
            <h3 class="story-title">
              <i class="fas fa-map-marker-alt"></i> ${name}
            </h3>
          </a>
          <p class="story-description">${description}</p>
          <p class="story-date">Ditulis pada: ${new Date(createdAt).toLocaleDateString()}</p>
          <button class="save-story-btn" data-id="${id}" aria-label="Simpan cerita ke offline">Simpan Offline</button>
        </article>
      `;
    });

    // Tambahkan event listener untuk hapus story offline

    // Tombol simpan offline
    container.querySelectorAll('.save-story-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.getAttribute('data-id');
        const story = stories.find(s => s.id === id);
        if (story) {
          const { saveStory } = await import('../../utils/idb');
          await saveStory(story);
          btn.innerText = 'Tersimpan';
          btn.disabled = true;
        }
      });
    });

    this.showMap(stories);
  },

  showMap(stories) {
    const mapContainer = document.getElementById('map-home');
    if (!mapContainer) return;

    // Hapus instance map sebelumnya jika ada
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = "";
    }

    // Filter hanya story yang punya lat/lon valid dan bukan null/undefined/NaN
    const locations = stories.filter(s =>
      s.lat !== null && s.lon !== null &&
      typeof s.lat !== "undefined" && typeof s.lon !== "undefined" &&
      !isNaN(Number(s.lat)) && !isNaN(Number(s.lon))
    );

    // Default center: Jakarta
    const center = locations.length
      ? [Number(locations[0].lat), Number(locations[0].lon)]
      : [-6.2, 106.816666];

    const map = L.map('map-home', {
      zoomControl: true,
      attributionControl: true,
      fadeAnimation: true,
      zoomAnimation: true,
      markerZoomAnimation: true,
    }).setView(center, 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    locations.forEach(story => {
      const marker = L.marker([story.lat, story.lon]).addTo(map);
      marker.bindPopup(`
        <b>${story.name}</b><br>
        <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" style="width:80px; border-radius:6px; margin-bottom:6px;"><br>
        ${story.description ? story.description.substring(0, 60) + (story.description.length > 60 ? '...' : '') : ''}
        <br><a href="#/detail/${story.id}">Lihat detail</a>
      `);
    });

    // Fit bounds jika ada banyak marker
    if (locations.length > 1) {
      const bounds = L.latLngBounds(locations.map(s => [s.lat, s.lon]));
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  },

  showError(message) {
    const container = document.getElementById('stories');
    if (container) {
      container.innerHTML = `<p class="error-message">Gagal memuat review: ${message}</p>`;
    }
    this.showMap([]); // Kosongkan peta jika error
  },

  handleSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('stories');
      if (target) {
        target.focus();
        skipLink.style.display = 'none';
      }
    });
  },

  animateStories() {
    const cards = document.querySelectorAll('.story-card');
    cards.forEach((card, index) => {
      card.animate(
        [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: 300 + index * 100,
          easing: 'ease-out'
        }
      );
    });
  }
};

export default HomePage;