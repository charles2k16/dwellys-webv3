<template>
  <div class="section">
    <div v-if="houses.length > 0">
      <el-row class="house_section" :gutter="20" v-loading="pageLoad">
        <el-col
          :xs="24"
          :sm="12"
          :md="6"
          v-for="(house, index) in houses"
          :key="index"
          class="pb-20"
        >
          <el-card shadow="hover" class="property_container">
            <div class="property_image" :style="background_style(house.img)">
              <div class="d-flex justify_between property_labels p-10">
                <p>
                  {{ house.name }}
                </p>
                <span class="material-icons fav"> favorite_border </span>
              </div>
            </div>
            <!-- <nuxt-link
            :to="{ name: 'property_details', params: { property: property } }"
          > -->
            <div class="card_body">
              <!-- amount -->
              <p class="house_amount">
                <!-- ${{ property.listing_detail.price }} -->400 /mth
              </p>
              <p class="house_plot">
                <!-- {{ property.listing_detail.region }},
              {{ property.listing_detail.city }} -->
                locations
              </p>
            </div>
            <div class="card_footer">
              <div class="pl-5">
                <div class="d-flex align_center">
                  <img src="~/assets/svg/bed.png" class="property_img pr-10" />
                  <b>3</b>
                </div>
                <p>Bedrooms</p>
              </div>
              <div class="house_bathroom">
                <div class="d-flex align_center">
                  <img src="~/assets/svg/bath.png" class="property_img pr-10" />
                  <b>4</b>
                </div>
                <p>Bathrooms</p>
              </div>
              <div>
                <div class="d-flex align_center">
                  <img src="~/assets/svg/tv.png" class="property_img pr-10" /><b
                    >1</b
                  >
                </div>
                <p>Living area</p>
              </div>
            </div>
            <!-- </nuxt-link> -->
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-else class="d-flex justify_center p-20">
      <h2>No Properties</h2>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ProfileListings",
  props: {
    // listing: {
    //   required: true,
    //   type: Object,
    // },
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

<style lang="scss"></style>
