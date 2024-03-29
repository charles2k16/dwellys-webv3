<template>
  <div class="login_content">
    <div class="login_form">
      <div v-if="error">
        <el-alert
          title="Error with signing in"
          type="error"
          :description="errorMessage"
          show-icon
        >
        </el-alert>
        <el-button size="mini" type="primary">Resend Email</el-button>
      </div>
      <br />
      <el-form
        ref="loginForm"
        :model="loginForm"
        label-position="top"
        :rules="validation"
      >
        <el-form-item label="Email address" prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="Enter email"
            prefix-icon="el-icon-message"
          />
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Enter your password"
            show-password
          >
          </el-input>
        </el-form-item>

        <p @click="resetPassword" style="cursor: pointer; color: blue">
          Forgotten password ?
        </p>

        <div class="mt-20">
          <el-button
            type="primary"
            class="btn_lg"
            @click="signIn"
            :loading="btnLoading"
            >Continue</el-button
          >
        </div>
      </el-form>
      <el-col class="separater py-20">
        <div class="first_separater"></div>
        <div class="mx-10 bold">or</div>
        <div class="second_separater"></div>
      </el-col>
      <el-col class="media_login">
        <div class="facebook" @click="openRegister">
          <p>Register</p>
        </div>

        <div class="facebook" @click="facebookSignIn">
          <img src="~/assets/img/facebook.png" width="25px" />
          <p>Continue with Facebook</p>
        </div>
        <div class="google mt-10" type="info" @click="googleSignIn">
          <img src="~/assets/img/google.png" />
          <p>Continue with Google</p>
        </div>
      </el-col>
    </div>
    <div class="login_text">
      <div class="py-20">
        <img src="~/assets/img/login_logo.png" />
      </div>
      <div>
        <p class="pb-20 discover text-white">
          Discover the world’s hub for <span>houses</span> and
          <span class="bold">properties</span> for sale and rent
        </p>
        <p class="text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut metus
          risus aenean mattis. Odio accumsan viverra ipsum tristique lectus
          pellentesque erat.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IMixinState } from '@/types/mixinsTypes';

export default Vue.extend({
  name: 'LoginForm',
  data() {
    return {
      mixinState: this as any as IMixinState,
      btnLoading: false as boolean,
      errorMessage: '' as string,
      error: false,
      loginForm: {
        email: '' as string,
        password: '' as string,
      },
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
    resetPassword() {
      this.$router.push('/reset_password');
      this.$emit('closeLoginModal');
    },
    signIn() {
      this.btnLoading = true;
      (this as any).$refs.loginForm.validate((valid: boolean) => {
        if (valid) {
          this.checkUserVerification();
        } else {
          this.btnLoading = false;
          return false;
        }
      });
    },
    checkUserVerification() {
      this.$auth
        .loginWith('local', {
          data: {
            email: this.loginForm.email,
            password: this.loginForm.password,
          },
        })
        .then((response: any) => {
          this.btnLoading = false;
          const message = response.data.message;
          if (message.includes('email')) {
            this.errorMessage =
              'An email has been set to you in order to complete your registration';
            this.error = true;
          } else {
            this.login(response);
            this.errorMessage = '';
          }
        })
        .catch((error: any) => {
          this.btnLoading = false;
          this.mixinState.catchError(error);
          if (error?.response) {
            this.$notify({
              title: 'Error',
              message: 'Error with signing in',
              type: 'error',
            });
          }
        });
    },
    login(response: any) {
      const { user, token } = response.data.data;

      this.$auth.setUserToken(token);
      this.$auth.setUser(user);
      window.location.reload();
      this.$emit('closeLoginModal');
      this.mixinState.$message({
        showClose: true,
        message: response.data.message,
        type: 'success',
      });
    },
    openRegister() {
      this.$emit('closeLoginModal');
      this.$router.push('/register');
    },
    facebookSignIn() {
      this.$auth
        .loginWith('facebook')
        .then((response: any) => {
          console.log(response);
        })
        .catch((error: any) => {
          console.log(error);
        });
    },
    googleSignIn() {
      this.$auth
        .loginWith('google')
        .then((response: any) => {})
        .catch((error: any) => {
          console.log(error);
        });
    },
  },
});
</script>

<style lang="scss">
$small_screen: 426px;
.login_content {
  display: flex;
  width: 100%;
  .login_form {
    width: 50%;
    padding-right: 20px;
    @media (max-width: $small_screen) {
      width: 100%;
      padding-right: 0;
    }
    .media_login {
      display: flex;
      flex-direction: column;

      .facebook,
      .google,
      .apple {
        background: #f1f5f9;
        display: flex;
        cursor: pointer;
        margin-bottom: 10px;
        padding: 20px;
        line-height: 20px;
        color: #44556f;
        border-radius: 8px;
        @media (max-width: $small_screen) {
          padding: 10px;
          line-height: 0;
          font-size: 14px;
        }
        p {
          flex: 1;
          text-align: center;
        }
      }
    }
    .separater {
      display: flex;
      align-items: center;
      .first_separater,
      .second_separater {
        width: 45%;
        border: 1px solid #e2e8f0;
        height: 2px;
        @media (max-width: $small_screen) {
          width: 43%;
        }
      }
    }
  }
  .login_text {
    // background: linear-gradient(137.93deg, #cf0100 23.72%, #8d0100 84.77%);
    width: 50%;
    padding: 30px;
    color: white;
    @media (max-width: $small_screen) {
      display: none;
    }
    img {
      width: 100px;
    }
    h3 {
      font-size: 26px;
      line-height: 28px;
      word-wrap: break-word;
    }
    .discover {
      font-size: 26px;
      line-height: 28px;
      span {
        font-weight: 700;
        font-size: 24px;
      }
    }
    // background: #f12424;
  }
}
</style>
