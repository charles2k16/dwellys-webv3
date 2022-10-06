<template>
  <div class="payment_condition">
    <div v-if="verification != 'failed'">
      <!-- <div><span class="material-icons success"> check_circle </span></div> -->
      <div>
        <img src="../assets/svg/success.png" />
      </div>
      <h3 class="py-20">Your transaction was successful</h3>
      <p class="pb-10">Total of GHS100.00 was payed for Quick Deals</p>
      <NuxtLink to="/"
        ><el-button :type="'primary'" class="btn_sm"
          >Go to listings page</el-button
        ></NuxtLink
      >
    </div>
    <div v-else>
      <!-- <div><span class="material-icons unsuccessful"> cancel </span></div> -->
      <div>
        <img src="../assets/svg/unsuccessful.png" />
      </div>
      <h3 class="py-20">Your transaction Failed</h3>
      <p class="pb-10">
        Unfortunately, your transaction failed, please try again
      </p>
      <el-button :type="'primary'" class="btn_sm" @click="toPayment"
        >Try again</el-button
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
      verification: null as any,
      listing_plan_id: null as any,
      category: null as any,
      listing_id: null as any,
    };
  },
  methods: {
    toPayment() {
      this.$router.replace({
        name: "checkout",
        query: {
          listing_id: this.listing_id,
          plan_id: this.listing_plan_id,
          category: this.category,
        },
      });
    },
  },
  created() {
    this.verification = this.$route.query.verification;
    this.listing_plan_id = this.$route.query.plan_id;
    this.listing_id = this.$route.query.listing_id;
    this.category = this.$route.query.category;
  },
});
</script>

<style lang="scss" scoped>
.payment_condition {
  width: 50%;
  margin: 100px auto;
  padding-top: 50px;
  height: 600px;
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
