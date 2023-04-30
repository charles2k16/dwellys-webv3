<template>
  <el-container>
    <el-main
      style="
        height: 100vh;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      "
    >
      <div>
        <NavHeader />
        <Nuxt />
      </div>

      <Footer />
    </el-main>
  </el-container>
</template>

<script>
import Vue from 'vue';
import global from '~/mixins/global.ts';

Vue.mixin(global);
export default {
  name: 'App',
  mounted() {
    this.$router.afterEach(() => {
      this.scrollToTop();
    });
  },
  methods: {
    scrollToTop() {
      if (process.client) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
  },
};
</script>
