<template>
  <div class="home">
    <div class="home_landing_page">
      <div class="landing_content section">
        <!-- <h1>
          Discover the world’s hub for <br />
          <span>houses</span> and <span>properties</span> for sale and rent
        </h1> -->
        <h1>
          Put your <span>property</span> on the worlds Stage
          <!-- houses and <span>properties</span> for sale and rent -->
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
          <!-- <p v-if="isQuery" class="to_properties" @click="closeQuery">
            <span class="material-icons">arrow_back</span>
          </p> -->
          <el-input
            @keyup.native.enter="getQuery"
            v-model="search_value"
            class="search_input"
            placeholder="Search for property"
          >
          </el-input>
          <el-button type="primary" class="hidden-sm-and-down" @click="getQuery"
            >Find your home</el-button
          >
          <el-button
            @click="getQuery"
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
    <div>
      <el-tabs type="border-card" @tab-click="changeLabel" v-model="activeName">
        <el-tab-pane
          :label="tab.label"
          v-for="(tab, index) in tabOptions"
          :key="index"
          :name="tab.label"
        >
          <div class="section pt-20">
            <el-skeleton :loading="pageLoad" animated>
              <template slot="template">
                <el-row :gutter="20">
                  <el-col
                    :xs="24"
                    :sm="8"
                    class="mt-20"
                    v-for="i in 3"
                    :key="i"
                  >
                    <el-skeleton-item
                      variant="image"
                      style="width: 100%; height: 250px"
                    />
                    <div class="mt-10">
                      <el-skeleton-item
                        variant="h3"
                        style="width: 60%; height: 25px"
                      />
                      <div
                        class="d-flex-justify-between mt-10"
                        style="height: 16px"
                      >
                        <el-skeleton-item variant="text" class="mr-10" />
                        <el-skeleton-item variant="text" style="width: 50%" />
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </template>
              <template slot="">
                <el-row :gutter="20" v-if="listings.length > 0">
                  <el-col
                    :xs="24"
                    :sm="8"
                    v-for="property in listings"
                    :key="property.id"
                    class="mt-20"
                  >
                    <PropertyCard
                      :property="property"
                      :favProperties="favProperties"
                    />
                  </el-col>
                </el-row>
                <div v-else class="d-flex justify_center p-20">
                  <p>No Properties found</p>
                </div>

                <div v-if="total > 30" class="d-flex justify_center">
                  <p class="p-10 show_more_btn" @click="getMoreProperties">
                    Show more<i
                      class="el-icon-bottom pl-10"
                      style="fontsize: 20px"
                    ></i>
                  </p>
                </div>
              </template>
            </el-skeleton>
          </div>
          <!-- <div class="section pt-20" v-else v-loading="pageLoad">
            <PropertyList
              :type="tab.label"
              :listings="house_listings"
              :fetchFavorites="fetchFavorites"
              :favProperties="favProperties"
            />
          </div> -->
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import { IMixinState } from '@/types/mixinsTypes';

