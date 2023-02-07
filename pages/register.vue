<template>
  <div class="section registerForm_content">
    <div class="social_register_container">
      <div class="pb-20">
        <h3>Create an account</h3>
        <p class="mt-10">Provide information about yourself for identity</p>
      </div>
      <div class="social_register">
        <div class="facebook" @click="facebookSignIn">
          <img src="~/assets/img/facebook.png" width="25px" />
          <p class="pl-5">Register with Facebook</p>
        </div>
        <div class="google" type="info" @click="googleSignIn">
          <img src="~/assets/img/google.png" />
          <p>Register with Google</p>
        </div>
      </div>
    </div>

    <hr class="hr_rule" />

    <div class="registerForm_form">
      <el-form
        ref="registerForm"
        :model="registerForm"
        label-position="top"
        :rules="validation"
      >
        <div class="personal_info_section pb-20">
          <div class="registerForm_label">
            <h4>Name</h4>
          </div>

          <div class="form_div">
            <el-row class="first_last">
              <el-col :xs="24" :sm="12" class="register_first_name">
                <el-form-item label="First Name" prop="first_name">
                  <el-input
                    v-model="registerForm.first_name"
                    placeholder="First name"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="Last Name" prop="last_nname">
                  <el-input
                    v-model="registerForm.last_name"
                    placeholder="Last Name"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="24">
                <el-form-item label="Date of Birth" prop="dob">
                  <el-date-picker
                    v-model="registerForm.dob"
                    type="date"
                    placeholder="Pick a day"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="24">
                <el-form-item label="Password" prop="password">
                  <el-input v-model="registerForm.password" type="password">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="24">
                <el-form-item label="Confirm Password" prop="confirm_password">
                  <el-input
                    v-model="registerForm.confirm_password"
                    type="password"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <hr class="hr_rule" />

        <div class="contact_info_section pb-20">
          <div class="registerForm_label">
            <h4>Contact information</h4>
          </div>
          <div class="form_div">
            <el-form-item label="Email address" prop="email">
              <el-input
                v-model="registerForm.email"
                type="email"
                placeholder="Enter email"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="Phone number">
              <vue-phone-number-input
                v-model="phone"
                :border-radius="7"
                default-country-code="GH"
                @update="onPhoneUpdate"
              />
            </el-form-item>

            <div class="mt-10">
              <small>
                By selecting Agree and continue, I agree to Dwellys Terms of
                Service, Payments Terms of Service, and Nondiscrimination Policy
                and acknowledge the Privacy Policy.</small
              >
            </div>
            <div class="mt-20 register_btn">
              <el-button
                class="submit_register_button"
                type="primary"
                :loading="loading"
                @click="userRegister"
                >Agree and continue</el-button
              >
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="user_registerForm_footer">
      <div class="pb-10">
        <img src="~/assets/img/logo.jpg" class="user_img_logo" />
      </div>
      <small>
        Dwellys International Limited (dwellys) is a company registered in Ghana
        with company registration number CS234262018 at 8th Floor, Silver Star
        Tower, Airport City, Accra - Ghana.
      </small>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import { IMixinState } from '@/types/mixinsTypes';

