<template>
  <footer class="footer section">
    <hr class="hr_rule" />
    <el-row class="mt-10">
      <el-col :md="8" :sm="24">
        <p class="pb-20 right_reserved">
          &copy; Dwellys 2022, All rights reserved
        </p>
        <p class="trademark_text text-grey">
          Dwellys is a registered trademark and the trading name of Dwellys
          Limited.(v-0.8.1)
        </p>
      </el-col>
      <el-col :md="8" :sm="24">
        <ul class="conditions text-grey">
          <li>Privacy</li>
          <li class="term">Terms</li>
          <li class="sitemap">Sitemaps</li>
        </ul>
      </el-col>
      <el-col class="media_holder" :md="8" :sm="24">
        <span> <img src="~/assets/img/media_instagram.jpg" /></span>
        <span> <img src="~/assets/img/media_facebook.jpg" /></span>
        <span> <img src="~/assets/img/media_twitter.jpg" /></span>
      </el-col>
    </el-row>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Footer',
  data() {
    return {
      user: 'login',
    };
  },
  methods: {
    showLoginModal(): void {
      (this as any).$refs.loginAction.showLogin(this.user);
    },
  },
});
</script>
<style lang="scss" scoped>
p {
  font-size: 14px;
}
.footer {
  margin-top: 50px;
  padding-bottom: 20px;
  background: #fff;
  bottom: 0;
  z-index: 50;
  .right_reserved {
    font-weight: 600;
  }
  .media_holder {
    display: flex;
    justify-content: flex-end;

    span {
      margin-right: 20px;
    }
    .img {
      width: 35px;
    }
  }

  .conditions {
    display: flex;
    list-style: none;
    justify-content: space-evenly;

    li {
      font-size: 14px;
    }
    .term,
    .sitemap {
      list-style-type: disc;
    }
  }
}
@media (max-width: 426px) {
  .footer {
    padding: 0 20px;
    width: 100%;
    height: auto;
  }

  .conditions {
    padding-top: 30px;
    padding-bottom: 30px;

    justify-content: space-between;
  }
  .media_holder {
    span {
      margin-right: 20px;
    }
    .img {
      width: 35px;
    }
  }
}
</style>
