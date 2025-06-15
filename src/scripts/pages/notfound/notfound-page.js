const NotFoundPage = {
  render(container) {
    container.innerHTML = this.getTemplate();
  },
  getTemplate() {
    return `
      <section class="notfound-section" style="text-align:center; padding:3em 1em;">
        <h2 style="font-size:2.5em; color:#ffd700;">404</h2>
        <p style="font-size:1.3em;">Halaman tidak ditemukan</p>
        <a href="#/home" style="color:#1976d2; font-weight:bold; text-decoration:underline;">Kembali ke Beranda</a>
      </section>
    `;
  }
};
export default NotFoundPage;
