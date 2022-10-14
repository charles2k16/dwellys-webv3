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
          <div
            class="section pt-20"
            v-if="tab.label == 'All'"
            v-loading="pageLoad"
          >
            <PropertyList
              :type="tab.label"
              :listings="listings"
              :fetchFavorites="fetchFavorites"
              :favProperties="favProperties"
            />
            <div v-if="total > 30" class="d-flex justify_center">
              <p class="p-10 show_more_btn" @click="getMoreProperties">
                Show more<i
                  class="el-icon-bottom pl-10"
                  style="fontsize: 20px"
                ></i>
              </p>
            </div>
          </div>
          <div
            class="section pt-20"
            v-else-if="tab.label == 'House'"
            v-loading="pageLoad"
          >
            <PropertyList
              :type="tab.label"
              :listings="house_listings"
              :fetchFavorites="fetchFavorites"
              :favProperties="favProperties"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { IMixinState } from "@/types/mixinsTypes";

export default Vue.extend({
  auth: false,
  name: "IndexPage",
  data() {
    return {
      house_listings: [],
      search_value: "" as string,
      total: 0 as number,
      propertySearch: [
        {
          label: "Buy",
          value: "buy",
        },
        {
          label: "Rent",
          value: "rent",
        },
        {
          label: "Lease",
          value: "lease",
        },
      ],
      listings: [] as Array<object>,
      page: 0 as number,
      pageLoad: true as boolean,
      queryList: [],
      isQuery: false as boolean,
      favProperties: [] as any,
      tabOptions: [
        { label: "All", title: "Rent a home" },
        { label: "House", title: "Rent a house" },
        { label: "Apartment", title: "Rent an Apartment" },
        { label: "Town house", title: "Rent a Town house" },
        { label: " Office", title: " Rent an office" },
        { label: "Land", title: " Buy a land" },
      ] as any,
    };
  },
  created() {
    this.fetchData();

    // !this.$auth.strategy.token.get()
    !this.$auth.user.user_type && this.$auth.state.strategy == "facebook"
      ? this.facebookAuth()
      : "";
    this.$auth.loggedIn && this.fetchFavorites();
  },
  methods: {
    async facebookAuth() {
      const facebook_user = this.$auth.user;
      try {
        const socialsignup = {
          email: facebook_user.email,
          sign_up_mode: "facebook",
          user_type: "visitor",
          social_site_id: facebook_user.id,
        };
        console.log(facebook_user);
        const social_response = await this.$socialloginApi.create(socialsignup);

        const { token, user } = social_response.data;
        this.$auth.setUserToken(token);
        this.$auth.setUser(user);
        console.log("social_response", social_response);
        this.fetchFavorites();
        // window.location.reload();
        (this as any as IMixinState).$message({
          showClose: true,
          message: "Logged-in successfully",
          type: "success",
        });
      } catch (error: any) {
        console.log("error");
        if (
          error.response.data.errors.email ==
          "The email has already been taken."
        ) {
          console.log(error.response);
          const socialsignup = {
            first_name: facebook_user.first_name,
            last_name: facebook_user.last_name,
            email: facebook_user.email,
            sign_up_mode: "facebook",
            avatar: facebook_user.picture.data.url,
            user_type: "visitor",
            social_site_id: facebook_user.id,
            dob: this.$moment(facebook_user.birthday).format(
              "YYYY-MM-DD h:mm:ss"
            ),
          };
          const social_response = await this.$socialregisterApi.create(
            socialsignup
          );
          console.log("facebook signup", social_response);
          this.$confirm(social_response.message, "Confirm Email Address", {
            confirmButtonText: "Continue",
            type: "success",
          }).then(() => {
            // this.$router.push('/login');
            this.$router.push({
              name: "profile",
            });
          });
        } else {
          (this as any as IMixinState).getNotification(
            error.response.data.errors,
            "error"
          );
        }
      }
    },
    async fetchFavorites() {
      if (this.$auth.loggedIn) {
        const userFavorite = await this.$userFavoriteApi.index();
        const favorites = userFavorite.data;

        for (let i = 0; i < favorites.length; i++) {
          this.favProperties.push(favorites[i].listing);
        }
        console.log("favorites", this.favProperties);
      }
    },
    getLabel(label: string) {
      console.log(label);
    },
    async getMoreProperties() {
      const listings = await this.$listingApi.query(
        `?status=active?${this.page + 1}`
      );
      this.page = listings.pagination.current_page;
      this.loadListing(listings.data);
    },
    async fetchData() {
      const listings = await this.$listingApi.query("?status=active");
      console.log(listings);
      this.total = listings.pagination.total;
      this.page = listings.pagination.current_page;
      this.loadListing(listings.data);
      // const filtered_properties = await this.$filterPropertiesApi.query(
      //   "house"
      // );
      // console.log(filtered_properties);
    },
    loadListing(properties: any) {
      const data = properties.map((property: any) => {
        property.photos =
          property.listing_detail.feature_image_url != null
            ? property.listing_detail.feature_image_url
            : "no photo";
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
          console.log("error", error);
          if (error?.response?.data) {
            this.isQuery = true;
            console.log("from server error", error.response.data.message);
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
      this.search_value = "";
    },
  },
});
</script>

<style lang="scss" scoped>
.show_more_btn {
  background: var(--color-primary);
  color: white;
  border-radius: 10px;
}
.home {
  color: var(--text-white);
  .home_landing_page {
    background-image: url("~/assets/img/home.png");
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
