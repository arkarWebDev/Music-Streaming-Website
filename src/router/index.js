import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ManageView from "../views/ManageView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import SongView from "../views/SongView.vue";

let routes = [
  {
    path : "/",
    name : "home",
    component : HomeView
  },
  {
    path : "/manage",
    alies : "/manage-music",
    name : "manage" ,
    component : ManageView
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
