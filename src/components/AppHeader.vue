<template>
  <header id="header" class="bg-purple-600">
    <nav class="container mx-auto flex justify-between items-center py-5 px-4 w-full">
      <!-- App Name -->
      <div>
        <router-link
          class="text-white font-bold uppercase text-2xl mr-4"
          to="/"
          exact-active-class="no-active"
          >Vuetify</router-link
        >
      </div>

      <div class="flex items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!this.userIsLogin">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuth"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" to="/manage">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logout">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";

export default {
  name: "AppHeader",
  computed: {
    ...mapWritableState(useModalStore, ["isOpen"]),
    ...mapWritableState(useUserStore, ["userIsLogin"]),
  },
  methods: {
    ...mapActions(useUserStore, ["logout"]),
    toggleAuth() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>
