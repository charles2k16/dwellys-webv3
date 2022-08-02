<template>
  <div class="section profile">
    <div class="pt-20">
      <div class="profile_header">
        <div class="d-flex">
          <img
            v-if="listing.avatar"
            :src="url + listing.avatar"
            alt="avatar"
            class="profile_img"
          />

          <img v-else :src="avatar" alt="avatar dummy" class="profile_img" />
          <div class="pl-20 pt-20">
            <p class="pb-5" style="font-size: 22px; font-weight: 600">
              {{ listing.first_name }} {{ listing.last_name }}
            </p>
            <p class="pb-10">
              <small>{{ listing.email }} </small>
            </p>
            <el-upload
              class="upload-demo"
              action="#"
              :multiple="false"
              :auto-upload="false"
              :on-change="getAvatar"
              :show-file-list="false"
            >
              <el-button type="info">Edit profile</el-button>
            </el-upload>
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="nav_scroll">
        <el-tab-pane label="Listings" name="first" class="new_tab">
          <ProfileListings :listing="listing" :noListing="noListing" />
        </el-tab-pane>
        <el-tab-pane label="Profile" name="second" class="settings_body">
          <el-form class="d-flex">
            <div class="w-90">
              <div class="d-flex pb-20 pt-20">
                <div class="profile_label">
                  <p>Personal information</p>
                </div>

                <div class="details_div">
                  <el-row :gutter="20" class="pb-20">
                    <el-col :xs="24" :sm="24" :md="12">
                      <p class="info_label">First Name</p>
                      <!-- <p v-if="!editInfo" class="profile_info">
                        {{ listing.first_name }}
                      </p> -->
                      <el-input
                        v-model="listing.first_name"
                        placeholder="First name"
                      >
                      </el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12">
                      <p class="info_label">Last Name</p>
                      <!-- <p v-if="!editInfo" class="profile_info">
                        {{ listing.last_name }}
                      </p> -->
                      <el-input
                        v-model="listing.last_name"
                        placeholder="Last Name"
                      >
                      </el-input>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20">
                    <el-col :xs="24" :sm="24" :md="24">
                      <p class="info_label">Date of birth</p>

                      <!-- <p class="profile_info">{{ listing.dob }}</p> -->
                      <el-input v-model="listing.date" type="date"> </el-input>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <hr class="hr_rule" />

              <div class="d-flex pt-20 pb-20">
                <div class="profile_label">
                  <p class="info_label">Contact information</p>
                </div>
                <div class="details_div">
                  <p>Email address</p>
                  <!-- <p class="profile_info">{{ listing.email }}</p> -->
                  <el-input
                    v-model="listing.email"
                    type="email"
                    placeholder="Enter email"
                  >
                  </el-input>
                  <div class="pt-20 pb-10">
                    <p class="info_label pb-5">Phone number</p>
                    <p v-if="!editInfo" class="profile_info">
                      {{ listing.phone_number }}
                    </p>
                  </div>
                  <vue-phone-number-input
                    v-model="listing.number"
                    :border-radius="7"
                    default-country-code="GH"
                  />
                </div>
              </div>
              <hr class="hr_rule" />
              <div
                class="d-flex pt-20 pb-20"
                v-if="listing.user_type == 'lister'"
              >
                <div class="profile_label">
                  <p class="info_label">ID Verification</p>
                </div>
                <div class="details_div">
                  <p class="info_label pb-5">ID Type</p>
                  <!-- <p class="profile_info">{{ listing.id_card_type }}</p> -->
                  <el-select
                    v-model="listing.id_card_type"
                    placeholder="Select ID type"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                  <div class="py-10">
                    <p class="info_label pb-5">ID card number</p>
                    <el-input
                      v-model="listing.id_card_number"
                      placeholder="Enter ID number"
                      class="py-10"
                    >
                    </el-input>
                  </div>

                  <div class="pt-20">
                    <p class="info_label">ID card photo</p>
                    <img
                      v-if="!identification"
                      :src="url + listing.id_card_upload"
                      alt=""
                      class="profile_id_card"
                    />
                    <img
                      v-else
                      :src="url + listing.id_card_upload"
                      alt=""
                      class="profile_id_card"
                    />
                    <el-upload
                      class="upload-demo"
                      action="#"
                      :multiple="false"
                      :auto-upload="false"
                      :on-change="getID"
                      :show-file-list="false"
                    >
                      <el-button type="info">Change ID</el-button>
                    </el-upload>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-20 w-20">
              <el-button
                :type="'primary'"
                :loading="loading"
                class="btn_sm"
                @click="updateUser"
                >Change information
              </el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Security" name="third" class="settings_body">
          <div class="d-flex pt-20 pb-20">
            <div class="profile_label">
              <p class="info_label">Change your password</p>
            </div>
            <div class="w-30">
              <div>
                <div class="pb-30">
                  <p class="info_label">Current password</p>
                  <el-input
                    v-model="current_password"
                    type="password"
                    placeholder="Enter your current password"
                    suffix-icon="el-icon-view"
                  >
                  </el-input>
                </div>
                <hr class="hr_rule" />
                <div class="pt-30">
                  <p class="pb-10" style="font-size: 14px">
                    Password must contain at least 1 letter, 1 number and a
                    symbol with minimum length of 12 characters
                  </p>
                  <el-form
                    class="pb-30"
                    :rules="passwordValidation"
                    :model="passwords"
                  >
                    <el-form-item label="New Password" prop="password">
                      <el-input
                        v-model="passwords.new_password"
                        type="password"
                        placeholder="Enter your new password"
                        suffix-icon="el-icon-view"
                        class="pb-10"
                      >
                      </el-input>
                    </el-form-item>
                    <el-form-item
                      label="Confirm Password"
                      prop="confirm_password"
                    >
                      <el-input
                        v-model="passwords.confirm_password"
                        type="password"
                        placeholder="Re-enter your new password"
                        suffix-icon="el-icon-view"
                      >
                      </el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="mt-20 d-flex justify_end">
                <el-button
                  :type="'primary'"
                  :loading="loading"
                  class="btn_sm"
                  @click="updateUser"
                  >Update password
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// import { products } from '@/assets/data/index.js'
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import { IMixinState } from "@/types/mixinsTypes";

