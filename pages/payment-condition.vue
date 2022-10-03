<template>
  <div class="payment_condition">
    <div v-if="success">
      <div><span class="material-icons success"> check_circle </span></div>
      <h3 class="py-20">Your have successfully made payment!</h3>
      <NuxtLink to="/"
        ><el-button :type="'primary'" class="btn_sm" @click="submit_password"
          >OK
        </el-button></NuxtLink
      >
    </div>
    <div>
      <div><span class="material-icons unsuccessful"> cancel </span></div>
      <h3 class="py-20">Your transaction is unsuccessful!</h3>
      <NuxtLink to="/"
        ><el-button :type="'primary'" class="btn_sm" @click="submit_password"
          >OK
        </el-button></NuxtLink
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "paymentCondition",
  data() {
    return {
      home: "" as string,
      success: true as boolean,
    };
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.payment_condition {
  width: 50%;
  margin: 0 auto;
  padding-top: 50px;
  text-align: center;
  .success {
    color: greenyellow;
    font-size: 150px;
  }
  .unsuccessful {
    color: var(--color-primary);
    font-size: 150px;
  }
}
</style>
