<template>
  <div
    class="text-white text-center font-bold p-4 mb-4 rounded"
    v-if="processingLogin"
    :class="login_alert_bg"
  >
    {{ login_alert_msg }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="loginFormSubmitted">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "LoginForm",
  data() {
    return {
      loginSchema: {
        email: "required|email",
        password: "required",
      },
      processingLogin: false,
      login_alert_bg: "bg-gray-800",
      login_alert_msg: "Please wait! We are logging you in.",
    };
  },
  methods: {
    ...mapActions(useUserStore, ["login"]),

    async loginFormSubmitted(values) {
      this.processingLogin = true;

      try {
        await this.login(values);
      } catch (error) {
        this.login_alert_bg = "bg-red-600";
        this.login_alert_msg = "Wrong infomation! Retry";
        return;
      }
      this.login_alert_bg = "bg-green-500";
      this.login_alert_msg = "Success! You are now logged in.";
    },
  },
};
</script>
