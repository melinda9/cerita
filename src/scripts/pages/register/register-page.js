const RegisterPage = {
  render(container, onSubmitCallback) {
    container.innerHTML = this.getTemplate();
    this._initListeners(onSubmitCallback);
  },

  getTemplate() {
    return `
      <section class="register-section">
        <h2>Daftar Akun Baru</h2>
        <form id="register-form" class="form-animated">
          <label for="name">Nama Lengkap</label>
          <input type="text" id="name" name="name" placeholder="Nama Lengkap" required />

          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Password" required />

          <button type="submit" class="submit-btn">Daftar</button>
        </form>
        <div id="register-message" class="message-container"></div>
      </section>
    `;
  },

  showMessage(text, type) {
    const messageContainer = document.getElementById("register-message");
    if (messageContainer) {
      messageContainer.textContent = text;
      messageContainer.className = `message-container ${type}-message`;
    }
  },

  _initListeners(onSubmitCallback) {
    const form = document.getElementById("register-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      onSubmitCallback({ name, email, password });
    });
  },
};

export default RegisterPage;