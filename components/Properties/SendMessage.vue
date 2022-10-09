<template>
  <el-row>
    <hr class="hr_rule" />
    <div class="d-flex pb-20 pt-10">
      <img class="agent_avatar" :src="apiUrl + '/' + user.user.avatar" />
      <div class="ml-20">
        <p>{{ user.user.first_name }} {{ user.user.last_name }}</p>
        <p style="font-size: 12px; color: #64748b">
          {{ user.user.user_type == "lister" ? "Independent agent" : "Admin" }}
        </p>
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
      <a
        :href="`https://wa.me/${contact}?text=${message}?url${user.url}`"
        target="_blank"
        ><el-button type="primary" @click="sendMessage"
          >Send message</el-button
        ></a
      >
    </div>
  </el-row>
</template>

<script lang="ts">
import Vue from "vue";
import { IMixinState } from "@/types/mixinsTypes";

export default Vue.extend({
  name: "SendMessage",
  props: {
    user: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      message: "" as string,
      contact: "" as string,
    };
  },
  created() {
    const user = this.$auth.user;
    this.contact = user.phone_number;
    console.log("auth", user);
  },
  methods: {
    cancelMessage() {
      this.$emit("closeMessageModal");
    },
    sendMessage() {
      if (this.$auth.loggedIn) {
        // window.location.href = "https://wa.me/+233556031977?text=hello%20world"
        // (this as any as IMixinState).getNotification(
        //   "Message Sent Successfully!",
        //   "success"
        // );
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

<style lang="scss">
.agent_avatar {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
}
</style>
