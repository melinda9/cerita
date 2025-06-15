const HomePresenter = {
  async init({ view, model, withViewTransition }) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("#/login");
      return;
    }

    const container = document.querySelector('#main-content');
    view.render(container);
    view.handleSkipLink();

    try {
      const stories = await model.getAllStories();
      view.showStories(stories);

      await withViewTransition(() => {});
      view.animateStories();
    } catch (error) {
      view.showError(error.message);
    }
  }
};

export default HomePresenter;