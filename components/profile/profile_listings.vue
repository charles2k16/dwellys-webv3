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
          style="height: 400px">
          <el-card shadow="hover" class="property_container">
            <div
              class="property_image"
              :style="background_style(listing.listing_detail.feature_image_url)">
              <div class="d-flex justify_between">
                <p style="color: #fff">
                  {{ listing.listing_detail.category.name }}
                </p>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more" style="color: white"> </i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item style="padding: 0"
                      ><p
                        @click="$router.push(`/edit_listing/${listing.id}`)"
                        style="
                          width: 100%;
                          text-align: center;
                          padding: 10px 20px;
                          color: blue;
                        ">
                        Edit
                      </p></el-dropdown-item
                    >
                    <el-dropdown-item style="color: red; padding: 0"
                      ><p
                        @click="deleteListingModal(listing.id)"
                        style="width: 100%; text-align: center; padding: 10px 20px">
                        Delete
                      </p></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <!-- <div v-if="listing" class="aprroval_pending d-flex justify_center">
              <i class="el-icon-info"></i>
              <p class="pl-10">Pending Approval</p>
            </div> -->
            <div class="card_body" @click="$router.push(`/edit_listing/${listing.id}`)">
              <!-- amount -->
              <p style="font-weight: 600">
                {{ listing.listing_detail.name }}
              </p>
              <p class="house_amount">GH₵ {{ listing.listing_detail.price }}/mth</p>
              <p class="house_plot">
                {{ listing.listing_detail.region }},
                {{ listing.listing_detail.city }}
              </p>
            </div>
            <div class="card_footer" @click="$router.push(`/edit_listing/${listing.id}`)">
              <div
                class="pl-5"
                v-for="specification in listing.property_specifications"
                :key="specification.id">
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
      <p class="mb-20">You have no listings or properties uploaded yet.</p>
      <NuxtLink to="/property_upload"
        ><el-button type="primary" size="mini"
          ><i class="el-icon-plus mr-10"></i>Upload Property</el-button
        ></NuxtLink
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IMixinState } from '@/types/mixinsTypes';

export default Vue.extend({
  name: 'ProfileListings',
  props: {
    user_listings: {
      required: true,
      type: Array,
    },
    fetchListings: {
      required: true,
      type: Function,
    },
  },
  data() {
    return {
      email: '' as string,
      pageLoad: false,
    };
  },

  methods: {
    deleteListingModal(listing_id: string) {
      // const h = this.$createElement
      this.$confirm('Are you sure you want to delete listing?', {
        cancelButtonText: 'No, i want to keep',
        confirmButtonText: 'Yes,I want to delete it',
      })
        .then(() => {
          this.deleteListing(listing_id);
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
    async deleteListing(listing_id: string) {
      try {
        const ListingResponse = await this.$listingApi.delete(listing_id);

        console.log(ListingResponse);

        this.fetchListings();
        (this as any as IMixinState).$message({
          showClose: true,
          message: ListingResponse.message,
          type: 'success',
        });
      } catch (error) {
        console.log(error, 'error');
        (this as any as IMixinState).catchError(error);
      }
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
.property_container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  line-height: 16px;

  .property_image {
    width: 100%;
    height: 220px;
    background-repeat: no-repeat;
    background-size: 100%;
  }
  .card_body {
    padding: 10px 20px;
    .house_amount {
      color: #475569;
    }
    .house_plot {
      color: #64748b;
      font-size: 11px;
    }
  }
  .card_footer {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    border-top: 1px solid #e2e8f0;
    .property_img {
      width: 25px;
    }

    p {
      color: #94a3b8;
      font-size: 11px;
    }
    .house_bathroom {
      border-left: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      padding: 0 20px;
      @media (max-width: 1024px) {
        padding: 0 10px;
      }
      @media (max-width: 768px) {
        padding: 0 20px;
      }
      @media (max-width: 768px) {
        padding: 0 30px;
      }
    }
  }
  .fav {
    color: grey;
    cursor: pointer;
    display: flex;
  }
}
</style>
