import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DownloadAppView from '../views/DownloadAppView.vue'
import ManageView from "../views/ManageView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import SongView from "../views/SongView.vue";
import HelpView from "../views/HelpView.vue";

let routes = [
  {
    path : "/",
    name : "home",
    component : HomeView
  },
  {
    path : "/download",
    alias : '/download-app',
    name : "download",
    component : DownloadAppView
  },
  {
    path : "/manage",
    alies : "/manage-music",
    name : "manage" ,
    component : ManageView
  },
  {
    path : "/help-center",
    alies : "/help",
    name : "help",
    component : HelpView
  },
  {
    path : "/play-song/:id",
    name : "play",
    component : SongView
  },
  {
    path : "/:pathMatch(.*)*",
    name : "notFound",
    component : NotFoundView
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "font-black",
});

export default router
