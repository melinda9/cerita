import HomePresenter from '../pages/home/home-presenter.js';
import HomeView from '../pages/home/home-page.js';
import AboutPresenter from '../pages/about/about-presenter.js';
import AboutView from '../pages/about/about-view.js';
import UserModel from '../data/user-model.js';
import LoginPresenter from '../pages/login/login-presenter.js';
import RegisterPresenter from '../pages/register/register-presenter.js';
import AddPresenter from '../pages/add/add-presenter.js';
import DetailPresenter from '../pages/detail/detail-presenter.js';
import DetailView from '../pages/detail/detail-page.js';
import OfflinePresenter from '../pages/offline/offline-presenter.js';
import NotFoundPresenter from '../pages/notfound/notfound-presenter.js';
import UrlParser from './url-parser.js';
import * as Repository from '../data/repository.js';
import { withViewTransition } from '../utils/view-transition.js';
import AddView from '../pages/add/add-page.js';
import * as CameraUtils from '../utils/camera.js';


const routes = {
  '/offline': {
    init: () => OfflinePresenter.init()
  },
  '/': {
    init: () => HomePresenter.init({ view: HomeView, model: Repository, withViewTransition })
  },
  '/home': {
    init: () => HomePresenter.init({ view: HomeView, model: Repository, withViewTransition })
  },
  '/login': LoginPresenter,
  '/register': RegisterPresenter,
  '/add': {
    init: () => AddPresenter.init({
      view: AddView,
      model: Repository,
      cameraUtils: CameraUtils
    })
  },
  '/about': {
    init: () => AboutPresenter.init({ view: AboutView, model: UserModel }),
    afterRender: () => AboutPresenter.afterRender({ view: AboutView })
  },
  '/detail/:id': {
    init: () => DetailPresenter.init({
      view: DetailView,
      model: {
        getToken: () => localStorage.getItem("token"),
        getStoryById: Repository.getStoryById
      },
      urlParser: UrlParser
    })
  },
  // Not Found fallback
  '*': {
    init: () => NotFoundPresenter.init()
  },
};

export default routes;