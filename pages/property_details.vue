<template>
  <div v-loading="loading">
    <div ref="property_details" class="section mt-30">
      <ApplicationHandler ref="propertyAction" />
      <div class="align_center mb-10 pt-10">
        <div class="arrow_back">
          <div @click="$router.back()">
            <span class="material-icons" style="color: #94a3b8"
              >arrow_back</span
            >
          </div>
        </div>
        <p v-if="propertyDetails.listing_detail">
          <b class="property_name"
            >{{ propertyDetails.listing_detail.name }}
            -
            {{ propertyDetails.listing_detail.location }}
            <!-- {{ propertyDetails.listing_detail.region }} -->
          </b>
        </p>
      </div>
      <div class="d-flex justify_between flex-wrap pb-10">
        <div class="details_plot">
          <p class="align_center mr-20 p-text">
            <span class="material-icons mr-5"> location_on </span
            >{{
              propertyDetails.listing_detail &&
              propertyDetails.listing_detail.city
            }}
          </p>

          <p class="align_center p-text">
            <span class="material-icons mr-5"> schedule </span>Last updated,
            {{ $moment(propertyDetails.updated_at).format('MMMM Do YYYY') }}
          </p>
        </div>
        <div class="details_plot">
          <p class="d-flex align-cennter pr-20 p-text">
            <span class="material-icons mr-5"> visibility </span>
            {{ propertyDetails.listing_total_views }}
          </p>
          <p class="align_center mr-20 p-text">
            <span class="material-icons mr-5"> share </span>Share
          </p>
          <p class="align_center p-text">
            <span
              class="material-icons mr-5"
              @click="favProperty(propertyDetails)"
              :style="
                favProperties.includes(propertyDetails)
                  ? { color: 'red' }
                  : { color: '#c4c6c9' }
              "
            >
              favorite
            </span>
            {{ propertyDetails.listing_total_likes }}
          </p>
        </div>
      </div>
    </div>
    <div class="mob-margin section">
      <el-row :gutter="20" v-if="propertyDetails.listing_detail">
        <el-col :xs="24" :sm="24" :md="hasMorePhotos ? 20 : 24">
          <el-carousel :interval="5000" arrow="always">
            <el-carousel-item
              v-for="(image, index) in propertyDetails.listing_detail
                .listing_images"
              :key="index"
            >
              <img :src="image.photo" class="carousel_image" />
            </el-carousel-item>
          </el-carousel>
        </el-col>

        <el-col
          :xs="8"
          :sm="8"
          :md="4"
          v-if="hasMorePhotos"
          class="has_more_photos hidden-sm-and-down"
        >
          <div
            class="thumbnail"
            v-for="(image, index) in propertyDetails.listing_detail
              .listing_images"
            :key="index"
          >
            <img
              :src="image.photo"
              class="_image"
              @click="showImage(image.photo)"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="section mt-20">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="18">
          <div>
            <p class="pb-10 details_title"><b> Basic Information</b></p>

            <div class="basic_specifications">
              <span
                class="info_card"
                v-for="(
                  specification, index
                ) in propertyDetails.property_specifications"
                :key="index"
              >
                <p class="align_center">
                  <span class="material-icons mr-5">bed</span>
                  {{ specification.number }}
                  {{ specification.specification.name }}
                </p>
              </span>

              <!-- <span
                class="info_card"
                v-for="specification in propertyDetails.other_specifications"
                :key="specification.id">
                <p class="d-flex">
                  {{ specification.number }}
                  {{ specification.name }}
                </p>
              </span> -->
            </div>

            <div class="mt-20">
              <h4 class="details_title">Description</h4>
              <p class="p-text mt-10">
                {{
                  propertyDetails.listing_detail &&
                  propertyDetails.listing_detail.description
                }}
              </p>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6">
          <div class="info_side_card">
            <el-card shadow="hover" class="p-10">
              <div style="height: 200px">
                <h4>
                  {{
                    propertyDetails.listing_detail &&
                    propertyDetails.listing_detail.category.name
                  }}
                </h4>
                <p class="mt-10 amout" v-if="propertyDetails.listing_detail">
                  <b style="font-size: 24px; line-height: 28px"
                    >GH₵{{ propertyDetails.listing_detail.price }}</b
                  ><small
                    v-if="
                      propertyDetails.listing_detail.category.name == 'Rent'
                    "
                    >/ month</small
                  >
                </p>
                <div class="d-flex mt-20" v-if="propertyDetails.listing_detail">
                  <img
                    v-if="propertyDetails.lister.avatar"
                    :src="propertyDetails.lister.avatar"
                    class="agent_avatar"
                  />
                  <img
                    v-else
                    src="~/assets/img/user_icon.png"
                    class="agent_avatar"
                    alt="icon"
                  />
                  <div class="ml-20">
                    <p>
                      <b
                        >{{
                          propertyDetails.listing_detail &&
                          propertyDetails.lister.first_name
                        }}
                        {{
                          propertyDetails.listing_detail &&
                          propertyDetails.lister.last_name
                        }}</b
                      >
                    </p>
                    <p style="font-size: 13px; color: #64748b">
                      {{
                        propertyDetails.lister.user_type == 'lister'
                          ? 'Independent agent'
                          : 'Admin'
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <el-button type="primary" style="width: 100%" @click="showOwner"
                  ><p class="d-flex justify_between">
                    Whatsapp Agent<span
                      class="material-icons"
                      style="color: white"
                    >
                      arrow_forward
                    </span>
                  </p></el-button
                >
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>

      <div class="mt-20 pb-20">
        <div class="amenities_content">
          <h4 class="mt-20 details_title">Amenities</h4>
          <ul class="amenites_list">
            <li
              v-for="amenity in propertyDetails.amenities"
              :key="amenity.amenity.name"
            >
              {{ amenity.amenity.name }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Property Location -->

      <div class="mt-20 mb-20" v-if="propertyDetails.listing_detail">
        <!-- <section class="share_cordinates">
          <el-dropdown trigger="click" class="mb-20">
            <span class="el-dropdown-link">
              <el-button type="primary">
                Share<i class="el-icon-arrow-down el-icon--right"></i
              ></el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <a
                  :href="`https://www.google.com/maps/search/?api=1&query=${propertyDetails.listing_detail.latitude},${propertyDetails.listing_detail.longitude}`"
                  target="_blank"
                  >Google Map</a
                >
              </el-dropdown-item>
              <el-dropdown-item>Bolt</el-dropdown-item>
              <el-dropdown-item
                ><a
                  :href="`m.uber.com/ul?client_id=1039031868707-iakjs1b8u7i12s3jb5l11on7uc8flkpr.apps.googleusercontent.com&dropoff[latitude]=${propertyDetails.listing_detail.latitude}&dropoff[longitude]=-${propertyDetails.listing_detail.longitude}`"
                  target="_blank"
                  >Uber</a
                ></el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </section> -->

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="18">
            <div class="d-flex justify_between">
              <h4 class="mt-20 details_title">Location</h4>
              <p class="align_center mr-20 p-text">
                <span class="material-icons mr-5"> location_on </span
                >{{
                  propertyDetails.listing_detail &&
                  propertyDetails.listing_detail.city
                }}
              </p>
            </div>
            <Map
              class="mt-20"
              :lat="propertyDetails.listing_detail.latitude"
              :lng="propertyDetails.listing_detail.longitude"
            />
          </el-col>
        </el-row>
      </div>
      <div>
        <h4 class="mt-60">Similar properties</h4>
        <div class="pt-20">
          <el-row :gutter="20" v-if="similarListings.length > 0">
            <el-col
              :xs="24"
              :sm="8"
              v-for="property in similarListings"
              :key="property.id"
              class="mt-20"
            >
              <PropertyCard :property="property" />
            </el-col>
          </el-row>
          <div v-else class="d-flex justify_center p-20">
            <p>No Properties found</p>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="showImageModal" width="50%">
      <div>
        <img :src="modalImage" class="carousel_image" />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ApplicationHandler from '@/handlers/ApplicationHandler.vue';
import { IMixinState } from '../types/mixinsTypes';
import Map from '../components/profile/map.vue';

export default Vue.extend({
  auth: false,
  name: 'PropertyDetails',
  components: {
    ApplicationHandler,
    Map,
  },
  data() {
    return {
      activeName: 'first' as string,
      showImageModal: false as boolean,
      loading: true as boolean,
      image: '' as any,
      modalImage: '' as any,
      propertyDetails: {} as any,
      home: '' as string,
      favProperties: [] as Array<object>,
      sendForm: {
        amount: null,
        recipient_amt: null,
        payment_method: '' as string,
      },
      user: '',
      similarListings: [] as any,
    };
  },
  watch: {
    $route() {
      //  refresh page so created runs again
      // this helps resolve the pagescroll to top issue
      this.$router.go();
    },
  },
  created() {
    this.fetchData();
    this.scrollToTop();
  },
  computed: {
    hasMorePhotos() {
      return this.propertyDetails.listing_detail.listing_images.length > 1;
    },
  },
  methods: {
    scrollToTop() {
      if (process.client) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    showImage(image: string) {
      this.modalImage = image;
      this.showImageModal = true;
    },
    async fetchData() {
      this.loading = true;
      try {
        const listings = await this.$listingApi.show(this.$route.query.id);
        this.propertyDetails = listings.data;
        const similarProperties = await this.$similarListingsApi.query(
          this.propertyDetails.property_type.name
        );
        this.loadListing(similarProperties.data);
      } catch (error) {
        this.loading = false;
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
      this.similarListings = data;
      this.loading = false;
    },
    async favProperty(fav: any) {
      if (this.$auth.loggedIn) {
        let singleProperty = Object.assign([], this.favProperties);
        if (this.favProperties) {
          let favIndex = this.favProperties.indexOf(fav);
          singleProperty.includes(fav)
            ? this.favProperties.splice(favIndex, 1)
            : this.favProperties.push(fav);
        }
        try {
          const favoriteResponse = await this.$selectFavoriteApi.create({
            listing_id: fav.id,
          });
          (this as any as IMixinState).$message({
            showClose: true,
            message: 'Added property to favourite!',
            type: 'success',
          });
        } catch (error: any) {}
      } else {
        this.$confirm('Login to select favourite', {
          confirmButtonText: 'Login',
          cancelButtonText: 'Cancel',
          type: 'success',
        })
          .then(() => {
            this.$router.push('/login');
          })
          .catch(() => {});
      }
    },
    prevImage(image: any) {
      this.image = image;
    },
    //  lastUpdate (date:any) {
    //     return moment(date).format("MMMM Do YYYY");
    //   },
    showOwner(): void {
      if (this.$auth.loggedIn) {
        (this as any).$refs.propertyAction.showMessageModal({
          user: this.propertyDetails.lister,
          url: this.$route.fullPath,
        });
      } else {
        (this as any as IMixinState).getNotification(
          'Login to send agent a message!',
          'warning'
        );
      }
    },
  },
});
</script>

<style lang="scss" scoped>
$laptop_screen: 1025px;
$medium_screen: 768px;
$small_screen: 426px;

.share_cordinates {
  @media (max-width: $small_screen) {
    display: flex;
    justify-content: flex-end;
  }
}

.property_name {
  font-size: 20px;
  font-weight: 510;
  line-height: 24px;
  position: relative;
  left: -55px;
  color: #1e293b;
  letter-spacing: -0.03em;
  @media (max-width: $laptop_screen) {
    left: 0;
  }
}

.details_title {
  color: #1e293b;
  font-weight: 510;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.03em;
}

.arrow_back {
  width: 40px;
  padding-top: 5px;
  border: 1px solid #cbd5e1;
  position: relative;
  left: -55px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  margin-right: 20px;
  @media (max-width: $laptop_screen) {
    left: 0;
  }
}
.has_more_photos {
  height: 700px;
  overflow-y: scroll;
}
.details_plot {
  display: flex;
  justify-content: space-between;
  @media (max-width: $laptop_screen) {
    padding-left: 55px;
  }
  @media (max-width: $small_screen) {
    width: 100%;
    padding: 0 20px;
    display: none;
  }
}
.carousel_image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
.thumbnail {
  width: 100%;
  height: 200px;

  ._image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.basic_specifications {
  display: flex;
  flex-wrap: wrap;
  .info_card {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f8fafc;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;

    p {
      font-size: 13px;
      color: #334155;
    }
    .material-icons {
      font-size: 20px;
      color: #94a3b8;
    }
  }
}
.amenites_list {
  padding-top: 30px;
  display: grid !important;
  column-gap: 20px;
  grid-template-columns: repeat(2, minmax(100px, 200px)) !important;
  width: 50%;
  // max-width: 500px;

  li {
    list-style: none;
    padding-bottom: 20px;
    font-size: 14px;
    line-height: 20px;
    margin-left: 15px;

    &::before {
      content: '\2022';
      color: red;
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }
}

.info_side_card {
  width: 100%;

  @media (max-width: $small_screen) {
    margin-top: 40px;
  }

  .agent_avatar {
    width: 43.78px;
    height: 43.78px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
  }
}

.material-icons {
  font-size: 18px;
  color: #94a3b8;
}

.p-text {
  font-size: 14px;
  line-height: 20px;
  color: #475569;
}
</style>
