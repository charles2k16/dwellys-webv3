<template>
  <div v-loading="loading" class="section search_details_container">
    <el-drawer
      :visible.sync="filter_drawer"
      direction="rtl"
      :before-close="handleClose"
      class="filter_drawer"
    >
      <div class="all_filters">
        <div class="filter_prop_type">
          <el-radio-group
            v-model="search_property.category"
            style="margin-bottom: 30px"
          >
            <el-radio-button
              v-for="item in categories"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
              {{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div>
          <label for="">Price</label>
          <div class="pt-10">
            <div class="drawer_price">
              <el-input
                placeholder="min"
                type="number"
                v-model="search_property.min_price"
              >
                <template slot="prepend">GH&#8373; </template></el-input
              ><span class="px-10 pt-10 price_divider">-</span>
              <el-input
                placeholder="max"
                type="number"
                class="max_price"
                v-model="search_property.max_price"
              >
                <template slot="prepend">GH&#8373; </template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="pt-20">
          <label for="">Property Type</label>
          <div class="pt-10">
            <div class="all_filter_type">
              <div
                v-for="(type, index) in property_types"
                :key="index"
                @click="getPropertyType(type)"
                :style="
                  search_property.type == type.id && 'background:#de0b0b80'
                "
                class="center"
              >
                <!-- <img :src="apiUrl + '/' + type.photo" alt="" /> -->
                <span>{{ type.name }} </span>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-20">
          <div class="d-flex_column pb-10">
            <label for="bed" class="pb-5">Bed(s)</label>
            <el-input
              id="bed"
              class="w-100"
              placeholder="max"
              v-model="search_property.bed"
              type="number"
            >
            </el-input>
          </div>
          <div class="d-flex_column">
            <label for="baths" class="pb-5">Bathroom(s)</label>
            <el-input
              id="baths"
              class="w-100"
              placeholder="max"
              v-model="search_property.bathroom"
              type="number"
            ></el-input>
          </div>
        </div>
        <div class="all_filters_btn">
          <el-button type="primary" @click="filterProperty">Filter</el-button>
        </div>
      </div>
    </el-drawer>
    <div
      class="search_property_details"
      :style="similarListings.length < 1 && 'display:none'"
    >
      <div ref="property_details" class="">
        <ApplicationHandler ref="propertyAction" />
        <el-dialog :visible.sync="dialogVisible" width="50%">
          <div>
            <img :src="modalImage" class="carousel_image" />
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
          <el-col :xs="24" :sm="24">
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
      </div>
      <el-row>
        <el-col :xs="24" :sm="12">
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
                    :src="propertyDetails.lister.avatar"
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
    </div>

    <div
      class="search_property_similar"
      :style="similarListings.length < 1 && 'width:100%'"
    >
      <div class="pt-20">
        <div>
          <div class="content_search">
            <el-input
              type="search"
              @keyup.native.enter="queryProperty"
              v-model="search_property.search_query"
              placeholder="search..."
            ></el-input>
            <el-button type="primary" class="search_btn" @click="queryProperty"
              >Search</el-button
            >
          </div>
          <div class="search_options">
            <el-select
              v-model="search_property.category"
              placeholder="Category"
              class="search_option"
            >
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>

            <el-dropdown
              v-model="search_property.price"
              trigger="click"
              :hide-on-click="hidePrice"
              placeholder="Price"
              class="search_price mr-5"
            >
              <span class="el-dropdown-link drop_link d-flex justify_between">
                Price<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu
                slot="dropdown"
                style="max-width: 300px"
                class="price_dropdown"
              >
                <el-dropdown-item>
                  <!-- <div class="block">
                  <el-slider v-model="value" range :max="10000000"> </el-slider>
                </div> -->
                  <div class="price_drop_options">
                    <el-input
                      placeholder="min"
                      type="number"
                      v-model="search_property.min_price"
                    >
                      <template slot="prepend">GH&#8373; </template></el-input
                    ><span class="px-10 pt-10">-</span>
                    <el-input
                      placeholder="max"
                      type="number"
                      v-model="search_property.max_price"
                    >
                      <template slot="prepend">GH&#8373; </template>
                    </el-input>
                  </div>
                  <div class="d-flex justify_end pt-10">
                    <el-button @click="hidePrice = true" type="primary"
                      >Done</el-button
                    >
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown
              v-model="search_property.beds"
              trigger="click"
              :hide-on-click="hideSelect"
              class="search_price mr-5"
              placeholder="Bed/Baths"
            >
              <span class="el-dropdown-link drop_link d-flex justify_between">
                Bed/Baths<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" style="width: 200px">
                <el-dropdown-item>
                  <!-- <div class="block">
                  <el-slider v-model="value" range :max="10000000"> </el-slider>
                </div> -->
                  <div class="">
                    <div class="d-flex_column pb-10">
                      <label for="bed" class="pb-5">Bed(s)</label>
                      <el-input
                        id="bed"
                        class="w-100"
                        placeholder="max"
                        v-model="search_property.bed"
                        type="number"
                      >
                      </el-input>
                    </div>
                    <div class="d-flex_column">
                      <label for="baths" class="pb-5">Bathroom(s)</label>
                      <el-input
                        id="baths"
                        class="w-100"
                        placeholder="max"
                        v-model="search_property.bathroom"
                        type="number"
                      ></el-input>
                    </div>
                  </div>
                  <div class="d-flex justify_end pt-10">
                    <el-button @click="hideSelect = true" type="primary"
                      >Done</el-button
                    >
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-select
              v-model="search_property.type"
              class="search_option"
              placeholder="Select Type"
            >
              <!-- multiple -->
              <!-- collapse-tags -->
              <el-option
                v-for="item in property_types"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <div
              class="search_price el-dropdown"
              style="color: rgba(96, 98, 102, 0.5); cursor: pointer"
              @click="filter_drawer = true"
            >
              <span> <i class="el-icon-s-operation"></i> </span>
              <span>All Filters</span>
            </div>
            <div class="pl-10 pb-10">
              <el-button type="primary" @click="filterProperty"
                >Filter</el-button
              >
            </div>
          </div>
          <div class="search_price_container">
            <div
              class="search_price el-dropdown"
              style="color: rgba(96, 98, 102, 0.5); cursor: pointer"
              @click="filter_drawer = true"
            >
              <span> <i class="el-icon-s-operation"></i> </span>
              <span>All Filters</span>
            </div>
          </div>
        </div>
        <SearchProperties
          :listings="similarListings"
          @property="showProperty"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ApplicationHandler from '@/handlers/ApplicationHandler.vue';
import { IMixinState } from '../types/mixinsTypes';
import Map from '../components/profile/map.vue';

export default Vue.extend({
  scrollToTop: true,
  auth: false,
  name: 'propertySearch',
  components: {
    ApplicationHandler,
    Map,
  },
  data() {
    return {
      activeName: 'first' as string,
      dialogVisible: false as boolean,
      filter_drawer: false as boolean,
      loading: true as boolean,
      hidePrice: false as boolean,
      hideSelect: false as boolean,
      image: '' as any,
      // value: [null, null],
      modalImage: '' as any,
      search_property: {
        search_query: '' as any,
        type: '' as string,
        category: '' as string,
        min_price: null,
        max_price: null,
        bed: 0 as number,
        bathroom: 0 as number,
      },

      categories: [],
      property_types: [],
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
    if (this.$route.query.property) {
      this.search_property.search_query = this.$route.query.property;
      this.queryProperty();
    }
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
    handleClose() {
      this.filter_drawer = false;
    },
    async fetchData() {
      this.loading = true;

      try {
        const categories = await this.$listingCategoriesApi.index();
        this.categories = categories.data;

        const propertyTypes = await this.$showpropertytypesApi.index();
        console.log('types', propertyTypes);
        this.property_types = propertyTypes.data;

        const listings = await this.$listingApi.show(this.$route.query.id);
        console.log('listing details', listings.data);
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
    handleChange() {},
    showProperty(properties: any) {
      this.propertyDetails = properties;
    },

    getPropertyType(type: any) {
      this.search_property.type = type.id;
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
    async filterProperty() {
      let searched = this.search_property;
      // this.loading = true;
      let type = searched.type && `property_type=${searched.type}`;
      let max_price = searched.max_price && `max_price=${searched.max_price}`;
      let min_price = searched.min_price && `min_price=${searched.min_price}`;
      let category = searched.category && `category_id=${searched.category}`;
      let filteredSearch = [type, max_price, min_price, category];

      let joined = filteredSearch.join('&');

      console.log('query', joined);

      try {
        const similarProperties = await this.$searchProperties.query(
          this.search_property.type
        );
        console.log(similarProperties);
        this.propertyDetails = similarProperties.data[0];
        this.loadListing(similarProperties.data);
      } catch (error) {
        this.loading = false;
      }
    },
    async queryProperty() {
      try {
        const similarProperties = await this.$querySearchApi.query(
          this.search_property.search_query
        );
        console.log(similarProperties);
        this.propertyDetails = similarProperties.data[0];
        this.loadListing(similarProperties.data);
      } catch (error) {
        this.propertyDetails = {};
        this.similarListings = [];
        this.loading = false;
      }
    },
    prevImage(image: any) {
      this.image = image;
    },
    // queryProperty() {
    //   console.log(this.search_property);
    // },
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
.search_details_container {
  display: flex;
  margin-top: 30px;
  // flex-direction: column;
  // justify-content: space-evenly;
  .search_property_details,
  .search_property_similar {
    width: 50%;
  }
  .search_property_details {
    margin-right: 5px;
    @media (max-width: $small_screen) {
      display: none;
    }
  }
  .search_property_similar {
    margin-left: 5px;
    .price_dropdown {
      // // width: 300px !important;
      // background: green;
      // @media (max-width: $small_screen) {
      //   max-width: 200px;
      // }
      .price_drop_options {
        display: flex;

        @media (max-width: $small_screen) {
          display: flex;
          flex-direction: column;
        }
      }
    }
    @media (max-width: $small_screen) {
      width: 100%;
      // margin-top: 40px;
    }
  }
}
.content_search {
  width: 90%;
  // margin: 0 auto;
  display: flex;
  padding-left: 10px;
  padding-bottom: 10px;
  @media (max-width: $small_screen) {
    width: 100%;
  }
  .search_btn {
    margin-left: 5px;
    width: 20%;
    @media (max-width: $small_screen) {
      width: 30%;
    }
  }
}
.search_options {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  padding-left: 10px;
  @media (max-width: $small_screen) {
    display: none;
  }
  .search_option {
    margin-bottom: 5px;
    width: 25%;
    padding-right: 5px;
  }
}
.search_price_container {
  display: none;
  @media (max-width: $small_screen) {
    display: flex;
    justify-content: flex-end;
  }
  .drop_link {
    padding-top: 10px;
    color: rgba(96, 98, 102, 0.5);
  }
}
.all_filters {
  width: 80%;
  margin: 0 auto;
  .drawer_price {
    display: flex;
    .price_divider {
      @media (max-width: $small_screen) {
        display: none;
      }
    }
    @media (max-width: $small_screen) {
      display: flex;
      flex-direction: column;
    }
    .max_price {
      @media (max-width: $small_screen) {
        margin-top: 10px;
      }
    }
  }
  .filter_prop_type {
    display: flex;
    justify-content: center;
  }

  .all_filter_type {
    display: flex;
    flex-wrap: wrap;
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      width: 130px;
      border: 1px solid rgba(96, 98, 102, 0.5);
      border-radius: 10px;
      margin: 5px;
      i {
        font-size: 20px;
      }
    }
  }
  .all_filters_btn {
    margin-top: 40px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
  @media (max-width: $small_screen) {
    width: 100%;
    padding-right: 10px;
    padding-left: 10px;
  }
}

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
  height: 500px;
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
  border-radius: 5px;
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
  // grid-template-columns: repeat(auto-fit, minmax(70px, 150px));
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
    display: flex;
    flex-wrap: wrap;

    // grid-template-columns: repeat(auto-fit, minmax(70px, 150px)) !important;
    width: 100%;
    // max-width: 500px;

    li {
      list-style: none;
      padding-bottom: 20px;
      font-size: 14px;
      padding-right: 10px;
      line-height: 20px;
      margin-left: 20px;

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
