<template>
  <div v-loading="loading">
    <div ref="property_details" class="section pt-20">
      <ApplicationHandler ref="propertyAction" />
      <el-dialog :visible.sync="dialogVisible" width="50%">
        <div>
          <img :src="apiUrl + '/' + modalImage" class="carousel_image" />
        </div>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >Confirm</el-button
          >
        </span> -->
      </el-dialog>
      <div class="align_center mb-10 pt-10">
        <div class="arrow_back">
          <div @click="$router.back()">
            <span class="material-icons">arrow_back</span>
          </div>
        </div>
        <p v-if="propertyDetails.listing_detail">
          <b
            >{{ propertyDetails.listing_detail.name }}
            -
            {{ propertyDetails.listing_detail.location }},
            {{ propertyDetails.listing_detail.region }}
          </b>
        </p>
      </div>
      <div class="d-flex justify_between flex-wrap pb-10 text-grey">
        <div class="details_plot">
          <p class="align_center mr-20">
            <span class="material-icons mr-5"> room </span
            >{{
              propertyDetails.listing_detail &&
              propertyDetails.listing_detail.city
            }}
          </p>

          <p class="align_center">
            <span class="material-icons mr-5"> schedule </span>Last updated,
            {{ $moment(propertyDetails.updated_at).format('MMMM Do YYYY') }}
          </p>
        </div>
        <div class="details_plot">
          <p class="d-flex pr-20">
            <span class="material-icons mr-5"> visibility </span>
            <span style="paddingtop: 2px; paddingleft: 2px"
              ><b>{{ propertyDetails.listing_total_views }}</b>
            </span>
          </p>
          <p class="align_center mr-20">
            <span class="material-icons mr-5"> share </span>Share
          </p>
          <p class="align_center">
            <span
              class="material-icons ml-5"
              @click="favProperty(propertyDetails)"
              :style="
                favProperties.includes(propertyDetails)
                  ? { color: 'red' }
                  : { color: 'grey' }
              "
            >
              favorite
            </span>
            <span class="pl-5">
              <b>{{ propertyDetails.listing_total_likes }}</b>
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="mob-margin section" style="height: 700px">
      <el-row :gutter="20" v-if="propertyDetails.listing_detail">
        <el-col :xs="24" :sm="24" :md="hasMorePhotos ? 20 : 24">
          <el-carousel :interval="5000" arrow="always">
            <el-carousel-item
              v-for="(image, index) in propertyDetails.listing_detail
                .listing_images"
              :key="index"
            >
              <img :src="apiUrl + '/' + image.photo" class="carousel_image" />
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
              :src="apiUrl + '/' + image.photo"
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
            <p class="pb-10"><b> Basic Information</b></p>

            <div class="basic_specifications">
              <span
                class="info_card"
                v-for="(
                  specification, index
                ) in propertyDetails.property_specifications"
                :key="index"
              >
                <p>
                  {{ specification.number }}
                  {{ specification.specification.name }}
                </p>
              </span>

              <span
                class="info_card"
                v-for="specification in propertyDetails.other_specifications"
                :key="specification.id"
              >
                <p class="d-flex">
                  {{ specification.number }}
                  {{ specification.name }}
                </p>
              </span>
            </div>

            <div class="property_description mt-20">
              <h4>Description</h4>
              <p>
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
                <p>
                  {{
                    propertyDetails.listing_detail &&
                    propertyDetails.listing_detail.category.name
                  }}
                </p>
                <p class="mt-5 amout" v-if="propertyDetails.listing_detail">
                  <b style="font-size: 24px; line-height: 28px"
                    >GH₵{{ propertyDetails.listing_detail.price }}</b
                  ><span
                    v-if="
                      propertyDetails.listing_detail.category.name == 'Rent'
                    "
                    >/month</span
                  >
                </p>
                <div class="d-flex mt-20" v-if="propertyDetails.listing_detail">
                  <img
                    :src="apiUrl + '/' + propertyDetails.lister.avatar"
                    class="agent_avatar"
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
                    Send a message<span class="material-icons">
                      arrow_forward
                    </span>
                  </p></el-button
                >
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>

      <div class="amenities pb-20">
        <hr class="hr_rule" />
        <div class="amenities_content">
          <h4 class="mt-20">Amenities</h4>
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
      <div class="mt-20 mb-20" v-if="propertyDetails.listing_detail">
        <Map
          :lat="propertyDetails.listing_detail.latitude"
          :lng="propertyDetails.listing_detail.longitude"
        />
      </div>
      <div>
        <hr class="hr_rule" />
        <h4 class="mt-60">Similar properties</h4>

        <div class="pt-20">
          <SimilarProperties :listings="similarListings" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ApplicationHandler from '@/handlers/ApplicationHandler.vue';
import url from '../url';
import { IMixinState } from '../types/mixinsTypes';
import Map from '../components/profile/map.vue';

export default Vue.extend({
  scrollToTop: true,
  auth: false,
  name: 'PropertyDetails',
  components: {
    ApplicationHandler,
    Map,
  },
  data() {
    return {
      activeName: 'first' as string,
      dialogVisible: false as boolean,
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
      similarListings: [],
    };
  },

  watch: {
    $route() {
      this.scrollToTop();
      this.fetchData();
    },
  },
  created() {
    this.fetchData();
  },
  computed: {
    hasMorePhotos() {
      return this.propertyDetails.listing_detail.listing_images.length > 1;
    },
  },
  methods: {
    showImage(image: string) {
      this.modalImage = image;
      this.dialogVisible = true;
    },
    scrollToTop() {
      window.scrollTo(10, 10);
      // window.scrollTo(0, 0);
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
    url() {
      return url();
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
$medium_screen: 768px;
$small_screen: 426px;

.arrow_back {
  width: 40px;
  padding-top: 5px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  margin-right: 20px;
}
.has_more_photos {
  height: 700px;
  overflow-y: scroll;
}
.details_plot {
  display: flex;
  justify-content: space-between;
  p {
    font-size: 13px;
  }
  .material-icons {
    font-size: 18px;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 150px));
  .info_card {
    background: #f8fafc;
    padding: 5px 10px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    margin: 10px;
    display: flex;

    p {
      font-size: 13px;
    }
    .material-icons {
      font-size: 22px;
      color: grey;
    }
  }
}
.amenities {
  padding-top: 20px;

  .amenites_list {
    padding-top: 20px;
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(70px, 150px)) !important;
    width: 100%;
    max-width: 500px;

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
}
.property_description {
  p {
    font-size: 14px;
    margin-top: 10px;
  }
}

.info_side_card {
  width: 100%;

  @media (max-width: $small_screen) {
    margin-top: 40px;
  }

  .agent_avatar {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
  }
}
</style>
