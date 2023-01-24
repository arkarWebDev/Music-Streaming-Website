<template>
  <!-- Header -->
  <app-header></app-header>

  <!-- Introduction -->
  <!-- Main Content -->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <!-- Player -->
  <app-player></app-player>

  <!-- Auth Modal -->
  <app-auth></app-auth>
</template>

<script>
import AppAuth from "./components/AppAuth.vue";
import AppHeader from "./components/AppHeader.vue";
import AppPlayer from "./components/Player.vue";
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "./includes/firebase";

export default {
  name: "App",
  components: {
    AppAuth,
    AppHeader,
    AppPlayer,
  },
  computed: {
    ...mapWritableState(useUserStore, ["userIsLogin"]),
  },
  created() {
    if (auth.currentUser) {
      this.userIsLogin = true;
    }
  },
};
</script>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
