const UserModel = {
  getToken() {
    return localStorage.getItem("token");
  },
  removeAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
  }
};

export default UserModel;
