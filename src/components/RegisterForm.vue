<template>
  <div
    class="text-white text-center font-bold p-4 mb-4 rounded"
    v-if="processingRegister"
    :class="register_alert_bg"
  >
    {{ register_alert_msg }}
  </div>
  <vee-form
    :validation-schema="schema"
    :initial-values="userData"
    @submit="registerFormSubmitted"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        type="text"
        name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        type="number"
        name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        type="password"
        name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Myanmar">Myanmar</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="pl-6">
      <vee-field
        type="checkbox"
        name="tos"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        value="1"
      />
      <label class="inline-block">Accept terms of service</label>
    </div>
    <ErrorMessage class="text-red-600" name="tos" />
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700 mt-3"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "RegisterForm",
  data() {
    return {
      schema: {
        name: "required|min:5|max:20|alpha_spaces",
        email: "required|min:3|email",
        age: "required|numeric|min_value:18|max_value:100",
        password: "required|min:6",
        confirm_password: "required|password_mismatch:@password",
        country: "required|country_excluded:Myanmar",
        tos: "tos",
      },
      userData: {
        country: "USA",
      },
      processingRegister: false,
      register_alert_bg: "bg-gray-800",
      register_alert_msg: "Please wait! We are registering you in.",
    };
  },
  emits: ["registerSuccess"],
  methods: {
    ...mapActions(useUserStore, ["register"]),

    async registerFormSubmitted(values) {
      this.processingRegister = true;

      try {
        await this.register(values);
      } catch (err) {
        this.register_alert_bg = "bg-red-600";
        this.register_alert_msg = "Unexpected error occured ! Please try again later.";
        return;
      }

      this.register_alert_bg = "bg-green-500";
      this.register_alert_msg = "Success! You are now registered in.";

      this.$emit("registerSuccess");
    },
  },
};
</script>
