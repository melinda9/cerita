
import RegisterPage from '../register/register-page.js';
import { registerUser } from '../../data/repository.js';
import UserModel from "../../data/user-model.js";

const RegisterPresenter = {
  async init() {

    const token = UserModel.getToken();
    if (token) {
      console.log("Access denied to /register: Already logged in");
      window.location.hash = "#/home";
      return;
    }

    const container = document.querySelector('#main-content');
    RegisterPage.render(container, this._handleRegister.bind(this));
  },

  async _handleRegister({ name, email, password }) {
    try {
      await registerUser(name, email, password);
      RegisterPage.showMessage("Registrasi berhasil! Silakan login.", "success");
      setTimeout(() => {
        window.location.hash = "#/login";
      }, 1500);
    } catch (error) {
      // Tampilkan pesan error spesifik jika ada
      const msg = error?.message || "Gagal daftar. Coba lagi ya.";
      RegisterPage.showMessage(msg, "error");
    }
  }
};

export default RegisterPresenter;