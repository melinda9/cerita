


const AboutPresenter = {
  async init({ view, model }) {
    // Model: model.getToken
    // View: view.renderShell, view.redirectToLogin
    const token = model.getToken();
    if (!token) {
      view.redirectToLogin();
      return;
    }
    view.renderShell();
  },

  async afterRender({ view }) {
    view.renderContent();
  },
};

export default AboutPresenter;