export default Vue.extend({
  auth: false,
  name: 'IndexPage',
  data() {
    return {
      search_value: '' as string,
      total: 0 as number,
      // propertySearch: [
      //   {
      //     label: 'Buy',
      //     value: 'buy',
      //   },
      //   {
      //     label: 'Rent',
      //     value: 'rent',
      //   },
      //   {
      //     label: 'Lease',
      //     value: 'lease',
      //   },
      // ],
      listings: [] as Array<any>,
      page: 0 as number,
      pageLoad: true as boolean,
      queryList: [],
      // isQuery: false as boolean,
      favProperties: [] as any,
      activeName: 'All',
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
  created() {
    // this.fetchListings();
    // this.$auth.user && !this.$auth.user.user_type && this.$auth.state.strategy == 'facebook'
    //   ? this.facebookAuth()
    //   : '';
    this.$auth.loggedIn && this.fetchFavorites();
  },
  async fetch() {
    try {
      const listings = await this.$listingApi.query('?status=active');
      if (listings.data) {
        this.loadListing(listings.data);
      }

      if (listings.pagination) {
        this.total = listings.pagination.total;
        this.page = listings.pagination.current_page;
      }

      this.pageLoad = false;
    } catch (error: any) {
      this.pageLoad = false;
    }
  },
  methods: {
    // async facebookAuth() {
    //   const facebook_user = this.$auth.user;
    //   try {
    //     const socialsignup = {
    //       first_name: facebook_user.first_name,
    //       last_name: facebook_user.last_name,
    //       email: facebook_user.email,
    //       sign_up_mode: 'facebook',
    //       avatar: facebook_user.picture.data.url,
    //       user_type: 'visitor',
    //       social_site_id: facebook_user.id,
    //       dob: this.$moment(facebook_user.birthday).format(
    //         'YYYY-MM-DD h:mm:ss'
    //       ),
    //     };
    //     const social_response = await this.$socialregisterApi.create(
    //       socialsignup
    //     );
    //     // console.log('facebook signup', social_response);
    //     this.$confirm(social_response.message, 'Confirm Email Address', {
    //       confirmButtonText: 'Continue',
    //       type: 'success',
    //     }).then(() => {
    //       // this.$router.push('/login');
    //       this.$router.push({
    //         name: 'profile',
    //       });
    //     });
    //   } catch (error: any) {
    //     if (
    //       error.response.data.errors.email ==
    //       'The email has already been taken.'
    //     ) {
    //       const socialsignup = {
    //         email: facebook_user.email,
    //         sign_up_mode: 'facebook',
    //         user_type: 'visitor',
    //         social_site_id: facebook_user.id,
    //       };
    //       const social_response = await this.$socialloginApi.create(
    //         socialsignup
    //       );

    //       const { token, user } = social_response.data;
    //       this.$auth.setUserToken(token);
    //       this.$auth.setUser(user);
    //       this.fetchFavorites();
    //       // window.location.reload();
    //       (this as any as IMixinState).$message({
    //         showClose: true,
    //         message: 'Logged-in successfully',
    //         type: 'success',
    //       });
    //     } else {
    //       (this as any as IMixinState).getNotification(
    //         error.response.data.errors,
    //         'error'
    //       );
    //     }
    //   }
    // },
    async fetchFavorites() {
      if (this.$auth.loggedIn) {
        const userFavorite = await this.$userFavoriteApi.index();
        const favorites = userFavorite.data;

        for (let i = 0; i < favorites.length; i++) {
          this.favProperties.push(favorites[i].listing);
        }
      }
    },
    async getMoreProperties() {
      const listings = await this.$listingApi.query(
        `?status=active?${this.page + 1}`
      );
      this.page = listings.pagination.current_page;
      this.loadListing(listings.data);
    },
    async fetchListings() {
      // this.pageLoad = true;

      try {
        const listings = await this.$listingApi.query('?status=active');
        if (listings.data) {
          this.loadListing(listings.data);
        }

        if (listings.pagination) {
          this.total = listings.pagination.total;
          this.page = listings.pagination.current_page;
        }

        this.pageLoad = false;
      } catch (error: any) {
        this.pageLoad = false;
      }
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
    async changeLabel(tab: any) {
      if (tab.label === 'All') {
        this.fetchListings();
      } else {
        this.pageLoad = true;
        try {
          const response = await this.$similarListingsApi.query(tab.label);

          this.loadListing(response.data);
        } catch (error: any) {
          if (error?.response?.data) {
            this.listings = [];
          }
          this.pageLoad = false;
        }
      }
    },
    getQuery() {
      if (this.search_value) {
        this.$router.push({
          name: 'search',
          // params: { property: property.id },
          query: {
            property: this.search_value,
          },
        });
      }
    },
    // loadQuery(properties: any) {
    //   const data = properties.map((property: any) => {
    //     property.photos =
    //       property.listing_detail.feature_image_url != null
    //         ? property.listing_detail.feature_image_url
    //         : 'no photo';
    //     return property;
    //   });

    //   this.queryList = data;
    //   this.pageLoad = false;
    // },
    // closeQuery() {
    //   this.isQuery = false;
    //   this.queryList = [];
    //   this.search_value = '';
    // },
  },
});
</script>

<style lang="scss" scoped>
$small_screen: 426px;
$medium_screen: 769px;
$laptop_screen: 1024px;
.show_more_btn {
  background: var(--color-primary);
  color: white;
  border-radius: 10px;
}
.home {
  color: var(--text-white);
  .home_landing_page {
    background: url('~/assets/img/home1.png');
    background-repeat: no-repeat;
    background-size: 100% 491px;
    background-position: center;
    height: 491px;
    padding: 30px 0;

    @media (max-width: $medium_screen) {
      background-size: 100% 500px;
      height: 500px;
    }
    @media (max-width: $small_screen) {
      background: url('~/assets/img/home2.png');
      background-size: 100% 420px;
      background-position: center;
      height: 420px;
    }
    .landing_content {
      padding-top: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      @media (max-width: $small_screen) {
        padding-top: 100px;
      }
      h1 {
        // padding-top: 20px;
        width: 100%;
        max-width: 490px;
        font-weight: 200;
        line-height: 34px;
        font-family: var(--font-primary-light);
        z-index: 10;
        @media (max-width: $small_screen) {
          font-size: 32px;
          line-height: 36px;
        }
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
        margin-top: 60px;
        border-radius: 6px 11px 6px 6px;
        display: flex;
        padding: 10px;
      }
    }
  }
  .to_properties {
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    color: black;
  }
  .no_results_found {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
