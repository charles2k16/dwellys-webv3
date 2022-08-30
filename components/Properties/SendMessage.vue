<template>
  <el-row>
    <hr class="hr_rule" />
    <div class="d-flex pb-20 pt-10">
      <img src="~/assets/img/user_detail_img.png" />
      <div class="ml-20">
        <p>Abena Dankwa Have</p>
        <p style="font-size: 12px; color: #64748b">Independent agent</p>
      </div>
    </div>
    <hr class="hr_rule" />
    <el-form class="pt-20">
      <el-input
        v-model="message"
        placeholder="Write a message to send"
        type="textarea"
      ></el-input>
    </el-form>
    <div class="d-flex justify_end pt-20">
      <el-button type="info" @click="cancelMessage">Cancel</el-button>
      <el-button type="primary" @click="sendMessage">Send message</el-button>
    </div>
  </el-row>
</template>

<script lang="ts">
import Vue from "vue";
import { IMixinState } from "@/types/mixinsTypes";

export default Vue.extend({
  name: "SendMessage",
  data() {
    return {
      message: "" as string,
    };
  },
  methods: {
    cancelMessage() {
      this.$emit("closeMessageModal");
    },
    sendMessage() {
      if (this.$auth.loggedIn) {
        (this as any as IMixinState).getNotification(
          "Message Sent Successfully!",
          "success"
        );
        this.$emit("closeMessageModal");
      } else {
        (this as any as IMixinState).getNotification(
          "Login to send agent a message!",
          "warning"
        );
      }
    },
  },
});
</script>

<style lang="scss"></style>
