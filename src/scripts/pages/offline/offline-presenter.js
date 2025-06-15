import OfflinePage from './offline-page.js';

const OfflinePresenter = {
  async init() {
    const container = document.querySelector('#main-content');
    await OfflinePage.render(container);
  }
};

export default OfflinePresenter;
