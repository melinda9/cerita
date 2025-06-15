import AboutPage from './about-page.js';

const AboutView = {
  renderShell() {
    const container = document.querySelector('#main-content');
    if (container) container.innerHTML = AboutPage.renderShell();
  },
  renderContent() {
    const aboutContainer = document.getElementById('about-page');
    if (aboutContainer) aboutContainer.innerHTML = AboutPage.getTemplate();
  },
  redirectToLogin() {
    window.location.hash = '#/login';
  }
};

export default AboutView;
