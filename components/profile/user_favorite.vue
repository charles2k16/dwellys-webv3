<template>
  <div>
    <el-row :gutter="20" v-if="listings.length > 0">
      <el-col
        :xs="24"
        :sm="12"
        :md="6"
        v-for="(property, index) in listings"
        :key="index"
        class="pb-20"
        style="height: 400px">
        <el-card v-if="property.listing" shadow="hover" class="property_container">
          <div
            class="property_image"
            :style="background_style(property.feature_image_url)"
            @click.self="openPropertyDetails(property)">
            <!-- :style="background_style(property.listing.photos)" -->
            <div class="d-flex justify_between property_labels p-10">
              <p style="background: white">
                {{ property.listing.listing_detail.category.name }}
              </p>
              <span class="fav">
                <span style="color: #000" class="pt-2"
                  >{{ property.listing.listing_total_likes }}
                </span>
                <span
                  class="material-icons ml-5"
                  @click="favProperty(property.listing)"
                  :style="{ color: 'red' }">
                  favorite
                </span>
              </span>
            </div>
          </div>
          <!-- <nuxt-link
            :to="{ name: 'property_details', params: { property: property } }"
          > -->
          <div class="card_body" @click="openPropertyDetails(property)">
            <!-- amount -->
            <p class="house_amount">
              GH₵ {{ property.listing.listing_detail.price }}/mth
            </p>
            <p class="house_plot">
              {{ property.listing.listing_detail.region }},
              {{ property.listing.listing_detail.city }}
            </p>
          </div>
          <div class="card_footer" @click="openPropertyDetails(property)">
            <div
              class="pl-5"
              v-for="specification in property.listing.property_specifications"
              :key="specification.id">
              <div class="d-flex align_center">
                <img src="~/assets/svg/bed.png" class="property_img pr-10" />
                <b>{{ specification.number }} </b>
              </div>
              <p>{{ specification.specification.name }}</p>
            </div>
          </div>
          <!-- </nuxt-link> -->
        </el-card>
      </el-col>
    </el-row>
    <div v-else class="d-flex justify_center p-20">
      <h3>No Favorite found</h3>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { IMixinState } from '../../types/mixinsTypes';

export default Vue.extend({
  props: {
    listings: {
      required: true,
      type: Array,
    },
  },
  name: 'UserFavorite',
  data() {
    return {
      favProperties: [] as Array<object>,
    };
  },
  methods: {
    favProperty(fav: any) {
      this.$emit('favorite', fav.id);
    },
    openPropertyDetails(property: any): void {
      console.log(property);
      this.$router.push({
        name: 'property_details',
        // params: { property: property.id },
        query: {
          name: property.listing.listing_detail.name,
          id: property.listing.id,
        },
      });
      // this.$router.push(`property_details/${property.id}`);
    },
  },
});
</script>

<style lang="scss" scoped>
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