export default Vue.extend({
  auth: false,
  name: 'registerFormPage',
  components: {
    VuePhoneNumberInput,
  },
  data() {
    var validatePass = (rule: any, value: string, callback: any) => {
      if (value === '') {
        callback(new Error('Please input the password'));
      } else {
        if ((this as any).registerForm.confirm_password !== '') {
          (this as any).$refs.registerForm.validateField('confirm_password');
        }
        callback();
      }
    };
    var validatePass2 = (rule: any, value: string, callback: any) => {
      if (value === '') {
        callback(new Error('Please input the password again'));
      } else if (value !== (this as any).registerForm.password) {
        callback(new Error("Password don't match!"));
      } else {
        callback();
      }
    };
    return {
      phone: '',
      loading: false,
      countries: [],
      registerForm: {
        first_name: '' as string,
        last_name: '' as string,
        dob: '' as string,
        email: '' as string,
        password: '' as string,
        confirm_password: '',
        phone_number: '' as string,
        sign_up_mode: 'email' as string,
        user_type: 'visitor' as string,
        country_id: '' as string,
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
        first_name: [
          {
            required: true,
            message: 'Please enter your first name',
            trigger: ['blur', 'change'],
          },
        ],
        last_name: [
          {
            required: true,
            message: 'Please enter your last name',
            trigger: ['blur', 'change'],
          },
        ],
        password: [{ validator: validatePass, trigger: 'blur' }],
        confirm_password: [{ validator: validatePass2, trigger: 'blur' }],
      },
    };
  },
  async created() {
    const countries = await this.$countriesApi.index();
    countries.data.filter((country: any) =>
      country.short_name == 'GH'
        ? (this.registerForm.country_id = country.id)
        : ''
    );
    this.countries = countries.data;
  },
  methods: {
    onPhoneUpdate(e: any) {
      this.countries.filter((country: any) =>
        country.short_name == e.countryCode
          ? (this.registerForm.country_id = country.id)
          : ''
      );
      this.registerForm.phone_number = e.formattedNumber;
    },
    userRegister() {
      this.loading = true;
      (this as any).$refs.registerForm.validate((valid: boolean) => {
        if (valid) {
          console.log(this.registerForm);
          this.signUp();
          // this.$router.replace("/login");
        } else {
          this.loading = false;
          (this as any as IMixinState).getNotification(
            'Make sure all required fields are filled',
            'error'
          );
        }
      });
    },
    async signUp(): Promise<void> {
      const data = {
        first_name: this.registerForm.first_name,
        last_name: this.registerForm.last_name,
        dob: this.$moment(this.registerForm.dob).format('YYYY-MM-DD h:mm:ss'),
        email: this.registerForm.email,
        password: this.registerForm.password,
        confirm_password: this.registerForm.confirm_password,
        phone_number: this.registerForm.phone_number,
        sign_up_mode: this.registerForm.sign_up_mode,
        user_type: this.registerForm.user_type,
        country_id: this.registerForm.country_id,
      };
      console.log(data);
      try {
        const register = await this.$registerApi.create(data);
        this.loading = false;
        this.$confirm(register.message, 'Confirm Email Address', {
          confirmButtonText: 'Continue',
          type: 'success',
        }).then(() => {
          // this.$router.push('/login');
          this.$router.push({
            name: 'profile',
          });
        });
      } catch (error) {
        this.loading = false;
        (this as any as IMixinState).catchError(error);
      }
    },
    facebookSignIn() {
      this.$auth.loginWith('facebook');
    },
    googleSignIn() {
      this.$auth.loginWith('google');
    },
  },
});
</script>

<style lang="scss">
$laptop_screen: 1024px;
$medium_screen: 769px;
$small_screen: 426px;
.registerForm_content {
  padding-top: 40px;
  .register_header_line {
    display: none;
  }
  .social_register_container {
    display: flex;
    justify-content: space-between;
    h3 {
      color: #1e293b;
      font-size: 20px;
      line-height: 24px;
      letter-spacing: -0.03em;
    }
    @media (max-width: $medium_screen) {
      flex-direction: column;
    }
    .social_register {
      display: flex;
      @media (max-width: $medium_screen) {
        justify-content: flex-end;
      }
      @media (max-width: $small_screen) {
        flex-direction: column;
      }
      // .facebook {
      //   background-color: #395697;
      // }
      // .google {
      //   background: #f1f5f9;
      // }
      .facebook,
      .google {
        background: #f1f5f9;
        display: flex;
        min-width: 240px;
        max-width: 250px;
        cursor: pointer;
        margin-bottom: 10px;
        padding: 20px;
        line-height: 10px;
        margin-right: 5px;
        color: #44556f;
        border-radius: 8px;
        @media (max-width: $small_screen) {
          padding: 10px;
          max-width: 100%;
          line-height: 0;
          font-size: 14px;
        }
        p {
          flex: 1;
          text-align: center;
          padding-top: 5px;
          color: #475569;
        }
      }
    }
  }
  .user_registerForm_footer {
    padding: 80px 0 30px;
    width: 20%;
    .user_img_logo {
      width: 100px;
      height: 20px;
    }
  }
  .registerForm_form {
    padding-top: 20px;

    .personal_info_section {
      display: flex;
    }
    .contact_info_section {
      padding-top: 10px;
      display: flex;
    }
    .form_div {
      max-width: 500px;
      width: 100%;
      .register_first_name {
        padding-right: 20px;
        @media (max-width: 768px) {
          padding-right: 0;
        }
      }
    }
  }
  .registerForm_label {
    padding-top: 10px;
    width: 20%;
  }
  .register_btn {
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: $small_screen) {
  .registerForm_content {
    // padding: 0 20px 10px;
    .register_header_line {
      display: block;
      margin-bottom: 20px;
    }
    .registerForm_form {
      .personal_info_section {
        flex-direction: column;
      }
      .contact_info_section {
        flex-direction: column;
      }
      .form_div {
        max-width: 500px;
        width: 100%;
        .register_first_name {
          padding-right: 0;
        }
      }
      .registerForm_label {
        padding-top: 10px;
        width: 100%;
        padding-bottom: 20px;
      }
    }
    .user_registerForm_footer {
      padding: 80px 0 30px;
      width: 100%;
      .user_img_logo {
        width: 75.61px;
        height: 16.3px;
      }
    }
  }
  .register_btn {
    display: block;
    .submit_register_button {
      width: 100%;
    }
  }
}
</style>
