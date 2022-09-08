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
                <p style="color: #fff">
                  {{ listing.listing_detail.category.name }}
                </p>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more" style="color: white"> </i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      ><NuxtLink :to="`/edit_listing/${listing.id}`"
                        >Edit</NuxtLink
                      ></el-dropdown-item
                    >
                    <el-dropdown-item>Publish</el-dropdown-item>
                    <el-dropdown-item style="color: red"
                      ><span @click="deleteListingModal(listing.id)">
                        Delete</span
                      ></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <!-- <div v-if="listing" class="aprroval_pending d-flex justify_center">
              <i class="el-icon-info"></i>
              <p class="pl-10">Pending Approval</p>
            </div> -->
            <div class="card_body">
              <!-- amount -->
              <p style="font-weight: 600">
                {{ listing.listing_detail.name }}
              </p>
              <p class="house_amount">
                ${{ listing.listing_detail.price }}/mth
              </p>
              <p class="house_plot">
                {{ listing.listing_detail.region }},
                {{ listing.listing_detail.city }}
              </p>
            </div>
            <div class="card_footer">
              <div
                class="pl-5"
                v-for="specification in listing.property_specifications"
                :key="specification.id"
              >
                <div class="d-flex align_center">
                  <img src="~/assets/svg/bed.png" class="property_img pr-10" />
                  <b>{{ specification.number }} </b>
                </div>
                <p>
                  {{ specification.specification.name }}
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

  methods: {
    deleteListingModal(listing_id: string) {
      // const h = this.$createElement
      this.$confirm("Are you sure you want to delete listing?", {
        cancelButtonText: "No, i want to keep",
        confirmButtonText: "Yes,I want to delete it",
      })
        .then(() => {
          this.$emit("listing_id", listing_id);
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
  },
});
</script>

<style lang="scss">
.no_properties {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.aprroval_pending {
  padding: 10px;
  text-align: center;
  color: white;
  // background: #909399;
  background: var(--color-primary);
  i {
    font-size: 20px;
  }
}
</style>
