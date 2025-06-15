const NavbarView = {
  render() {
    return `
      <nav class="navbar" role="navigation" aria-label="Navigasi Utama">
        <ul class="navbar-list">
          <li><a href="#/home">Beranda</a></li>
          <li><a href="#/offline">Cerita Offline</a></li>
          <li><a href="#/add">Tambah Cerita</a></li>
          <li><a href="#/about">Tentang</a></li>
        </ul>
        <div style="display: flex; gap: 10px;">
          <button id="subscribe-button" class="subscribe-button" aria-label="Langganan Notifikasi" style="background-color: #ffd700; border: none; padding: 10px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-family: 'Segoe UI', 'Roboto', Arial, sans-serif; font-size: 1rem; font-weight: bold; color: #333;">
            <i id="subscribe-icon" class="fa-solid fa-bell" style="color: #333;"></i>
            <span style="font-weight: bold; color: #333;">Subscribe to Notifications</span>
          </button>
          <button id="logoutButton" class="logout-button" aria-label="Keluar dari akun" style="background-color: #ffd700; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-family: 'Segoe UI', 'Roboto', Arial, sans-serif; font-size: 1rem; font-weight: bold; color: #333; text-align: center;">Logout</button>
        </div>
      </nav>
    `;
  },
  showLogoutButton(show) {
    const logoutBtn = document.getElementById("logoutButton");
    if (logoutBtn) logoutBtn.style.display = show ? "inline-block" : "none";
  }
};

export default NavbarView;
