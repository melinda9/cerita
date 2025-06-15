import UserModel from "../data/user-model";
import NavbarView from "./navbar-view";
import { generateSubscribeOptions } from "../utils/notification-helper";

const NavbarPresenter = {
  async init(containerId = "navbar") {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = NavbarView.render();
      NavbarView.showLogoutButton(!!UserModel.getToken());

      const logoutBtn = document.getElementById("logoutButton");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          UserModel.removeAuth();
          window.location.href = "#/login";
        });
      }

      const subscribeButton = document.getElementById("subscribe-button");
      if (subscribeButton) {
        subscribeButton.addEventListener("click", async () => {
          try {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
              const registration = await navigator.serviceWorker.ready;
              const subscription = await registration.pushManager.subscribe(generateSubscribeOptions());

              console.log('Berlangganan berhasil:', subscription);
              alert("Berlangganan notifikasi berhasil.");
              subscribeButton.textContent = "Unsubscribe to Notification";
              // Remove all previous click listeners by cloning
              const newButton = subscribeButton.cloneNode(true);
              subscribeButton.parentNode.replaceChild(newButton, subscribeButton);
              newButton.addEventListener("click", async function unsubscribeHandler() {
                try {
                  await subscription.unsubscribe();
                  console.log("Berhenti berlangganan berhasil.");
                  alert("Berhenti berlangganan notifikasi berhasil.");
                  newButton.textContent = "Subscribe to Notification";
                  // Remove this handler and re-add the subscribe handler
                  const resubButton = newButton.cloneNode(true);
                  newButton.parentNode.replaceChild(resubButton, newButton);
                  resubButton.addEventListener("click", async () => {
                    try {
                      const registration = await navigator.serviceWorker.ready;
                      const subscription = await registration.pushManager.subscribe(generateSubscribeOptions());
                      console.log('Berlangganan berhasil:', subscription);
                      alert("Berlangganan notifikasi berhasil.");
                      resubButton.textContent = "Unsubscribe to Notification";
                      // Recurse to set up unsubscribe again
                      const unsubButton = resubButton.cloneNode(true);
                      resubButton.parentNode.replaceChild(unsubButton, resubButton);
                      unsubButton.addEventListener("click", unsubscribeHandler);
                    } catch (error) {
                      console.error("Gagal berlangganan notifikasi:", error);
                      alert("Gagal berlangganan notifikasi.");
                    }
                  });
                } catch (error) {
                  console.error("Gagal berhenti berlangganan notifikasi:", error);
                  alert("Gagal berhenti berlangganan notifikasi.");
                }
              });
            } else {
              alert("Push Notification tidak didukung di browser ini.");
            }
          } catch (error) {
            console.error("Gagal berlangganan notifikasi:", error);
            alert("Gagal berlangganan notifikasi.");
          }
        });
      }
    }
  }
};

export default NavbarPresenter;
