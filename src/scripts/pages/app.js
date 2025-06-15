import UrlParser from '../routes/url-parser.js';
import routes from '../routes/routes.js';
import Navbar from '../components/navbar.js';
import { isServiceWorkerAvailable } from '../utils';
import { generateSubscribeButtonTemplate, generateUnsubscribeButtonTemplate } from '../templates';
import { subscribe, isCurrentPushSubscriptionAvailable, unsubscribe } from '../utils/notification-helper';

const App = {
  previousPage: null,
  lastRoute: null,

  // Ensure push-notification-tools is rendered before calling setupPushNotification
  async setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    if (!pushNotificationTools) {
      console.error('Element push-notification-tools not found in DOM');
      return;
    }

    // Gunakan cache status subscribe agar tidak auto-refresh ke subscribe sebelum user klik unsubscribe
    // Perbaikan: cek status subscribe hanya saat pertama kali load, dan JANGAN reset _isSubscribed di renderPage
    if (typeof this._isSubscribed === 'undefined') {
      this._isSubscribed = await isCurrentPushSubscriptionAvailable();
    }

    if (this._isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
      const unsubBtn = document.getElementById('unsubscribe-button');
      unsubBtn.addEventListener('click', async () => {
        await unsubscribe();
        this._isSubscribed = false;
        this.setupPushNotification();
      });
      return;
    }

    pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
    const subBtn = document.getElementById('subscribe-button');
    subBtn.addEventListener('click', async () => {
      await subscribe();
      this._isSubscribed = true;
      this.setupPushNotification();
    });
  },

  async renderPage() {
    const token = localStorage.getItem("token");
    console.log("Token exists:", !!token);
    const url = UrlParser.parseActiveUrl();
    const content = document.querySelector("#main-content");
    const navbar = document.querySelector("#navbar");

    const routeKey = UrlParser.parseActiveUrlWithCombiner();
    if (routeKey === this.lastRoute) {
      return;
    }
    this.lastRoute = routeKey;

    const protectedRoutes = ["/home", "/add", "/about", "/detail/:id"];
    const isProtectedRoute = protectedRoutes.includes(routeKey);
    const isAuthPage = url.resource === "login" || url.resource === "register";

    if (isAuthPage && token) {
      console.log("Redirecting to /home: Already logged in, token exists");
      window.location.hash = '#/home';
      return;
    }

    if (isProtectedRoute && !token) {
      console.log("Redirecting to login: No token for protected route", routeKey);
      window.location.hash = "#/login";
      return;
    }

    let page = routes[routeKey];
    if (!page) {
      page = routes['*'];
    }

    if (this.previousPage?.beforeLeave) {
      if (typeof this.previousPage.beforeLeave === 'function') {
        await this.previousPage.beforeLeave();
      }
    }

    if (!isAuthPage && navbar) {
      await Navbar.render();
    } else {
      navbar.innerHTML = "";
    }

    content.innerHTML = "";
    try {
      await page.init();
      if (page.afterRender) {
        await page.afterRender();
      }
      console.log("After render executed for route:", routeKey);
    } catch (error) {
      console.error("Render error for route:", routeKey, ":", error);
      content.innerHTML = "<p>Error rendering page</p>";
    }

    this.previousPage = page;

    // Jangan reset this._isSubscribed setiap renderPage agar status tombol tetap konsisten
    if (isServiceWorkerAvailable()) {
      // Selalu panggil setupPushNotification agar tombol tetap sinkron dengan status subscription,
      // tapi cache status _isSubscribed hanya diubah oleh aksi subscribe/unsubscribe, bukan setiap renderPage
      this.setupPushNotification();
    }
  },
};

// Ensure setupPushNotification is called after DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
  App.setupPushNotification();
});

export default App;