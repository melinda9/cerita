import { getAllStories as getAllStoriesIDB, deleteStory as deleteStoryIDB } from '../../utils/idb.js';

const OfflinePage = {
  async render(container) {
    container.innerHTML = this.getTemplate();
    await this.showOfflineStories();
  },

  getTemplate() {
    return `
      <section class="offline-section">
        <h2>Cerita Offline</h2>
        <ul id="offline-story-list" class="offline-story-list offline-grid"></ul>
      </section>
    `;
  },

  async showOfflineStories() {
    const list = document.getElementById('offline-story-list');
    const ceritaList = await getAllStoriesIDB();
    if (!ceritaList.length) {
      list.innerHTML = '<li>Tidak ada cerita offline.</li>';
    } else {
      // Sort stories by createdAt in descending order
      ceritaList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      list.innerHTML = ceritaList.map(cerita => `
        <li class="offline-story-card">
          <img src="${cerita.photoUrl}" alt="Foto oleh ${cerita.name || 'Tanpa Nama'}" class="offline-story-image">
          <h3 class="offline-story-title">
            <i class="fas fa-map-marker-alt"></i> ${cerita.name || 'Tanpa Nama'}
          </h3>
          <p class="offline-story-description">${cerita.description || ''}</p>
          <p class="offline-story-date">Ditulis pada: ${cerita.createdAt ? new Date(cerita.createdAt).toLocaleDateString() : ''}</p>
          <button class="delete-offline-btn" data-id="${cerita.id}">Hapus</button>
        </li>
      `).join('');
    }
    // Hapus satuan
    list.querySelectorAll('.delete-offline-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        await deleteStoryIDB(btn.getAttribute('data-id'));
        await this.showOfflineStories();
      });
    });
  }
};

export default OfflinePage;
