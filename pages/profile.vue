<template>
  <div class="section profile">
    <div class="pt-20">
      <div v-if="lister.is_id_card_verified == 0" class="not_approved_message">
        <p>
          {{ not_approved_message }}
        </p>
      </div>

      <div class="profile_header">
        <div class="d-flex">
          <img
            v-if="
              lister.avatar &&
              avatar ===
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            "
            :src="apiUrl + '/' + lister.avatar"
            alt="avatar"
            class="profile_img"
          />

          <img v-else :src="avatar" alt="avatar" class="profile_img" />
          <div class="pl-20 pt-20">
            <p class="pb-5" style="font-size: 22px; font-weight: 600">
              {{ lister.first_name }} {{ lister.last_name }}
              <el-tag size="mini" type="warning" effect="dark">
                {{ lister.user_type }}</el-tag
              >
            </p>
            <p class="pb-10">
              <span>{{ lister.email }} </span>
            </p>

            <el-upload
              class="upload-demo"
              action="#"
              :multiple="false"
              :auto-upload="false"
              :on-change="getAvatar"
              :show-file-list="false"
            >
              <el-button type="info" size="mini">Update Photo</el-button>
            </el-upload>
          </div>
        </div>
        <p class="py-5 user_type">
          <el-tag v-if="lister.is_id_card_verified == 0" type="danger"
            >Not Verified</el-tag
          >
        </p>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="nav_scroll">
        <el-tab-pane
          v-if="lister.user_type == 'lister'"
          label="My Listings"
          name="first"
          class="new_tab"
        >
          <ProfileListings
            :user_listings="user_listings"
            :fetchListings="fetchListings"
          />
        </el-tab-pane>
        <el-tab-pane label="Profile" name="second" class="settings_body">
          <el-form class="profile_info_container d-flex">
            <div class="w-90">
              <div class="info_section d-flex pb-20 pt-20">
                <div class="profile_label">
                  <p>Personal information</p>
                </div>

                <div class="details_div">
                  <el-row :gutter="20" class="pb-20">
                    <el-col :xs="24" :sm="24" :md="12">
                      <p class="info_label">First Name</p>
                      <!-- <p v-if="!editInfo" class="profile_info">
                        {{ lister.first_name }}
                      </p> -->
                      <el-input
                        v-model="lister.first_name"
                        placeholder="First name"
                      >
                      </el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" class="last_name">
                      <p class="info_label">Last Name</p>
                      <!-- <p v-if="!editInfo" class="profile_info">
                        {{ lister.last_name }}
                      </p> -->
                      <el-input
                        v-model="lister.last_name"
                        placeholder="Last Name"
                      >
                      </el-input>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20">
                    <el-col :xs="24" :sm="24" :md="24">
                      <p class="info_label">Date of birth</p>

                      <p class="profile_info pb-10">
                        {{ lister.dob }}
                      </p>
                      <el-input v-model="lister.date" type="date"> </el-input>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <hr class="hr_rule" />
              <div class="info_section d-flex pt-20 pb-20">
                <div class="profile_label">
                  <p class="info_label">Contact information</p>
                </div>
                <div class="details_div">
                  <p>Email address</p>
                  <!-- <p class="profile_info">{{ lister.email }}</p> -->
                  <el-input
                    v-model="lister.email"
                    type="email"
                    placeholder="Enter email"
                  >
                  </el-input>
                  <div class="pt-20 pb-10">
                    <p class="info_label pb-5">Phone number</p>
                    <p class="profile_info">
                      {{ lister.phone_number }}
                    </p>
                  </div>
                  <vue-phone-number-input
                    v-model="phone"
                    :border-radius="7"
                    default-country-code="GH"
                    @update="onPhoneUpdate"
                  />
                </div>
              </div>
              <hr class="hr_rule" />
            </div>
            <div class="save_btn mt-20">
              <el-button
                :type="'primary'"
                :loading="loading"
                class="btn_sm"
                @click="updateUser"
                >Save information
              </el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="My Favorites" name="third" class="new_tab">
          <!-- <ProfileListings :user_listings="user_listings" /> -->
          <UserFavorite :listings="userFavorites" @favorite="toggleFavorite" />
        </el-tab-pane>
        <el-tab-pane label="Security" name="fourth" class="settings_body">
          <div class="security pt-20 pb-20">
            <div class="profile_label">
              <p class="info_label">Change your password</p>
            </div>
            <div class="security_details">
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
                    ref="passwords"
                    :rules="validation"
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
                  @click="submit_password"
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
import url from "../url";
import moment from "@nuxtjs/moment";

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
          (this as any).$refs.passwords.validateField("confirm_password");
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
      activeName: "second" as string,
      dummy_avatar: "../assets/img/avatar.png" as string,
      home: "" as string,
      phone: "",
      not_approved_message: "",
      passwords: {
        new_password: "" as string,
        confirm_password: "" as string,
      },
      current_password: "" as string,
      loading: false as boolean,
      identification: "" as any,
      step: 1,
      avatar:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" as any,
      editInfo: false as any,
      user_listings: [],
      lister: {
        id: "" as string,
        first_name: "" as string,
        last_name: "" as string,
        dob: "" as string,
        phone_number: "",
        user_type: "",
        email: "",
        avatar: "",
        country_id: "39a40751-d7d2-4346-99e5-b0235b520ce5" as string,
      } as any,
      options: ["SSNIT", "Passport", "Voter"],
      countries: [],
      userFavorites: [],
      validation: {
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
    this.fetchFavorites();
    this.fetchListings();
    const countries = await this.$countriesApi.index();
    this.countries = countries.data;
    if (this.lister.is_id_card_verified == 0) {
      this.not_approved_message = `Hi ${this.lister.first_name}, Your account is being approved. We will send you an email once it's approved, Thank you.`;

      (this as any as IMixinState).$confirm(
        `Hi ${this.lister.first_name}, Your account is being approved. We will send you an email once it's approved, Thank you.`,
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      );
    }
  },
  methods: {
    url() {
      return url();
    },
    birthDate(date: any) {
      this.$moment(date.format("MMM DD, YY"));
    },
    async fetchFavorites() {
      const userFavorite = await this.$userFavoriteApi.index();

      this.userFavorites = userFavorite.data;
      console.log("user fav", this.userFavorites);
    },
    async fetchListings() {
      const user = this.$auth.user;
      if (user.user_type == "lister") {
        const lister = await this.$userApi.show(user.id);
        console.log(lister, "user details");
        // this.loadlister(listers.data);
        this.user_listings = lister.data.listings;
      }
    },
    async fetchData() {
      const user = this.$auth.user;

      console.log(user, "user");
      this.lister = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        dob: user.dob,
        phone_number: user.phone_number,
        user_type: user.user_type,
        email: user.email,
        avatar: user.avatar,
        is_id_card_verified: user.is_id_card_verified,
        country_id: user.country.id,
      };
    },
    async toggleFavorite(id: string) {
      try {
        const favoriteResponse = await this.$selectFavoriteApi.create({
          listing_id: id,
        });
        console.log(favoriteResponse);
        (this as any as IMixinState).$message({
          showClose: true,
          message: "Added property to favourite!",
          type: "success",
        });
        this.fetchFavorites();
      } catch (error: any) {
        (this as any as IMixinState).catchError(error);
        console.log(error?.response);
      }
    },
    onPhoneUpdate(e: any) {
      console.log(e);
      this.lister.phone_number = e.formattedNumber;
      this.countries.filter((country: any) =>
        country.short_name == e.countryCode
          ? (this.lister.country_id = country.id)
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
      // console.log(this.lister);
      const data = {
        avatar:
          this.avatar !=
          "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            ? this.avatar
            : null,
        dob: this.lister.dob,
        email: this.lister.email,
        first_name: this.lister.first_name,
        last_name: this.lister.last_name,
        phone_number: this.lister.phone_number,
        country_id: this.lister.country_id,
        user_type: this.lister.user_type,
      };
      console.log(data);
      try {
        const profileResponse = await this.$userUpdateApi.update(
          "update",
          data
        );
        console.log("profile response", profileResponse);
        this.$auth.setUser(profileResponse.data.user);

        this.loading = false;
        (this as any as IMixinState).getNotification(
          "Update successfull!",
          "success"
        );
      } catch (error: any) {
        if (error?.response?.data) {
          (this as any as IMixinState).getNotification(
            error.response.data.message,
            "error"
          );
        }
        this.loading = false;
        (this as any as IMixinState).catchError(error);
      }
    },

    async deleteImage(planId: string) {
      this.loading = true;
      try {
        const ImageResponse = await this.$listingImagesApi.delete(planId);

        console.log(ImageResponse);

        this.loading = false;
        this.fetchData();
        (this as any as IMixinState).$message({
          showClose: true,
          message: ImageResponse.message,
          type: "success",
        });
      } catch (error) {
        console.log(error, "error");
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
          current_password: this.current_password,
          new_password: this.passwords.new_password,
          confirm_password: this.passwords.confirm_password,
        });
        console.log(response);

        (this as any as IMixinState).$confirm(
          "Password Changed Successfully!",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "success",
          }
        );
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
$small_screen: 426px;
$medium_screen: 769px;
.not_approved_message {
  text-align: center;
  color: white;
  margin: 0 auto;
  widows: 70%;
  p {
    background: hsla(0, 100%, 64%, 0.9);
    // border: 2px solid hsla(0, 89%, 57%, 0.9);
    border-radius: 20px;
    padding: 10px 0;
    i {
      color: orange;
      font-size: 20px;
      padding-right: 10px;
    }
    @media (max-width: $medium_screen) {
      padding: 10px;
    }
  }
}
.profile_header {
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  @media (max-width: $small_screen) {
    flex-direction: column;
  }
  .profile_img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    @media (max-width: $small_screen) {
      width: 100px;
      height: 100px;
    }
  }
  .user_type {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    @media (max-width: $small_screen) {
      width: 30%;
    }
    .el-tag {
      margin-top: 10px;
      font-size: 16px;
      width: fit-content;
    }
  }
}
.profile_info_container {
  @media (max-width: $medium_screen) {
    flex-direction: column;
  }
  @media (max-width: $small_screen) {
  }
  .info_section {
    @media (max-width: $small_screen) {
      flex-direction: column;
    }
  }
  .details_div {
    max-width: 500px;
    width: 100%;
    padding-top: 5px;
    @media (max-width: $small_screen) {
      padding-top: 0;
    }
    .last_name {
      @media (max-width: $small_screen) {
        padding-top: 5px;
      }
    }
  }
}

.save_btn {
  display: flex;
  justify-content: flex-end;
  .btn_sm {
    height: fit-content;
  }
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
  padding-top: 5px;
  margin-right: 10px;
  @media (max-width: $small_screen) {
    width: 100%;
    padding-bottom: 5px;
    padding-top: 0;
  }
  p {
    color: #000000;
    font-weight: 600;
  }
}
.security {
  display: flex;
  @media (max-width: $small_screen) {
    flex-direction: column;
  }
  .security_details {
    width: 30%;
    @media (max-width: $medium_screen) {
      width: 60%;
    }
    @media (max-width: $small_screen) {
      width: 100%;
    }
  }
}
</style>
