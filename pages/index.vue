<template>
  <div class="home">
    <div class="home_landing_page">
      <div class="landing_content section">
        <h1>
          Discover the world’s hub for <br />
          <span>houses</span> and <span>properties</span> for sale and rent
        </h1>
        <div class="discover_line"></div>
        <!-- <el-tabs type="card" @tab-click="handleClick" class="home_search_tabs">
          <el-tab-pane
            :label="searchType.label"
            v-for="(searchType, index) in propertySearch"
            :key="index"
          >
            <div class="search_container">
              <p v-if="isQuery" class="to_properties" @click="closeQuery">
                <span class="material-icons">arrow_back</span>
              </p>
              <el-input
                v-model="search_value"
                class="search_input"
                placeholder="Where do you want to live?"
              >
              </el-input>
              <el-button
                type="primary"
                class="hidden-sm-and-down"
                @click="getQuery"
                >Find your home</el-button
              >
              <el-button
                icon="el-icon-search"
                type="primary"
                class="hidden-md-and-up"
                round
              ></el-button>
            </div>
          </el-tab-pane>
        </el-tabs> -->
        <div class="search_container">
          <p v-if="isQuery" class="to_properties" @click="closeQuery">
            <span class="material-icons">arrow_back</span>
          </p>
          <el-input
            v-model="search_value"
            class="search_input"
            placeholder="Search for property"
          >
          </el-input>
          <el-button type="primary" class="hidden-sm-and-down" @click="getQuery"
            >Find your home</el-button
          >
          <el-button
            icon="el-icon-search"
            type="primary"
            class="hidden-md-and-up"
            round
          ></el-button>
        </div>
        <!-- <el-row class="d-flex pt-20">
          <div class="pr-20">
            <p><b>2000+ </b></p>
            <small>Properties for rent</small>
          </div>
          <div
            style="
              border-left: 1px solid #f8fafc;
              border-right: 1px solid #f8fafc;
            "
            class="px-20"
          >
            <p><b>1954+</b></p>
            <small>Properties for sale</small>
          </div>
          <div class="pl-20">
            <p><b>1954+</b></p>
            <small>Properties for sale</small>
          </div>
        </el-row> -->
      </div>
    </div>
    <div class="section">
      <div v-if="isQuery" class="pt-20" v-loading="pageLoad">
        <div v-if="queryList.length > 0">
          <PropertyList :listings="queryList" />
        </div>
        <div v-else class="d-flex justify_center">
          <h3>No Result Found.</h3>
          <br /><br />
          <el-button type="primary" size="mini" @click="closeQuery"
            >Go back Home</el-button
          >
        </div>
      </div>
      <el-tabs v-else type="border-card">
        <el-tab-pane
          :label="tab.label"
          v-for="(tab, index) in tabOptions"
          :key="index"
        >
          <div class="section pt-20" v-loading="pageLoad">
            <PropertyList
              :type="tab.label"
              :listings="listings"
              :favorites="favorites"
            />
          </div>
          <div></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  auth: false,
  name: 'IndexPage',
  data() {
    return {
      search_value: '' as string,
      propertySearch: [
        {
          label: 'Buy',
          value: 'buy',
        },
        {
          label: 'Rent',
          value: 'rent',
        },
        {
          label: 'Lease',
          value: 'lease',
        },
      ],
      listings: [] as Array<object>,
      pageLoad: true as boolean,
      favorites: [] as Array<object>,
      queryList: [],
      isQuery: false as boolean,
      tabOptions: [
        { label: 'All', title: 'Rent a home' },
        { label: 'House', title: 'Rent a house' },
        { label: 'Apartment', title: 'Rent an Apartment' },
        { label: 'Town house', title: 'Rent a Town house' },
        { label: ' Office', title: ' Rent an office' },
        { label: 'Land', title: ' Buy a land' },
      ] as any,
    };
  },
  async created() {
    if (this.$auth.loggedIn) {
      this.fetchData();
    }

    this.fetchData();

    console.log(this.listings);
    // this.userFavorites = userFavorite.data;
  },
  methods: {
    async fetchData() {
      const listings = await this.$listingApi.query('?status=active');
      console.log(listings);
      this.loadListing(listings.data);
    },
    loadListing(properties: any) {
      const data = properties.map((property: any) => {
        property.photos =
          property.listing_detail.feature_image_url != null
            ? property.listing_detail.feature_image_url
            : 'no photo';
        return property;
      });
      this.listings = data;
      this.pageLoad = false;
    },
    async getQuery() {
      if (this.search_value) {
        try {
          const query = await this.$querySearchApi.query(this.search_value);
          console.log(query);
          this.queryList = query.data;
          this.isQuery = true;
        } catch (error: any) {
          console.log('error', error);
          if (error?.response?.data) {
            this.isQuery = true;
            console.log('from server error', error.response.data.message);
          }
        }
      }
    },
    handleClick(tab: string) {
      console.log(tab);
    },
    closeQuery() {
      this.isQuery = false;
      this.queryList = [];
      this.search_value = '';
    },
  },
});
</script>

<style lang="scss" scoped>
.home {
  color: var(--text-white);
  .home_landing_page {
    background-image: url('~/assets/img/home.png');
    background-repeat: no-repeat;
    background-size: 100% 400px;
    height: 400px;
    padding: 30px 0;
    .landing_content {
      display: flex;
      // width: 95%;
      flex-direction: column;
      justify-content: center;
      h1 {
        padding-top: 40px;
        width: 100%;
        max-width: 490px;
        font-weight: 200;
        line-height: 34px;
        z-index: 10;
        span {
          font-weight: 700;
          font-size: 32px;
        }
      }
      .discover_line {
        position: relative;
        top: -25px;
        left: 20px;
        width: 220px;
        height: 30px;
        border-radius: 100%;
        box-shadow: 5px -10px #cf0100;
      }
      .search_container {
        background: #ffffff;
        border-radius: 0px 10px 10px 10px;
        display: flex;
        padding: 10px;
      }
    }
  }
  .to_properties {
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
  }
}
</style>
