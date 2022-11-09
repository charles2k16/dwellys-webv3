<template>
  <div>
    <el-row :gutter="20" v-if="listings.length > 0">
      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        v-for="property in listings"
        :key="property.id"
        style="height: 400px"
      >
        <!-- v-if="property.listing_detail.name == type" -->
        <el-card shadow="hover" class="property_container">
          <div
            class="property_image"
            :style="background_style(property.photos)"
            @click="openPropertyDetails(property)"
          >
            <div class="d-flex justify_between property_labels p-10">
              <p style="background: white">
                {{ property.listing_detail.category.name }}
              </p>
              <!-- <span class="d-flex">
                <span class="pt-2">{{ property.listing_total_views }} </span>
                <span style="color: #fff" class="material-icons ml-5">
                  visibility
                </span>
              </span> -->
              <span class="fav">
                <!-- <span style="color: #000" class="pt-2"
                  >{{ property.listing_total_likes }}
                </span> -->
                <span
                  class="material-icons ml-5"
                  @click="favProperty(property)"
                  :style="
                    favProperties.some((fav) => fav.id == property.id)
                      ? { color: 'red' }
                      : { color: 'white' }
                  "
                >
                  favorite
                </span>
              </span>
            </div>
          </div>
          <!-- <nuxt-link
            :to="{ name: 'property_details', params: { property: property } }"
          > -->
          <div class="card_body">
            <div class="d-flex justify_between">
              <p class="house_amount">
                GH₵ {{ property.listing_detail.price
                }}<span
                  v-if="property.listing_detail.category.name == 'Rent'"
                  class="month"
                  >/mth</span
                >
              </p>
              <p class="property_name">House</p>
            </div>

            <div class="d-flex justify_between">
              <p class="house_plot">
                {{ property.listing_detail.region }},
                {{ property.listing_detail.location }}
              </p>
            </div>
          </div>
          <div class="card_footer">
            <div
              class="pl-5 pt-5"
              v-for="specification in property.property_specifications"
              :key="specification.id"
            >
              <div class="d-flex align_center">
                <img src="~/assets/svg/bed.png" class="property_img pr-10" />
                <b>{{ specification.number }} </b>
              </div>
              <p>{{ specification.specification.name }}</p>
            </div>
            <!-- <div class="house_bathroom">
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
            </div> -->
          </div>
          <!-- </nuxt-link> -->
        </el-card>
      </el-col>
    </el-row>
    <div v-else class="d-flex justify_center p-20">
      <p>No Properties found</p>
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
  name: 'SearchProperties',
  data() {
    return {
      favProperties: [] as any,
    };
  },
  async created() {
    this.fetchFavorites();
  },

  methods: {
    async fetchFavorites() {
      if (this.$auth.loggedIn) {
        const userFavorite = await this.$userFavoriteApi.index();
        const favorites = userFavorite.data;

        for (let i = 0; i < favorites.length; i++) {
          this.favProperties.push(favorites[i].listing);
        }
        console.log('favorites', this.favProperties);
      }
    },
    truncateString(str: string) {
      if (str.length > 30) {
        return str.slice(0, 30) + '...';
      } else {
        return str;
      }
    },
    async favProperty(fav: any) {
      if (this.$auth.loggedIn) {
        let singleProperty = Object.assign([], this.favProperties);
        if (this.favProperties) {
          let favIndex = this.favProperties.findIndex(
            (prop: any) => prop.id == fav.id
          );

          singleProperty.includes(fav)
            ? this.favProperties.splice(favIndex, 1)
            : this.favProperties.push(fav);
        }
        console.log(this.favProperties);
        try {
          const favoriteResponse = await this.$selectFavoriteApi.create({
            listing_id: fav.id,
          });
          this.fetchFavorites();
          (this as any as IMixinState).$message({
            showClose: true,
            message: 'Added property to favourite!',
            type: 'success',
          });
        } catch (error: any) {
          (this as any as IMixinState).catchError(error);
          console.log(error?.response);
        }
      } else {
        this.$confirm('Login to select favourite', {
          confirmButtonText: 'Login',
          cancelButtonText: 'Cancel',
          type: 'success',
        })
          .then(() => {
            this.$router.push('/login');
          })
          .catch(() => {
            // this.$router.push("/register");
          });
      }
    },
    openPropertyDetails(property: any): void {
      this.$router.push({
        name: 'search',
        query: {
          name: property.listing_detail.name,
          id: property.id,
        },
      });
      //   this.$emit('property', property);
      console.log(property);
    },
  },
});
</script>

<style lang="scss" scoped>
.property_container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  line-height: 16px;
  cursor: pointer;

  .property_image {
    width: 100%;
    height: 220px;
    background-repeat: no-repeat;
    background-size: 100%;

    .property_labels {
      width: 100%;
      z-index: 20;

      p {
        padding: 2px 10px;
        border-radius: 7.34885px;
      }
    }
  }
  .card_body {
    padding: 10px;

    .property_name {
      // font-family: var(--font-primary-md), sans-serif;
      font-size: 11px;
    }
    .house_amount {
      color: #475569;
      font-family: var(--font-primary-md), sans-serif;
      .month {
        font-size: 13px;
        font-family: var(--font-primary-md), sans-serif;
      }
    }
    .house_plot {
      color: #64748b;
      font-size: 11px;
    }
  }
  .card_footer {
    display: flex;
    justify-content: space-around;
    padding: 5px 0;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
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
    cursor: pointer;
    display: flex;
    align-items: center;
    background: rgba(248, 250, 252, 0.44);
    border-radius: 100%;
    padding: 4px 4px 3px 0px;
  }
}
</style>
