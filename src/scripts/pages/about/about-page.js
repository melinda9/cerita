const AboutPage = {
  renderShell() {
    return `<div id="about-page"></div>`;
  },

  getTemplate() {
    return `
      <section class="about" style="display: flex; gap: 2rem; flex-wrap: wrap;">
        <div style="flex:2; min-width:250px; background:var(--card-bg,#232a34); border-radius:14px; padding:1.5rem; box-shadow:0 4px 16px rgba(0,0,0,0.10);">
          <h2>Informasi Aplikasi</h2>
          <p>StoryIn adalah platform web interaktif untuk berbagi dan mengeksplorasi cerita. Dibangun sebagai Single Page Application (SPA) dengan JavaScript dan Webpack, StoryIn mempermudah pengguna untuk mempublikasikan, menilai, dan berinteraksi dengan berbagai konten cerita dalam pengalaman yang sederhana dan menyenangkan.</p>
        </div>
        <aside style="flex:1; min-width:200px; background:var(--secondary-bg,#181c24); border-radius:14px; padding:1.5rem; box-shadow:0 4px 16px rgba(0,0,0,0.10); display:flex; flex-direction:column; align-items:center; justify-content:center;">
          <h3 style="color:var(--accent,#ffd700); margin-bottom:1rem;">Follow Us</h3>
          <a href="https://instagram.com/melinda" target="_blank" style="color:var(--accent,#ffd700); text-decoration:none; font-weight:600; margin-bottom:0.7rem;">
            <i class="fab fa-instagram"></i> @melinda
          </a>
          <a href="https://twitter.com/melinda.id" target="_blank" style="color:var(--accent,#ffd700); text-decoration:none; font-weight:600; margin-bottom:0.7rem;">
            <i class="fab fa-twitter"></i> melinda.id
          </a>
          <a href="mailto:melinda@gmail.com" style="color:var(--accent,#ffd700); text-decoration:none; font-weight:600;">
            <i class="fas fa-envelope"></i> melinda@gmail.com
          </a>
        </aside>
      </section>
    `;
  },
};

export default AboutPage;