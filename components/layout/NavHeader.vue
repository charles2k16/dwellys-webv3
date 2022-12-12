<template>
  <div class="header">
    <div class="top_banner">
      <span>This site is in public beta</span>
    </div>
    <div class="section">
      <ApplicationHandler ref="modalHandler" />
      <!-- {{ $auth }} -->
      <div class="header_wrapper">
        <div style="display: flex; align-items: center">
          <NuxtLink to="/">
            <img src="/logo.png" class="nav_logo" />
          </NuxtLink>
        </div>
        <div
          class="header_content hidden-sm-and-down"
          v-if="!$auth.loggedIn || $auth.user.user_type == 'visitor'">
          <span class="pl-10">
            <NuxtLink to="/property_account">List your property now</NuxtLink>
          </span>
        </div>
        <div class="drawer hidden-md-and-up">
          <svg
            @click="drawer = true"
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-align-right"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="10" y1="12" x2="20" y2="12" />
            <line x1="6" y1="18" x2="20" y2="18" />
          </svg>
        </div>
        <div class="header_content hidden-sm-and-down">
          <!-- <span v-if="$auth.loggedIn" class="pr-20">
          <NuxtLink to="/messages">Messages</NuxtLink>
        </span> -->

          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <span class="login-avatar">
                <span v-if="$auth.loggedIn" class="d-flex">
                  <span class="pt-5 pr-5">
                    {{ $auth.user.first_name }}
                  </span>
                  <img
                    v-if="$auth.user.avatar"
                    :src="src + $auth.user.avatar"
                    alt="avatar"
                    class="user_avatar" />
                  <img src="~/assets/img/user_icon.png" alt="icon" v-else />
                </span>

                <span v-else class="align_center">
                  <span class="mr-10">Login</span>
                  <img src="~/assets/img/user_icon.png" alt="icon" />
                </span>
              </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="!$auth.loggedIn">
                <p class="py-10" @click="showLoginModal">Login</p>
              </el-dropdown-item>
              <el-dropdown-item v-if="!$auth.loggedIn">
                <p class="py-10" @click="$router.push('/register')">Register</p>
              </el-dropdown-item>
              <el-dropdown-item v-if="$auth.loggedIn" @click="$router.push('/profile')">
                <p class="py-10">Profile</p>
              </el-dropdown-item>
              <el-dropdown-item v-if="$auth.loggedIn">
                <p
                  class="py-10"
                  @click="$router.push('/property_upload')"
                  v-if="$auth.user.user_type == 'lister'">
                  Property Upload
                </p>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="!$auth.loggedIn || $auth.user.user_type == 'visitor'">
                <p class="py-10" @click="$router.push('/property_account')">
                  List your property now
                </p>
              </el-dropdown-item>
              <el-dropdown-item v-if="$auth.loggedIn" style="color: red">
                <p class="py-10" @click="logout">Logout</p></el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- <hr class="hr_rule register_header_line mt-20" /> -->

      <el-drawer
        size="60%"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
        :append-to-body="true">
        <div class="drawer_content px-20">
          <div class="d-flex_column">
            <span class="login-avatar">
              <span v-if="$auth.loggedIn" class="d-flex">
                <span class="pt-10 pr-5">
                  {{ $auth.user.first_name }}
                </span>

                <img
                  v-if="$auth.user.avatar"
                  :src="src + $auth.user.avatar"
                  alt="avatar"
                  class="user_avatar" />
                <img src="~/assets/img/user_icon.png" alt="icon" v-else />
              </span>

              <span v-else class="align_center">
                <span class="mr-10">Login</span>
                <img src="~/assets/img/user_icon.png" alt="icon" />
              </span>
            </span>
            <br />
            <!-- you should find a way to make this whole div the if statement -->
            <div>
              <span v-if="!$auth.loggedIn" @click="showLoginModal" class="py-10 mb-10"
                >Login</span
              >
              <br />

              <hr v-if="!$auth.loggedIn" class="hr_rule mt-10" />

              <span v-if="!$auth.loggedIn" @click="drawer = false" class="mt-10 d-block">
                <NuxtLink to="/register">Register</NuxtLink>
              </span>

              <hr v-if="!$auth.loggedIn" class="hr_rule mt-10" />

              <span
                @click="drawer = false"
                v-if="!$auth.loggedIn || $auth.user.user_type == 'visitor'"
                class="mt-10 d-block">
                <NuxtLink to="/property_account">List your property now</NuxtLink>
              </span>
            </div>

            <div v-if="$auth.loggedIn">
              <span @click="drawer = false" class="pb-10 pt-20 d-block">
                <NuxtLink to="/profile">Profile</NuxtLink>
              </span>

              <hr class="hr_rule mt-10" />

              <span class="mt-10 d-block">
                <span v-if="$auth.user.user_type == 'lister'">
                  <NuxtLink to="/property_upload">Property Upload</NuxtLink>
                </span>
              </span>

              <hr class="hr_rule mt-10" />

              <span
                v-if="$auth.loggedIn"
                @click="$auth.logout()"
                class="pb-20"
                style="color: red">
                Logout
              </span>
            </div>

            <!-- <span v-if="$auth.loggedIn" @click="drawer = false" class="pb-10">
                <NuxtLink to="/messages">Messages</NuxtLink>
              </span> -->
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import 'element-ui/lib/theme-chalk/display.css';
import ApplicationHandler from '@/handlers/ApplicationHandler.vue';
import url from '../../url';

export default Vue.extend({
  name: 'NavHeader',
  components: {
    ApplicationHandler,
  },
  data() {
    return {
      userData: {} as any,
      userReady: false,
      user_type: '' as any,
      src:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8000/'
          : 'https://newapi.dwellys.com/',
      user: 'login' as string,
      drawer: false as boolean,
      direction: 'rtl',
    };
  },

  created() {
    console.log(this.$auth);
    // Object.keys(this.$auth.user).length === 0 ||
    if (this.$auth.user == null) {
      this.userReady = false;
    } else {
      this.userReady = true;
    }
  },
  methods: {
    url() {
      return url();
    },
    showLoginModal(): void {
      this.drawer = false;
      (this as any).$refs.modalHandler.showLogin(this.user);
    },
    handleClose(done: string) {
      this.drawer = false;
      console.log(done);
    },
    logout() {
      this.$auth.logout();
      this.userReady = false;
    },
  },
});
</script>
<style lang="scss" scoped>
$small_screen: 426px;
$laptop_screen: 1024px;
a {
  color: #334155;
}
.header {
  padding: 0px 0 0;
  height: 95px;
  position: sticky;
  top: 0;
  background: #fff;
  // width: 100%;
  z-index: 10;

  .top_banner {
    color: #fff;
    text-align: center;
    background-color: var(--color-primary);
    padding: 10px 0;
  }
}
.header_wrapper {
  display: flex;
  justify-content: space-between;
  @media (max-width: $laptop_screen) {
    padding-right: 10px;
    padding-left: 10px;
  }
  .nav_logo {
    width: 130px;
  }
}
.header_content {
  display: flex;
  align-items: center;
}

.login {
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  cursor: pointer;
  padding: 5px 10px;
  background: #f8fafc;
}
.login-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 2px 4px 2px 16px;
  border-radius: 20px;

  .user_avatar {
    border-radius: 50%;
    height: 35px;
    width: 35px;
  }
}
.login_text {
  display: flex;
}
.login_text p {
  padding-right: 8px;
}
.login_text img {
  width: 24px;
  height: 24px;
}

/* @media (max-width: 768px) {
  .header_content {
    display: none;
  }
} */
</style>
