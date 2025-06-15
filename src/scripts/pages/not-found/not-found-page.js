const NotFoundPage = {
  getTemplate() {
    return `
      <section class="not-found">
        <h2>404</h2>
        <p>Halaman tidak ditemukan.</p>
        <a href="#/home">Kembali ke Beranda</a>
      </section>
    `;
  }
};

export default NotFoundPage;
