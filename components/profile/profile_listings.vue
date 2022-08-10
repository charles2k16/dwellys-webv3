<template>
  <div class="section">
    <div v-if="user_listings.length > 0">
      <el-row class="house_section" :gutter="20" v-loading="pageLoad">
        <el-col
          :xs="24"
          :sm="12"
          :md="6"
          v-for="(listing, index) in user_listings"
          :key="index"
          class="pb-20"
        >
          <el-card shadow="hover" class="property_container">
            <div
              class="property_image"
              :style="
                background_style(listing.listing_detail.feature_image_url)
              "
            >
              <div class="d-flex justify_between property_labels p-10">
                <p>
                  {{ listing.listing_detail.name }}
                </p>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"> </i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      ><NuxtLink :to="`/edit_listing/${listing.id}`"
                        >Edit</NuxtLink
                      ></el-dropdown-item
                    >
                    <el-dropdown-item>Publish</el-dropdown-item>
                    <el-dropdown-item style="color: red"
                      >Delete</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <!-- <nuxt-link
            :to="{ name: 'property_details', params: { property: property } }"
          > -->
            <div class="card_body">
              <!-- amount -->
              <p class="house_amount">
                ${{ listing.listing_detail.price }}/mth
              </p>
              <p class="house_plot">
                {{ listing.listing_detail.region }},
                {{ listing.listing_detail.city }}
              </p>
            </div>
            <div class="card_footer">
              <div class="pl-5">
                <div class="d-flex align_center">
                  <img src="~/assets/svg/bed.png" class="property_img pr-10" />
                  <b>{{ listing.property_specifications[0].number }} </b>
                </div>
                <p>
                  {{ listing.property_specifications[0].specification.name }}
                </p>
              </div>
              <div class="house_bathroom">
                <div class="d-flex align_center">
                  <img src="~/assets/svg/bath.png" class="property_img pr-10" />
                  <b>{{ listing.property_specifications[1].number }}</b>
                </div>
                <p>
                  {{ listing.property_specifications[1].specification.name }}
                </p>
              </div>
              <div>
                <div class="d-flex align_center">
                  <img src="~/assets/svg/tv.png" class="property_img pr-10" /><b
                    >{{
                      listing.property_specifications[2]
                        ? listing.property_specifications[2].number
                        : 0
                    }}</b
                  >
                </div>
                <p>
                  {{
                    listing.property_specifications[2]
                      ? listing.property_specifications[2].specification.name
                      : 0
                  }}
                </p>
              </div>
            </div>
            <!-- </nuxt-link> -->
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-else class="no_properties p-20">
      <p class="pb-10">You have no listings or proeprties uploaded yet.</p>
      <NuxtLink to="/property_upload"
        ><el-button type="primary" size="mini"
          ><i class="el-icon-plus mr-10"></i>Upload Property</el-button
        ></NuxtLink
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ProfileListings",
  props: {
    user_listings: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      email: "" as string,
      pageLoad: false,
      houses: [
        // { img: "Frame2.png", name: "property" },
        // { img: "Frame3.png", name: "property" },
        // { img: "Frame4.png", name: "property" },
        // { img: "Frame5.png", name: "property" },
      ],
    };
  },

  methods: {},
});
</script>

<style lang="scss">
.no_properties {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.el-icon-more {
  color: white;
  background: black;
  border-radius: 20px;
  padding: 5px;
}
</style>
