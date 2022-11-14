<template>
  <div>
    <div class="section property_upload">
      <div>
        <div class="payment_container">
          <div class="payment_section pr-30">
            <h3>Payment</h3>
            <el-divider></el-divider>
            <div>
              <p>Select payment media</p>
              <div class="payment_methods">
                <p
                  v-for="method in paymentMedia"
                  :key="method.method"
                  @click="changePaymentMedia(method.method)"
                  :style="
                    media == method.method && {
                      background: '#1e293b',
                      'border-radius': '5px',
                      color: '#fff',
                    }
                  "
                  class="p-10 selected_media"
                >
                  <i :class="method.icon"></i>
                  <span class="pl-5">{{ method.method }} </span>
                </p>
              </div>
              <div v-if="media == 'Pay with Momo'" class="pt-20">
                <p>For payment using your mobile money wallets</p>
                <div class="d-flex_column pt-10">
                  <span class="demo-input-label pl-10 pb-5"
                    >Service provider</span
                  >
                  <el-select
                    name=""
                    id=""
                    class="provider"
                    placeholder="Please select a service provider"
                    v-model="mobile"
                  >
                    <el-option
                      v-for="media in mobile_money"
                      :key="media"
                      :value="media"
                    >
                      {{ media }}
                    </el-option>
                  </el-select>
                </div>
                <div class="d-flex_column pt-10">
                  <span class="demo-input-label pl-10 pb-5">Phone number</span>
                  <el-input
                    type="number"
                    v-model="selectedPlan.mobile_money_number"
                    placeholder="+233 21 324 2334"
                  />
                </div>
              </div>
              <div v-else class="pt-20">
                <p class="py-10">For payment through bank account.</p>
                <div class="d-flex_column pt-10">
                  <span class="demo-input-label pl-10 pb-5"
                    >Card holder name</span
                  >
                  <el-input
                    v-model="selectedPlan.card_payment.name_on_card"
                    placeholder="Enter the card holder name"
                  />
                </div>
                <div class="d-flex_column pt-10">
                  <span class="demo-input-label pl-10 pb-5">Card Number</span>
                  <el-input
                    type="number"
                    v-model="selectedPlan.card_payment.card_number"
                    placeholder="0000 0000 0000 0000"
                  />
                  <section class="pt-10">
                    <span class="demo-input-label pt-5">CVV</span>
                    <el-input
                      v-model="selectedPlan.card_payment.cvv"
                      placeholder="CVV"
                    />
                  </section>
                </div>
                <div class="d-flex pt-10">
                  <section class="pr-10">
                    <span class="demo-input-label pl-10 pb-5"
                      >Expiry month</span
                    >
                    <el-input
                      type="number"
                      v-model="selectedPlan.card_payment.card_expiry_month"
                      placeholder="05"
                    />
                  </section>
                  <section class="">
                    <span class="demo-input-label pl-10 pb-5">Expiry Year</span>
                    <el-input
                      type="number"
                      v-model="selectedPlan.card_payment.card_expiry_year"
                      placeholder="2022"
                    />
                  </section>
                </div>
                <!-- <div class="py-30">
                <el-button type="primary" class="full_width"
                  >Proceed to payment</el-button
                >
              </div> -->
              </div>
            </div>
          </div>
          <div class="payment_section pl-30">
            <div class="discount">
              <section class="d-flex justify_between pb-5">
                <span>Discount code</span>
                <!-- <span>**Required</span> -->
              </section>
              <div class="d-flex">
                <el-input v-model="discount_code" />
                <el-button @click="checkDiscountCode" :loading="codeLoading">
                  Verify <i class="el-icon-arrow-right"></i>
                </el-button>
              </div>
            </div>
            <div class="property_rental pt-20">
              <section class="d-flex justify_between">
                <span>Property {{ category }}</span>
                <span>$12.567</span>
              </section>
              <section class="d-flex justify_between py-10">
                <h5>Subtotal:</h5>
                <h5>$24.32</h5>
              </section>
            </div>
          </div>
        </div>
        <div class="payment_btn pb-30">
          <el-button
            type="primary"
            :loading="btnLoading"
            class="full_width"
            @click="sendPayment"
            :disabled="!submitVal"
            >Proceed to payment</el-button
          >
        </div>
      </div>
      <el-dialog
        title="Verification of payment"
        :visible.sync="payment_prompt"
        width="50%"
        center
      >
        <span
          >You will receive a prompt on your phone to authorize payment. After
          payment, click on verify to complete payment process within this time
          frame</span
        >
        <p class="center pt-10">
          <b> {{ this.minute }}:{{ this.countDown }}</b>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelVerification">Cancel</el-button>
          <el-button type="primary" @click="toVerification">Verify</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IMixinState } from '@/types/mixinsTypes';
