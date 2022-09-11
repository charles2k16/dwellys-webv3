<template>
  <div>
    <div class="g-signin2" data-onsuccess="onSignIn">Google</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { IMixinState } from "@/types/mixinsTypes";

export default Vue.extend({
  name: "LoginPage",

  data() {
    return {
      showVerifyInfo: false,
      btnLoading: false as boolean,
      loginForm: {
        email: "" as string,
        password: "" as string,
      },
      validation: {
        email: [
          {
            required: true,
            type: "email",
            message: "Please enter valid email",
            trigger: ["blur", "change"],
          },
          { min: 5, message: "Length should be 5 or more", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    user() {
      return this.$auth.user;
    },
  },
  created() {
    function onSignIn(googleUser: any) {
      var profile = googleUser.getBasicProfile();
      console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log("Name: " + profile.getName());
      console.log("Image URL: " + profile.getImageUrl());
      console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
    }
  },
});
</script>
