<template>
  <div class="header">
    <ApplicationHandler ref="modalHandler" />
    <div class="top_banner">
      <span>This site is new and undergoing public tests</span>
    </div>
    <div class="section">
      <div class="header_wrapper">
        <div style="display: flex; align-items: center">
          <NuxtLink to="/">
            <img src="/logo.png" class="nav_logo" />
          </NuxtLink>
        </div>
        <div class="header_content hidden-sm-and-down" v-if="!$auth.loggedIn">
          <span class="pl-10 flash">
            <NuxtLink to="/property_account">List your property now</NuxtLink>
          </span>
        </div>
        <div
          class="header_content hidden-sm-and-down"
          v-if="$auth.user && $auth.user.user_type == 'visitor'">
          <span class="pl-10 flash">
            <NuxtLink to="/become_a_lister">List your property now</NuxtLink>
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
                <span v-if="$auth.loggedIn" class="d-flex align_center">
                  <span class="mr-10">
                    {{ $auth.user.first_name }}
                  </span>
                  <img
                    v-if="$auth.user.avatar"
                    :src="$auth.user.avatar"
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
              <el-dropdown-item v-if="$auth.loggedIn">
                <span @click="$router.push('/profile')">
                  <p class="py-10">Profile</p>
                </span>
              </el-dropdown-item>
              <el-dropdown-item v-if="$auth.loggedIn">
                <p
                  class="py-10"
                  @click="$router.push('/property_upload')"
                  v-if="$auth.user && $auth.user.user_type == 'lister'">
                  Property Upload
                </p>
              </el-dropdown-item>
              <el-dropdown-item v-if="!$auth.loggedIn">
                <p class="py-10" @click="$router.push('/property_account')">
                  List your property now
                </p>
              </el-dropdown-item>
              <el-dropdown-item v-if="$auth.user && $auth.user.user_type == 'visitor'">
                <p class="py-10" @click="$router.push('/become_a_lister')">
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
    </div>
    <el-drawer
      size="60%"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      :append-to-body="true">
      <div class="px-20">
        <span class="login-avatar" v-if="$auth.loggedIn">
          <span class="d-flex align_center">
            <span class="mr-5">
              {{ $auth.user.first_name }}
            </span>

            <img
              v-if="$auth.user.avatar"
              :src="$auth.user.avatar"
              alt="avatar"
              class="user_avatar" />
            <img src="~/assets/img/user_icon.png" alt="icon" v-else />
          </span>
        </span>

        <div v-if="!$auth.loggedIn">
          <div @click="showLoginModal" class="py-10">Login</div>

          <hr class="hr_rule" />

          <div @click="drawer = false" class="mt-10 d-block">
            <NuxtLink to="/register">Register</NuxtLink>
          </div>

          <hr class="hr_rule mt-10" />

          <div @click="drawer = false" class="mt-10 d-block">
            <NuxtLink to="/property_account">List your property now</NuxtLink>
          </div>
        </div>

        <div v-if="$auth.loggedIn">
          <ul>
            <li @click="drawer = false">
              <NuxtLink to="/profile">Profile</NuxtLink>
            </li>

            <!-- <hr class="hr_rule mt-10" /> -->

            <li v-if="$auth.user.user_type == 'lister'">
              <NuxtLink to="/property_upload">Property Upload</NuxtLink>
            </li>

            <!-- <hr class="hr_rule mt-10" /> -->

            <li @click="$auth.logout()">Logout</li>
          </ul>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import 'element-ui/lib/theme-chalk/display.css';
import ApplicationHandler from '@/handlers/ApplicationHandler.vue';

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
          : 'http://dwellys-files-production.s3.us-east-2.amazonaws.com/',
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
    showLoginModal(): void {
      this.drawer = false;
      (this as any).$refs.modalHandler.showLogin(this.user);
    },
    handleClose(done: string) {
      this.drawer = false;
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
.flash {
  font-size: 14px;
  line-height: 18px;
}
.header {
  padding: 0px 0 0;
  height: 100px;
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
  padding-top: 5px;
  padding-bottom: 5px;
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
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 5px 5px 5px 10px;
  border-radius: 20px;

  .user_avatar {
    border-radius: 50%;
    height: 32px;
    width: 32px;
  }

  span {
    font-size: 14px;
    color: #475569;
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
</style>
