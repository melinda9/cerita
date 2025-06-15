const LoginPage = {
  render(container, onSubmitCallback) {
    container.innerHTML = this.getTemplate();
    this._initListeners(onSubmitCallback);
  },

  getTemplate() {
    return `
      <section class="login-section">
        <h2>Login ke Website StoryIn</h2>
        <form id="loginForm" class="form-animated">

          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Password" required />

          <button type="submit" class="submit-btn">Login</button>
        </form>

        <p id="error-message" class="error-message"></p>
        <p>Belum punya akun? <a href="#/register" class="register-link">Daftar di sini</a></p>
      </section>
    `;
  },

  showError(message) {
    const errorMessage = document.getElementById("error-message");
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.classList.add("visible");
    }
  },

  _initListeners(onSubmitCallback) {
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      onSubmitCallback({ email, password });
    });
  },
};

export default LoginPage;