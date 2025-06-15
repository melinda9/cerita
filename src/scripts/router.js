import NotFoundPage from './pages/not-found/not-found-page.js';
import HomePage from './pages/home/home-page.js';

const routes = {
  '/home': HomePage,
  // ...existing code...
};

function router() {
  // ...existing code...
  const hash = window.location.hash || '#/home';
  const page = routes[hash] || NotFoundPage;
  document.querySelector('#main-content').innerHTML = page.getTemplate();
  // ...existing code...
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);