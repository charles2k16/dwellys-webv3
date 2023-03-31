<template>
  <el-card shadow="hover" class="property_container">
    <div
      class="property_image"
      :style="background_style(property.photos)"
      @click.self="openPropertyDetails(property)">
      <div class="d-flex justify_between p-10">
        <p class="property_type">
          <span>{{ property.listing_detail.category.name }}</span>
        </p>
        <span class="fav">
          <span
            class="material-icons fav-icon"
            :style="
              favProperties && favProperties.some(fav => fav.id == property.id)
                ? { color: 'red' }
                : { color: 'white' }
            "
            @click="favProperty(property)">
            favorite
          </span>
        </span>
      </div>
    </div>
    <div class="card_body" @click="openPropertyDetails(property)">
      <div class="d-flex justify_between">
        <p class="property_amount">
          GH₵ {{ property.listing_detail.price
          }}<b v-if="property.listing_detail.category.name == 'Rent'">/mth</b>
        </p>
        <!-- <p class="property_name">House</p> -->
      </div>

      <div class="d-flex">
        <p class="property_location">
          {{ property.listing_detail.region }},
          {{ property.listing_detail.location }}
        </p>
      </div>
    </div>
    <div class="card_footer" @click="openPropertyDetails(property)">
      <div
        class="pl-5 pt-5 d-flex justify_start"
        v-for="specification in property.property_specifications"
        :key="specification.id">
        <div>
          <span class="d-flex align_center">
            <span class="material-icons mr-5 speci_icon">bed</span>
            <b style="font-size: 14px">{{ specification.number }} </b>
          </span>
          <p class="d-block">{{ specification.specification.name }}</p>
        </div>
        <div class="vr mt-15"></div>
        <div>
          <span class="d-flex align_center">
            <span class="material-icons mr-5 speci_icon">bathtub</span>
            <b style="font-size: 14px">{{ specification.number }} </b>
          </span>
          <p class="d-block">Bathrooms</p>
        </div>

        <!-- <img
                  v-if="
                    specification.specification.name == 'Bed room' ||
                    specification.specification.name == 'Bedroom'
                  "
                  src="~/assets/svg/bed.png"
                  class="property_img pr-10" />
                <img
                  v-else-if="
                    specification.specification.name == 'Bath room' ||
                    specification.specification.name == 'Bathroom'
                  "
                  src="~/assets/svg/bath.png"
                  class="property_img pr-10" />
                <img
                  v-else-if="specification.specification.name == 'Garage'"
                  src="~/assets/svg/garage.png"
                  class="property_img pr-10" />
                <img
                  v-else-if="specification.specification.name == 'Chair'"
                  src="~/assets/svg/chair.png"
                  class="property_img pr-10" />
                <img
                  v-else-if="
                    specification.specification.name == 'Dining room' ||
                    specification.specification.name == 'Diningroom'
                  "
                  src="~/assets/svg/kitchen.png"
                  class="property_img pr-10" />

                <b>{{ specification.number }} </b> -->

        <!-- <p>{{ specification.specification.name }}</p> -->
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { IMixinState } from '../../types/mixinsTypes';

export default Vue.extend({
  props: {
    property: {
      required: true,
      type: Object,
    },
    favProperties: {
      required: false,
      type: Array,
    },
  },
  name: 'PropertyCard',
  data() {
    return {
      // favProperties: [] as any,
    };
  },
  async created() {
    // this.fetchFavorites();
  },

  methods: {
    // async fetchFavorites() {
    //   if (this.$auth.loggedIn) {
    //     const userFavorite = await this.$userFavoriteApi.index();
    //     const favorites = userFavorite.data;

    //     for (let i = 0; i < favorites.length; i++) {
    //       this.favProperties.push(favorites[i].listing);
    //     }
    //     console.log("favorites", this.favProperties);
    //   }
    // },
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
          let favIndex = this.favProperties.findIndex((prop: any) => prop.id == fav.id);

          singleProperty.includes(fav)
            ? this.favProperties.splice(favIndex, 1)
            : this.favProperties.push(fav);
        }
        try {
          const favoriteResponse = await this.$selectFavoriteApi.create({
            listing_id: fav.id,
          });
          console.log(favoriteResponse, fav);
          // this.fetchFavorites();
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
        name: 'property_details',
        // params: { property: property.id },
        query: {
          name: property.listing_detail.name,
          id: property.id,
        },
      });
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
    height: 250px;
    background-repeat: no-repeat;
    background-size: 100%;

    .property_type {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 4.89923px 12.2481px;
      gap: 12.25px;

      width: 53.5px;
      height: 23.8px;

      background: #ffffff;
      border-radius: 7.34885px;

      span {
        font-weight: 400;
        font-size: 13.4729px;
        line-height: 13px;
        display: flex;
        align-items: center;
        color: #64748b;
      }
    }
  }
  .card_body {
    padding: 12px;

    .property_name {
      // font-family: var(--font-primary-md), sans-serif;
      font-size: 11px;
    }
    .property_amount {
      color: var(--text-primary);
      font-family: var(--font-primary-semi), sans-serif;
    }
    .property_location {
      color: #64748b;
      font-size: 11px;
    }
  }
  .card_footer {
    padding: 16px 12;
    background: #f8fafc;
    // border-top: 1px solid #e2e8f0;
    // background: #f8fafc;

    p {
      color: #94a3b8;
      font-size: 11px;
    }

    .speci_icon {
      color: #475569;
      font-size: 20px;
    }
  }
  .fav {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(248, 250, 252, 0.44);
    border-radius: 25.721px;
    padding: 3px;

    .fav-icon {
      text-shadow: 0 0 5px #f1f5f9;
      color: rgb(203, 202, 202);
    }
  }
}
</style>
