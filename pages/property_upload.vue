<template>
  <div>
    <div class="section property_upload">
      <div v-if="step === 1">
        <div class="center">
          <div class="property_upload_head">
            <h3>What kind of property do you want to upload?</h3>
            <small>This describes the kind of property you have or want to share.</small>
          </div>
          <div class="block slider">
            <el-slider v-model="step" disabled :min="1" :max="7"></el-slider>
          </div>
        </div>

        <div class="property_content_container">
          <div class="d-flex_column justify_center">
            <p class="text-grey"><b>Do you want to rent or sell etc.?</b></p>
            <div class="mt-10">
              <el-select
                v-model="category"
                placeholder="Select category"
                class="full_width"
                @change="getCategory($event)">
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.name"
                  class="my-5">
                </el-option>
              </el-select>
            </div>

            <!-- </el-col>  -->
          </div>
          <div class="property_content" v-loading="pageLoad">
            <div v-for="property in propertyTypes" :key="property.id">
              <div
                class="property_main_content"
                @click="getProperty(property)"
                :style="
                  selectedProperty == property.name && {
                    backgroundColor: '#F1F5F9',
                  }
                ">
                <div class="d-flex_column">
                  <p class="text-grey">
                    <b> {{ property.name }} </b>
                  </p>
                  <p class="property_description mt-5">
                    {{ property.description }}
                  </p>
                </div>
                <img :src="property.photo" class="property_upload_photo" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="step === 2" v-loading="propLoad">
        <div class="center">
          <div class="property_upload_head">
            <h3>Provide information on the property specification</h3>
            <small>Number of bedrooms, bathrooms, garage, kitchen, etc</small>
          </div>
          <div class="block slider">
            <el-slider v-model="step" disabled :min="1" :max="7"></el-slider>
          </div>
        </div>
        <div class="property_content_container">
          <!-- <p style="color: red" v-if="specErr">{{ specErr }}</p> -->
          <div class="property_content pt-10">
            <div v-for="spec in propertySpecs.specifications" :key="spec.id">
              <div class="property_main_content">
                <p>
                  <b> {{ spec.name }} </b>
                </p>

                <el-input-number
                  :min="0"
                  size="small"
                  @change="getSpec(spec.number, spec.id, spec.name)"
                  v-model="spec.number">
                  {{ spec.number ? spec.number : 0 }}
                  <!-- v-model="propertyUpload.specifications.number" -->
                </el-input-number>
              </div>
            </div>
            <div
              v-for="(spec, index) in propertyUpload.other_specifications"
              :key="spec.id">
              <div class="other_specs">
                <div>
                  <div class="inner_specs">
                    <el-input v-model="spec.name" placeholder="Please specify if other">
                    </el-input>

                    <el-input-number
                      :min="0"
                      :disabled="!spec.name"
                      size="small"
                      v-model="spec.number">
                      {{ spec.number }}
                    </el-input-number>
                  </div>
                  <p
                    v-if="index != 0"
                    class="d-flex justify_end p-20"
                    style="color: red"
                    @click="removeSpec(index)">
                    <i class="el-icon-delete-solid" style="font-weight: 600"></i>
                  </p>
                </div>
                <p>For other living areas, please specify, eg, Patio, lounge, pool</p>
              </div>
            </div>
            <div class="d-flex justify_end mb-10">
              <el-button @click="addSpecSection"
                ><i class="el-icon-plus mr-10"></i>Add another section</el-button
              >
            </div>
          </div>
        </div>
      </div>
      <div v-if="step === 3">
        <div class="center">
          <div class="property_upload_head">
            <h3>Select all available amenities</h3>
            <small>Please check the plausible amenities</small>
          </div>
          <div class="block slider">
            <el-slider v-model="step" disabled :min="1" :max="7"></el-slider>
          </div>
        </div>
        <div class="grid_content_container">
          <div class="grid_container">
            <div v-for="(property, index) in amenities" :key="index">
              <div
                class="grid_content"
                @click="getAmenities(property)"
                :style="
                  propertyUpload.property_amenities_id.includes(property.id)
                    ? { background: '#E2E8F0' }
                    : { background: '#fff' }
                ">
                <div class="">
                  <!-- <img :src="getSvg(property.img)" class="pt-10" /> -->
                  <p class="mt-30">{{ property.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="step === 4">
        <div class="center">
          <div class="property_upload_head">
            <h3>Add images of the property</h3>
            <small>Please check the plausible amenities</small>
          </div>
          <div class="block slider">
            <el-slider v-model="step" disabled :min="1" :max="7"></el-slider>
          </div>
        </div>
        <div class="property_content_container pb-20">
          <div class="property_image_uploader">
            <input
              type="file"
              @change="toggleUpload"
              style="display: none"
              id="img"
              accept="image/x-png,image/jpeg" />
            <label for="img" class="property_image_main d-flex_column justify_center">
              <i class="el-icon-upload"></i><br />
              Drop file here or <em>click to upload</em></label
            >
          </div>

          <div class="uploadImgs">
            <div v-for="(image, index) in listing_photos" :key="image.photo">
              <img :src="image.photo" width="70px" class="mx-10 my-10" />
              <i
                class="el-icon-delete-solid deleteImgIcon"
                @click="removeUpload(index)"></i>
            </div>
          </div>
          <p v-if="imageErr" style="color: red">{{ imageErr }}</p>
        </div>
      </div>
      <!-- v-if="step === 5" -->
      <div v-if="step === 5">
        <div class="center">
          <div class="property_upload_head">
            <h3>Select property location</h3>
            <small>Select the location of the property</small>
          </div>
          <div class="block slider">
            <el-slider v-model="step" disabled :min="1" :max="7"></el-slider>
          </div>
        </div>
        <div class="property_content_container pb-20">
          <el-row class="pb-20">
            <el-col :sm="12" class="pb-20 d-flex_column pr-20">
              <span>Country</span>
              <el-select v-model="country" placeholder="Select" class="region pt-10">
                <el-option
                  v-for="(country, index) in countries"
                  :key="index"
                  :value="country.id"
                  :label="country.full_name">
                </el-option>
              </el-select>
              <!-- <el-input v-model="country" placeholder="Country"> </el-input> -->
            </el-col>
            <el-col :sm="12" class="pb-20 d-flex_column pr-20">
              <span>Select Region</span>
              <el-select
                v-model="propertyUpload.region"
                placeholder="Select"
                class="region pt-10">
                <el-option
                  v-for="region in Object.keys(regions)"
                  :key="region"
                  :value="region">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <!-- <el-row class="pb-20">
            <el-col :sm="12" class="pb-20 d-flex_column pr-20">
              <span>Longitude</span>
              <el-input
                v-model="propertyUpload.longitude"
                placeholder="Enter Longitude"
              >
              </el-input>
            </el-col>
            <el-col :sm="12" class="pb-20 d-flex_column pr-20">
              <span>Latitude</span>
              <el-input
                v-model="propertyUpload.latitude"
                placeholder="Enter Latitude"
              >
              </el-input>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :sm="12" class="pb-20 d-flex_column">
              <span>Location</span>
              <el-select
                v-model="propertyUpload.location"
                placeholder="Location"
                class="region pt-10">
                <el-option
                  v-for="region in regions[propertyUpload.region]"
                  :key="region"
                  :value="region">
                </el-option>
              </el-select>
            </el-col>
            <Map @latlng="getLatlng" />
          </el-row>
        </div>
      </div>
      <div v-if="step === 6">
        <div class="center">
          <div class="property_upload_head">
            <h3>Property price and description</h3>
            <!-- <small>Discount of the property</small> -->
          </div>
          <div class="block slider">
            <el-slider v-model="step" disabled :min="1" :max="7"></el-slider>
          </div>
        </div>
        <div class="property_content_container pb-20">
          <el-row class="pb-20 d-flex_column">
            <!-- <el-col :sm="12" class="pb-20 w-100 pr-5 d-flex_column">
              <span class="pb-10">Property Name</span>
              <el-input
                v-model="propertyUpload.name"
                type="text"
                placeholder="E.g Two bed room apartment"
              >
              </el-input>
            </el-col> -->
            <el-col :sm="12" class="pb-20 pl-5 w-100 d-flex_column">
              <span class="pb-10">Property Price</span>
              <el-input v-model="propertyUpload.price" type="number" placeholder="200">
                <template slot="prepend">GH&#8373; </template>
                <template slot="append" v-if="category == 'Rent'">per month</template>
              </el-input>
            </el-col>
          </el-row>
          <div>
            <span class="pb-10">Property Description</span>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="Please property description"
              v-model="propertyUpload.description">
            </el-input>
          </div>
        </div>
      </div>
      <div v-if="step === 7">
        <div class="center">
          <div class="property_upload_head">
            <h3>Plans and pricing</h3>
            <small>Please select Plan and Pricing</small>
          </div>
          <div class="block slider">
            <el-slider v-model="step" disabled :min="1" :max="7"></el-slider>
          </div>
        </div>
        <div class="plans_price pb-20">
          <PlansPricing :pricingPlans="pricingPlans" @getPlan="getPrice" />
        </div>
      </div>
      <hr class="hr_rule" />
      <div class="property_upload_btns pt-10">
        <el-button type="info" @click="toPrev" :disabled="step === 1">Back</el-button>
        <el-button
          type="primary"
          class="btn_sm submit_register_button"
          @click="submitUpload"
          :loading="btnLoading"
          :disabled="!isValid"
          v-if="step === 7"
          >Submit</el-button
        >
        <el-button
          type="primary"
          class="btn_sm submit_register_button"
          @click="toNext"
          :disabled="!isValid"
          v-else>
          Next</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import { IMixinState } from '@/types/mixinsTypes';
import ApplicationHandler from '@/handlers/ApplicationHandler.vue';
import regionsAndCities from '~/static/regions.json';
import Map from '../components/Properties/map.vue';
// const apiKey = process.env.GOOGLE_API_KEY;

export default Vue.extend({
  name: 'PropertyUpload',
  components: {
    ApplicationHandler,
    Map,
  },
  data() {
    return {
      step: 1 as number,
      // regions: {},
      category: '' as string,
      pageLoad: true as boolean,
      country: 'Ghana' as string,
      propLoad: false as boolean,
      propertySelected: false as boolean,
      media: 'Pay with Momo' as string,
      imageErr: '' as string,
      percentage_fraction: 0 as number,
      specErr: '' as string,
      selectedProperty: '',
      btnLoading: false as boolean,
      propertyTypes: [],
      propertySpecs: {
        specifications: [] as Array<object>,
      },
      regions: [] as Array<string>,
      categories: [],
      amenities: [],
      pricingPlans: [],
      countries: [
        {
          code: '+233',
          full_name: 'GHANA',
          id: '39a40751-d7d2-4346-99e5-b0235b520ce5',
          short_name: 'GH',
        },
      ],
      listing_photos: [] as any,
      listing_plan_id: '',
      listing_id: '',
      propertyUpload: {
        // name: '' as string,
        property_type_id: '' as string,
        country_id: '39a40751-d7d2-4346-99e5-b0235b520ce5' as string,
        // "39a40751-d7d2-4346-99e5-b0235b520ce5"
        listing_category_id: '' as string,
        latitude: 0 as number,
        longitude: 0 as number,
        specifications: [] as any,
        property_amenities_id: [] as Array<string>,
        description: '' as string,
        price: 0 as number,
        location: '',
        city: 'accra' as string,
        region: 'Greater Accra',
        other_specifications: [{ name: '', number: 0 }],
      },
    };
  },

  async created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      (this as any as IMixinState).getNotification(
        'Geolocation is not supported by this browser.',
        'error'
      );
    }
    try {
      const categories = await this.$listingCategoriesApi.index();
      this.categories = categories.data;

      const authors = await regionsAndCities;
      this.regions = authors;

      // const getOne = Object.keys(authors);
      // const values = authors['Ahafo'];

      const propertyTypes = await this.$propertyTypesApi.index();
      this.propertyTypes = propertyTypes.data;
      this.propertyTypes ? (this.pageLoad = false) : (this.pageLoad = true);

      const listingPlans = await this.$listingPlansApi.index();

      const plans = listingPlans.data.filter((plan: any) => plan.is_active == 1);

      this.pricingPlans = plans;

      const countries = await this.$countriesApi.index();
      countries.data.filter((country: any) =>
        country.short_name == 'GH' ? (this.propertyUpload.country_id = country.id) : ''
      );
      // this.countries = countries.data;
      // this.propertyTypes.country

      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(this.showPosition);
      // }
    } catch (error: any) {
      if (error?.response?.data) {
        (this as any as IMixinState).getNotification(
          'Please, login as an agent!',
          'warning'
        );
      }
    }
  },
  computed: {
    isValid() {
      let valid = false;
      if (
        this.step == 1 &&
        this.propertyUpload.property_type_id != '' &&
        this.propertyUpload.listing_category_id != ''
      ) {
        valid = true;
      } else if (this.step == 2 && this.propertyUpload.specifications.length > 0) {
        valid = true;
      } else if (this.step == 3 && this.propertyUpload.property_amenities_id.length > 0) {
        valid = true;
      } else if (this.step == 4 && this.listing_photos.length > 0) {
        valid = true;
      } else if (
        this.step == 5 &&
        this.propertyUpload.location != '' &&
        this.propertyUpload.region != '' &&
        this.propertyUpload.latitude &&
        this.propertyUpload.longitude
      ) {
        valid = true;
      } else if (
        this.step == 6 &&
        this.propertyUpload.price != 0 &&
        this.propertyUpload.description != ''
      ) {
        valid = true;
      } else if (this.step == 7 && this.listing_plan_id != '') {
        valid = true;
      }
      return valid;
    },
    submitVal() {
      let valid = false;
      if (this.step == 7 && this.propertyUpload.price) {
        valid = true;
      }
      return valid;
    },
  },
  methods: {
    removeUpload(index: number) {
      this.listing_photos.splice(index, 1);
    },
    removeSpec(index: number) {
      this.propertyUpload.other_specifications.splice(index, 1);
    },
    getSvg(pic: string): string {
      return require('../assets/svg/' + pic);
    },
    getLatlng(geoCode: any) {
      (this.propertyUpload.latitude = geoCode.latitude),
        (this.propertyUpload.longitude = geoCode.longitude);
    },
    getPrice(plan: any) {
      console.log(plan);
      this.percentage_fraction = plan.percentage_fraction_on_value;
      this.listing_plan_id = plan.id;
      // this.propertyUpload.plan = plan.price;
    },
    toggleUpload(event: any) {
      console.log(event.target.files[0]);
      const file = event.target.files[0];
      if (file.size >= 5000000) {
        this.imageErr = 'Each image must not exceed 5 Mb.';
      } else {
        this.imageErr = '';
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onloadend = () => {
          let img = { tag: 'front', is_featured: false, photo: reader.result };
          this.listing_photos.push(img);
        };
      }
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition);
      } else {
        (this as any as IMixinState).getNotification(
          'Geolocation is not supported by this browser.',
          'error'
        );
      }
    },
    showPosition(position: any) {
      this.propertyUpload.latitude = position.coords.latitude;
      this.propertyUpload.longitude = position.coords.longitude;
    },
    addSpecSection() {
      let newSection = { name: '', number: 0 };
      this.propertyUpload.other_specifications.push(newSection);
    },
    async getProperty(newProperty: any) {
      this.propertyUpload.property_type_id = newProperty.id;
      // this.propertyUpload.name = newProperty.name;
      this.selectedProperty = newProperty.name;

      const property = await this.$propertyTypesApi.show(newProperty.id);
      this.propertySpecs = property.data;
      this.amenities = property.data.amenities;
      this.propertySpecs ? (this.propLoad = false) : (this.propLoad = true);
    },
    getAmenities(property: any): void {
      let singlePlan = Object.assign([], this.propertyUpload.property_amenities_id);
      if (this.propertyUpload.property_amenities_id) {
        let amenityIndex = this.propertyUpload.property_amenities_id.indexOf(property.id);
        singlePlan.includes(property.id)
          ? this.propertyUpload.property_amenities_id.splice(amenityIndex, 1)
          : this.propertyUpload.property_amenities_id.push(property.id);
      }
    },
    getSpec(num: Number, specId: string, name: string) {
      let specifications = Object.assign([], this.propertyUpload.specifications);

      let specIndex = specifications.findIndex(
        (spec: any) => spec.property_type_specification_id == specId
      );

      if (specIndex == -1) {
        this.propertyUpload.specifications.push({
          number: num,
          name: name,
          property_type_specification_id: specId,
        });
      } else {
        this.propertyUpload.specifications[specIndex].number = num;
      }
    },
    toPrev(): void {
      this.step--;
    },
    toNext() {
      this.step++;
    },
    getCategory(e: any) {
      this.categories.filter((category: any) =>
        category.name == e ? (this.propertyUpload.listing_category_id = category.id) : ''
      );
    },

    async submitUpload() {
      this.btnLoading = true;
      try {
        // console.log(this.propertyUpload);

        const propertyResponse = await this.$listingApi.create(this.propertyUpload);
        console.log('property upload', propertyResponse);
        // const imageListing = await this.$listingImagesApi.create({
        //   listing_id: propertyResponse.data.id,
        //   listing_photos: this.listing_photos,
        // });
        this.btnLoading = false;
        if (this.percentage_fraction != 100) {
          this.$router.replace({
            name: 'checkout',
            query: {
              listing_id: propertyResponse.data.id,
              plan_id: this.listing_plan_id,
              category: this.category,
            },
          });
        }
        this.$router.replace('/');

        // (this as any as IMixinState).$message({
        //   showClose: true,
        //   message: propertyResponse.message,
        //   type: "success",
        // });
      } catch (error: any) {
        console.log(error, 'error');
        this.btnLoading = false;
        if (error?.response?.data) {
          (this as any as IMixinState).$message({
            showClose: true,
            message: error.response.data.message,
            type: 'error',
          });
        }
        // (this as any as IMixinState).catchError(error);
      }
    },
  },
});
</script>

