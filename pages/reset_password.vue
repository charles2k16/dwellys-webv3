<template>
  <div class="section reset_password">
    <div>
      <div class="forgotten_text mb-20 mt-20">
        <h3>Have you forgotten your password?</h3>
        <p class="text-grey">
          Enter the e-mail address to which you registered your account in the system, and
          we’ll send you reset instructions.
        </p>
      </div>
      <hr class="hr_rule" />

      <div class="reset_div mt-20">
        <el-form
          ref="userAccount"
          :model="name"
          class="client"
          :rules="validation"
          label-position="top">
          <el-form-item label="Email address" prop="email">
            <el-input v-model="name.email" type="email" placeholder="Enter email">
            </el-input>
          </el-form-item>
        </el-form>
        <div class="mt-20 register_btn">
          <el-button
            type="primary"
            class="submit_register_button"
            :loading="loading"
            @click="submitEmail"
            >Send a link to reset password</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IMixinState } from '@/types/mixinsTypes';
import Vue from 'vue';
export default Vue.extend({
  name: 'ForgottenPage',
  auth: false,
  data() {
    return {
      name: {
        email: '' as string,
      },
      loading: false,
      validation: {
        email: [
          {
            required: true,
            type: 'email',
            message: 'Please enter valid email',
            trigger: ['blur', 'change'],
          },
          { min: 5, message: 'Length should be 5 or more', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submitEmail() {
      this.loading = true;
      // (this as any).$refs.name.validate((valid: boolean) => {
      //   if (valid) {
      this.signUp();
      console.log(this.name, 'name');
      // this.$router.replace("/login");
      // }
      // else {
      //   this.loading = false;
      //   (this as any as IMixinState).getNotification(
      //     "Make sure your email is correct!",
      //     "error"
      //   );
      // }
      // });
    },
    async signUp(): Promise<void> {
      try {
        const register = await this.$forgottenPassApi.create(this.name);
        console.log(register);
        this.loading = false;
        this.$confirm(register.message, 'Check your email for further instructions', {
          confirmButtonText: 'Continue',
          type: 'success',
        }).then(() => {
          this.$router.push('/login');
        });
      } catch (error: any) {
        this.loading = false;
        if (error?.response?.data) {
          this.$confirm(error?.response?.data?.message, 'Your email is incorrect!', {
            confirmButtonText: 'Continue',
            type: 'success',
          });
        }
        this.name.email = '';
        (this as any as IMixinState).catchError(error);
      }
    },
  },
});
</script>

<style lang="scss">
$small_screen: 426px;

.forgotten_text {
  max-width: 500px;
  width: 100%;

  h3 {
    padding-bottom: 10px;
    line-height: 28px;
  }
}
.email_btn {
  float: right;
  border-radius: 8px;
  background: var(--button-bg);
  color: white;
}
.reset_div {
  max-width: 500px;
  width: 100%;
  @media (max-width: $small_screen) {
    height: 400px;
  }
}

@media (max-width: $small_screen) {
  .reset_password {
    padding: 0 20px 10px;
  }
}
</style>