export default Vue.extend({
  name: "settings",
  components: {
    VuePhoneNumberInput,
  },
  data() {
    var validatePass = (rule: any, value: string, callback: any) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        if ((this as any).passwords.confirm_password !== "") {
          (this as any).$refs.property_account.validateField(
            "confirm_password"
          );
        }
        callback();
      }
    };
    var validatePass2 = (rule: any, value: string, callback: any) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== (this as any).passwords.new_password) {
        callback(new Error("Password don't match!"));
      } else {
        callback();
      }
    };
    return {
      activeName: "first" as string,
      dummy_avatar: "../assets/img/avatar.png" as string,
      home: "" as string,
      passwords: {
        new_password: "" as string,
        confirm_password: "" as string,
      },
      noListing: "" as string,
      current_password: "" as string,
      loading: false as boolean,
      identification: "" as any,
      step: 1,
      avatar:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" as any,
      editInfo: false as any,
      url: "http://localhost:8000/",
      listing: {} as any,
      options: ["SSNIT", "Passport", "Voter"],
      countries: [],
      passwordValidation: {
        password: [
          { validator: validatePass, trigger: "blur", required: true },
        ],
        confirm_password: [
          { validator: validatePass2, trigger: "blur", required: true },
        ],
      },
    };
  },
  async created() {
    this.fetchData();
    const countries = await this.$countriesApi.index();
    this.countries = countries.data;
    console.log(this.$auth.strategy.token.get("token"));
  },
  methods: {
    async fetchData() {
      const user = this.$auth.$storage.getLocalStorage("user_data");
      console.log(user);
      const userId = user.id;
      const listing = await this.$userApi.show(userId);
      console.log(listing, "user details");
      // this.loadListing(listings.data);
      this.listing = listing.data.user;
    },
    onPhoneUpdate(e: any) {
      console.log(e);
      this.listing.phone_number = e.formattedNumber;
      this.countries.filter((country: any) =>
        country.short_name == e.countryCode
          ? (this.listing.country_id = country.id)
          : ""
      );
    },
    handleClick(tab: string, event: object) {
      console.log(tab, event);
    },
    getAvatar(file: any) {
      console.log(file);

      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onloadend = () => {
        this.avatar = reader.result;
      };
    },
    getID(file: any) {
      console.log(file);

      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onloadend = () => {
        this.identification = reader.result;
      };
    },

    async updateUser(): Promise<void> {
      this.loading = true;
      const data = {
        avatar: this.avatar ? this.avatar : this.listing.avatar,
        dob: this.listing.dob,
        email: this.listing.email,
        first_name: this.listing.first_name,
        id_card_type: this.listing.id_card_type,
        id_card_upload: this.identification
          ? this.identification
          : this.listing.identification,
        last_name: this.listing.last_name,
        phone_number: this.listing.phone_number,
        id_card_number: this.listing.id_card_number,
      };
      try {
        const register = await this.$userApi.update(this.listing.id, data);
        this.loading = false;
        this.$confirm("Update successfully!", {
          confirmButtonText: "Continue",
          type: "success",
        }).then(() => {
          // this.$router.push('/login');
        });
      } catch (error) {
        this.loading = false;
        (this as any as IMixinState).catchError(error);
      }
    },

    submit_password() {
      this.loading = true;
      (this as any).$refs.passwords.validate((valid: boolean) => {
        if (valid) {
          this.updatePassword();
        } else {
          this.loading = false;
          (this as any as IMixinState).getNotification(
            "Make sure all required fields are filled",
            "error"
          );
          return false;
        }
      });
    },
    async updatePassword(): Promise<void> {
      try {
        const response = await this.$passwordApi.create({
          ...this.passwords,
          user_id: this.listing.id,
          token: "",
        });
        console.log(response);

        (this as any as IMixinState).$confirm(response.message, {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "success",
        });
        this.loading = false;
      } catch (error) {
        this.loading = false;
        (this as any as IMixinState).catchError(error);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.profile_header {
  padding: 20px 0;
  .profile_img {
    border-radius: 50%;
    width: 100%;
    max-width: 160px;
    height: 160px;
  }
}
.account_form {
  padding-top: 20px;
}
.details_div {
  max-width: 500px;
  width: 100%;
}

.profile_info {
  font-weight: 600;
}
.info_label {
  font-weight: 500;
  color: #64748b;
}

.profile_id_card {
  width: 100%;
  max-width: 350px;
  height: 200px;
  margin-top: 10px;
  border-radius: 20px;
}

.profile_label {
  width: 20%;
  padding-right: 30px;
  margin-right: 10px;
  p {
    color: #000000;
    font-weight: 600;
  }
}
</style>