<style lang="scss">
$small_screen: 426px;
$medium_screen: 769px;

.property_upload {
  padding-top: 80px;
  padding-bottom: 50px;
  @media (max-width: $small_screen) {
    padding: 20px 20px 0;
  }
  //   margin: 0 auto;
  .property_upload_head {
    padding-bottom: 30px;
    h3 {
      font-size: 24px;
      padding-bottom: 5px;
      line-height: 28px;
      letter-spacing: -0.02em;
      color: #1e293b;

      @media (max-width: $small_screen) {
        text-align: left;
      }
    }
    small {
      font-size: 14px;
      line-height: 20px;
      color: #64748b;
    }
  }
  .property_content_container {
    padding-top: 20px;
    width: 50%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    @media (max-width: $small_screen) {
      width: 100%;
      margin: 0;
    }
    .property_image_uploader {
      border: 1px dotted black;
      height: 250px;
      width: 100%;
      .property_image_main {
        height: 250px;
        position: relative;
        width: 100%;
        i {
          font-size: 50px;
          color: grey;
        }
      }
    }
    .property_content {
      margin-top: 20px;
      height: 400px;
      overflow-y: scroll;

      .property_main_content {
        display: flex;
        justify-content: space-between;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        margin-bottom: 10px;
        padding: 15px;
        cursor: pointer;
        margin-right: 10px;
        @media (max-width: $small_screen) {
          img {
            display: none;
          }
        }
        .property_description {
          font-size: 14px;
          color: #475569;
        }
        .property_upload_photo {
          border-radius: 7px;
          max-width: 70px;
          height: 50px;
          width: 100%;
        }
      }
    }
  }
  .property_upload_btns {
    width: 50%;
    margin: 0 auto;
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    @media (max-width: $small_screen) {
      width: 100%;
      margin: 0;
      padding-bottom: 20px;
    }
  }
  .slider {
    width: 50%;
    margin: 0 auto;
  }
  .grid_content_container {
    padding-top: 20px;
    width: 60%;
    margin: 0 auto;
    @media (max-width: $small_screen) {
      width: 100%;
      margin: 0;
    }
    .grid_container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 40px;

      @media (max-width: $small_screen) {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      .grid_content {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        text-align: center;
        padding: 20px;
      }
    }
  }
  .plans_price {
    // display: flex;
    display: grid;
    grid-template-columns: repeat(4, 50%);
    @media (max-width: $medium_screen) {
      margin: 0 auto;
      width: 90%;
      grid-template-columns: repeat(2, 300px);
    }
    @media (max-width: $small_screen) {
      width: 100%;
      grid-template-columns: repeat(1, 1fr);
    }
  }
  .other_specs {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    margin-bottom: 10px;
    padding: 15px;
    p {
      font-size: 13px;
      color: #94a3b8;
    }
  }
  .inner_specs {
    display: flex;
    justify-content: space-between;
  }

  .region {
    width: 100%;
  }
  .uploadImgs {
    display: grid;
    align-items: baseline;
    // width: fit-content;
    grid-template-columns: repeat(auto-fit, minmax(100px, 120px));
  }
  .deleteImgIcon {
    color: red;
  }
}
.map_container {
  width: 50%;
  margin: 20px auto;

  #map {
    height: 50vh;
    width: 100%;
  }
}
</style>
