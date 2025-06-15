import NotFoundPage from './notfound-page.js';

const NotFoundPresenter = {
  async init() {
    const container = document.querySelector('#main-content');
    NotFoundPage.render(container);
  }
};

export default NotFoundPresenter;
