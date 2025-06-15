
import LoginPage from "../login/login-page.js";
import { loginUser } from "../../data/repository.js";
import UserModel from "../../data/user-model.js";

const LoginPresenter = {
  async init() {

    const token = UserModel.getToken();
    if (token) {
      console.log("Access denied to /login: Already logged in");
      window.location.hash = "#/home";
      return;
    }

    const container = document.querySelector('#main-content');
    LoginPage.render(container, this._handleLogin.bind(this));
  },

  async _handleLogin({ email, password }) {
    try {
      const token = await loginUser(email, password);
      localStorage.setItem("token", token); // Simpan token via Model jika ingin lebih konsisten
      window.location.hash = "#/home";
    } catch (error) {
      LoginPage.showError(`Login gagal: ${error.message}`);
    }
  }
};

export default LoginPresenter;