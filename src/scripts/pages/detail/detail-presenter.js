const DetailPresenter = {
  async init({ view, model, urlParser }) {
    const token = model.getToken();
    if (!token) {
      window.location.hash = "#/login";
      return;
    }

    const container = document.querySelector("#main-content");
    view.render(container);
    await this.loadStoryDetail({ view, model, urlParser });
  },

  async loadStoryDetail({ view, model, urlParser }) {
    const url = urlParser.parseActiveUrl();
    const id = url.id;

    if (!id || !id.startsWith("story-")) {
      view.showError("ID cerita tidak valid. Harus dimulai dengan 'story-'.");
      return;
    }

    try {
      const story = await model.getStoryById(id);
      if (!story) {
        view.showError("Cerita tidak ditemukan. Pastikan ID valid.");
        return;
      }

      view.showStoryDetail(story);
      view.showMap(story);

    } catch (error) {
      view.showError(`Gagal memuat cerita: ${error.message}`);
    }
  }
};

export default DetailPresenter;