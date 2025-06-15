import NavbarPresenter from "./navbar-presenter";

const Navbar = {
  async render(containerId = "navbar") {
    await NavbarPresenter.init(containerId);
  }
};

export default Navbar;