import ApplicationHandler from '@/handlers/ApplicationHandler.vue';

export default Vue.extend({
  auth: false,
  name: 'checkoutPage',
  components: {
    ApplicationHandler,
  },
  watch: {
    minute(min) {
      min == 0 &&
        this.payment_prompt == true &&
        this.$router.push({
          name: 'payment-condition',
          // params: { property: property.id },
          query: {
            verification: 'failed',
            listing_id: this.listing_id,
            plan_id: this.listing_plan_id,
            category: this.category,
          },
        });
    },
  },
  data() {
    return {
      countDown: 0 as number,
      payment_prompt: false,
      minute: 5 as number,
      timerOut: null as any,
      showPaymentModal: false,
      propertySelected: false as boolean,
      media: 'Pay with Momo' as string,
      codeLoading: false,
      paymentMedia: [
        { method: 'Pay with Momo', icon: 'el-icon-mobile-phone' },
        { method: 'Pay with card', icon: 'el-icon-bank-card' },
      ],
      mobile_money: ['MTN Mobile money', 'Vodafone Cash', 'Zeepay'],
      mobile: '',
      btnLoading: false as boolean,
      discount_code: '' as string,
      listing_plan_id: null as any,
      category: null as any,
      listing_id: null as any,
      discount: {
        no_of_days: 0,
        percentage_value: 0,
      },
      selectedPlan: {
        listing_id: '',
        listing_planid: '',
        discount_code: '',
        payment_option: '',
        card_payment: {
          cvv: '',
          name_on_card: '',
          card_number: '',
          card_expiry_month: '',
          card_expiry_year: '',
        },
        mobile_money_number: '',
      },
    };
  },

  created() {
    console.log(this.$route.query);
    this.listing_plan_id = this.$route.query.plan_id;
    this.listing_id = this.$route.query.listing_id;
    this.category = this.$route.query.category;
    console.log(this.listing_plan_id);
  },
  computed: {
    submitVal() {
      let valid = false;
      if (
        this.media == 'Pay with Momo' &&
        this.selectedPlan.mobile_money_number != ''
      ) {
        valid = true;
      } else if (
        this.media == 'Pay with card' &&
        this.selectedPlan.card_payment.cvv != '' &&
        this.selectedPlan.card_payment.name_on_card != '' &&
        this.selectedPlan.card_payment.card_expiry_month != '' &&
        this.selectedPlan.card_payment.card_expiry_year != ''
      ) {
        valid = true;
      }
      return valid;
    },
  },
  methods: {
    cancelVerification() {
      this.payment_prompt = false;
      clearTimeout(this.timerOut);
      this.timerOut = null;
      console.log('cancel');
    },
    toVerification() {
      this.$router.push({
        name: 'payment-condition',
        // params: { property: property.id },
        query: {
          verification: 'success',
        },
      });
    },
    countDownTimer() {
      if (this.countDown == -1) {
        this.minute--;
        this.countDown = 5;
      }
      this.timerOut = setTimeout(() => {
        this.countDown -= 1;
        this.countDownTimer();
      }, 1000);
    },
    async checkDiscountCode() {
      console.log('discount');
      //
      this.codeLoading = true;
      const verifyQuery = `${this.discount_code}&listing_plan_id=${this.listing_plan_id}&listing_id=${this.listing_id}`;
      try {
        const discountCodeResponse = await this.$verifydiscountApi.query(
          verifyQuery
        );
        console.log(discountCodeResponse);
        this.codeLoading = false;

        (this as any as IMixinState).$message({
          showClose: true,
          message: 'Discount code verified, proceed to payment',
          type: 'success',
        });

        // this.$router.replace("/");
      } catch (error: any) {
        console.log(error, 'error');
        (this as any as IMixinState).catchError(error);
        this.codeLoading = false;

        if (error?.response?.data) {
          (this as any as IMixinState).$message({
            showClose: true,
            message: error.response.data.message,
            type: 'error',
          });
        }
      }
    },
    changePaymentMedia(method: string) {
      this.selectedPlan.card_payment.cvv = '';
      this.selectedPlan.card_payment.name_on_card = '';
      this.selectedPlan.card_payment.card_number = '';
      this.selectedPlan.card_payment.card_expiry_month = '';
      this.selectedPlan.card_payment.card_expiry_year = '';
      this.selectedPlan.mobile_money_number = '';
      this.media = method;
    },
    async sendPayment() {
      this.btnLoading = true;

      try {
        const data = {
          listing_id: this.listing_id,
          listing_plan_id: this.listing_plan_id,
          discount_code: this.discount_code,
          payment_option:
            this.media == 'Pay with Momo' ? 'mobile_money' : 'card_payment',
          card_pament: {
            cvv: this.selectedPlan.card_payment.cvv,
            name_on_card: this.selectedPlan.card_payment.name_on_card,
            card_expiry_month: this.selectedPlan.card_payment.card_expiry_month,
            card_expiry_year: this.selectedPlan.card_payment.card_expiry_year,
          },
          mobile_money_number: this.selectedPlan.mobile_money_number,
        };
        const selectdPlanResponse = await this.$SelectdPlanApi.create(data);
        console.log(selectdPlanResponse);
        this.btnLoading = false;

        // (this as any as IMixinState).$message({
        //   showClose: true,
        //   message: selectdPlanResponse.message,
        //   type: "success",
        // });
        this.payment_prompt = true;
        this.countDown = 0;
        this.minute = 5;
        this.countDownTimer();

        // this.$router.replace("/");
      } catch (error: any) {
        console.log(error, 'error');
        (this as any as IMixinState).catchError(error);
        this.btnLoading = false;

        if (error?.response?.data) {
          (this as any as IMixinState).$message({
            showClose: true,
            message: error.response.data.message,
            type: 'error',
          });
        }
      }
    },
  },
});
</script>

<style lang="scss">
$small_screen: 426px;
$medium_screen: 769px;

.payment_container {
  display: flex;
  padding-bottom: 30px;
  @media (max-width: $medium_screen) {
    flex-direction: column;
  }
  .discount {
    background: #f1f5f9;
    border-radius: 8px;
    padding: 20px;
  }
  .payment_section {
    width: 50%;
    @media (max-width: $medium_screen) {
      width: 80%;
      margin: 0 auto;
      padding-right: 0 !important;
      padding-left: 0 !important;
      padding-top: 20px;
    }
    @media (max-width: $small_screen) {
      width: 100%;
      padding-right: 0 !important;
      padding-left: 0 !important;
    }
    .payment_methods {
      display: flex;
      background: #f8fafc;
      padding-left: 10px;
      border-radius: 8px;
      @media (max-width: 320px) {
        flex-direction: column;
      }
    }
  }
}
.payment_btn {
  width: 50%;
  padding-right: 30px;
  @media (max-width: $medium_screen) {
    width: 80%;
    margin: 0 auto;
    padding-right: 0;
  }
}
</style>
