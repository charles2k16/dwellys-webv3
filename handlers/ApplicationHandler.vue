<template>
  <div>
    <!-- Login dialog -->
    <el-dialog
      :visible.sync="showLoginModal"
      width="60%"
      :destroy-on-close="true"
      custom-class="login_modal"
    >
      <template slot="title">
        <h3 class="">Login or sign in</h3>
      </template>
      <LoginForm @closeLoginModal="showLoginModal = false" />
    </el-dialog>

    <el-dialog
      :visible.sync="photoModal"
      width="40%"
      :destroy-on-close="true"
      custom-class="mobile-modal"
    >
      <template slot="title">
        <h3>Upload your photo</h3>
      </template>
      <PropertyPhotoUpload @avatar="userAvatar" />
    </el-dialog>
    <el-dialog
      :visible.sync="messageModal"
      width="40%"
      :destroy-on-close="true"
      custom-class="mobile-modal"
    >
      <template slot="title">
        <h3>Send a message</h3>
      </template>
      <SendMessage :user="user" @closeMessageModal="messageModal = false" />
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ApplicationHandler",
  data() {
    return {
      loginEmail: "" as string,
      showLoginModal: false as boolean,
      photoModal: false as boolean,
      messageModal: false as boolean,
      user: {} as any,
    };
  },
  methods: {
    showLogin(): void {
      this.showLoginModal = true;
    },
    showPhotoModal(): void {
      this.photoModal = true;
    },
    closePhotoModal(): void {
      this.photoModal = false;
    },
    showMessageModal(user: any): void {
      this.user = user;
      console.log(user);

      this.messageModal = true;
    },
    closemessageModal(): void {
      this.messageModal = false;
    },
    userAvatar(file: Object) {
      this.$emit("avatar", file);
      this.photoModal = false;
    },
  },
});
</script>
<style scoped></style>
