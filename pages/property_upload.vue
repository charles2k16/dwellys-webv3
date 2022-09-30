<template>
  <div>
    <div class="section property_upload">
      <div v-if="step === 1">
        <div class="center">
          <div class="property_upload_head">
            <h3>What kind of property do you want to upload?</h3>
            <small
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit.</small
            >
          </div>
          <div class="block slider">
            <el-slider v-model="step" disabled :min="1" :max="8"></el-slider>
          </div>
        </div>

        <div class="property_content_container" v-loading="pageLoad">
          <div class="d-flex_column pb-20 pt-20 justify_center">
            <p><b>Select Category</b></p>
            <el-select
              v-model="category"
              placeholder="Select"
              class="category pt-10"
              @change="getCategory($event)"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :value="category.name"
                class="py-10"
              >
              </el-option>
            </el-select>
            <!-- </el-col>  -->
          </div>
          <div class="property_content">
            <div v-for="property in propertyTypes" :key="property.id">
              <div
                class="property_main_content"
                @click="getProperty(property)"
                :style="
                  selectedProperty == property.name && {
                    backgroundColor: '#F1F5F9',
                  }
                "
              >
                <div class="d-flex_column">
                  <p>
                    <b> {{ property.name }} </b>
                  </p>
                  <p class="property_description">
                    {{ property.description }}
                  </p>
                </div>
                <img
                  :src="url() + '/' + property.photo"
                  class="property_upload_photo"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="map_container">
          <div class="mb-20">
            <!-- <input id="address" type="textbox" :value="searched" />
            <input type="button" value="Search" @click="codeAddress" /> -->
            <input
              id="pac-input"
              class="controls"
              ref="search"
              type="textbox"
              :value="searched"
            />
          </div>
          <div id="map" ref="map"></div>
        </div>
      </div>
      <div v-if="step === 2" v-loading="propLoad">
        <div class="center">
          <div class="property_upload_head">
            <h3>Provide information on the property specification</h3>
            <small>Number of bedrooms, bathrooms, garage, kitchen, etc</small>
          </div>
          <div class="block slider">
            <el-slider v-model="step" disabled :min="1" :max="8"></el-slider>
          </div>
        </div>
        <div class="property_content_container">
          <!-- <p style="color: red" v-if="specErr">{{ specErr }}</p> -->
          <div class="property_content pt-10">
            <div v-for="spec in propertySpecs.specifications" :key="spec.id">
              <div class="property_main_content">
                <div class="d-flex_column">
                  <p>
                    <b> {{ spec.name }} </b>
                  </p>
                </div>
                <div class="d-flex">
                  <el-input-number
                    :min="0"
                    size="small"
                    @change="getSpec(spec.number, spec.id)"
                    v-model="spec.number"
                  >
                    {{ spec.number ? spec.number : 0 }}
                    <!-- v-model="propertyUpload.specifications.number" -->
                  </el-input-number>
                </div>
              </div>
            </div>
            <div
              v-for="(spec, index) in propertyUpload.other_specifications"
              :key="spec.id"
            >
              <div class="other_specs">
                <div>
                  <div class="inner_specs">
                    <div class="d-flex_column">
                      <el-input
                        v-model="spec.name"
                        placeholder="Please specify if other"
                      >
                      </el-input>
                    </div>
                    <div class="d-flex">
                      <el-input-number
                        :min="0"
                        :disabled="!spec.name"
                        size="small"
                        v-model="spec.number"
                      >
                        {{ spec.number }}
                      </el-input-number>
                    </div>
                    <!-- <p
                    v-if="index != 0"
                    class="w-50 d-flex justify_end m-10"
                    style="color: red"
                    @click="removeSpec(index)"
                  >
                    <i
                      class="el-icon-delete-solid"
                      style="font-weight: 600"
                    ></i>
                  </p> -->
                  </div>
                  <p
                    v-if="index != 0"
                    class="d-flex justify_end p-20"
                    style="color: red"
                    @click="removeSpec(index)"
                  >
                    <i
                      class="el-icon-delete-solid"
                      style="font-weight: 600"
                    ></i>
                  </p>
                </div>
                <p>
                  For other living areas, please specify, eg, Patio, lounge,
                  pool
                </p>
              </div>
            </div>
            <div class="d-flex justify_end">
              <el-button @click="addSpecSection"
                ><i class="el-icon-plus mr-10"></i>Add another
                section</el-button
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
            <el-slider v-model="step" disabled :min="1" :max="8"></el-slider>
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
                "
              >
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
            <el-slider v-model="step" disabled :min="1" :max="8"></el-slider>
          </div>
        </div>
        <div class="property_content_container pb-20">
          <div class="property_image_uploader">
            <input
              type="file"
              @change="toggleUpload"
              style="display: none"
              id="img"
              accept="image/x-png,image/jpeg"
            />
            <label
              for="img"
              class="property_image_main d-flex_column justify_center"
            >
              <i class="el-icon-upload"></i><br />
              Drop file here or <em>click to upload</em></label
            >
          </div>

          <div class="uploadImgs">
            <div v-for="(image, index) in listing_photos" :key="image.photo">
              <img :src="image.photo" width="70px" class="mx-10 my-10" />
              <i
                class="el-icon-delete-solid deleteImgIcon"
                @click="removeUpload(index)"
              ></i>
            </div>
          </div>
          <p v-if="imageErr" style="color: red">{{ imageErr }}</p>
        </div>
      </div>
      <div v-if="step === 5">
        <div class="center">
          <div class="property_upload_head">
            <h3>Select property location</h3>
            <small>Select the location of the property</small>
          </div>
          <div class="block slider">
            <el-slider v-model="step" disabled :min="1" :max="8"></el-slider>
          </div>
        </div>
        <div class="property_content_container pb-20">
          <el-row class="pb-20">
            <el-col :sm="12" class="pb-20 d-flex_column pr-20">
              <span>Country</span>
              <el-select
                v-model="propertyUpload.country"
                placeholder="Select"
                class="region pt-10"
              >
                <el-option
                  v-for="(country, index) in countries"
                  :key="index"
                  :value="country.id"
                  :label="country.full_name"
                >
                </el-option>
              </el-select>
              <!-- <el-input v-model="country" placeholder="Country"> </el-input> -->
            </el-col>
            <el-col :sm="12" class="pb-20 d-flex_column pr-20">
              <span>Select Region</span>
              <el-select
                v-model="propertyUpload.region"
                placeholder="Select"
                class="region pt-10"
              >
                <el-option
                  v-for="region in Object.keys(regions)"
                  :key="region"
                  :value="region"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="pb-20">
            <el-col :sm="12" class="pb-20 d-flex_column">
              <span class="pb-10">Location</span>
              <el-select
                v-model="propertyUpload.location"
                placeholder="Location"
                class="region pt-10"
              >
                <el-option
                  v-for="region in regions[propertyUpload.region]"
                  :key="region"
                  :value="region"
                >
                </el-option>
              </el-select>
            </el-col>
            <div class="map_container">
              <div class="mb-20">
                <!-- <input id="address" type="textbox" :value="searched" />
            <input type="button" value="Search" @click="codeAddress" /> -->
                <input
                  id="pac-input"
                  class="controls"
                  ref="search"
                  type="textbox"
                  :value="searched"
                />
              </div>
              <div id="map" ref="map"></div>
            </div>
          </el-row>
        </div>
      </div>
      <div v-if="step === 6">
        <div class="center">
          <div class="property_upload_head">
            <h3>Property name and price</h3>
            <!-- <small>Discount of the property</small> -->
          </div>
          <div class="block slider">
            <el-slider v-model="step" disabled :min="1" :max="8"></el-slider>
          </div>
        </div>
        <div class="property_content_container pb-20">
          <el-row class="pb-20 d-flex_column">
            <el-col :sm="12" class="pb-20 w-100 pr-5 d-flex_column">
              <span class="pb-10">Property Name</span>
              <el-input
                v-model="propertyUpload.name"
                type="text"
                placeholder="E.g Two bed room apartment"
              >
              </el-input>
            </el-col>
            <el-col :sm="12" class="pb-20 pl-5 w-100 d-flex_column">
              <span class="pb-10">Property Price</span>
              <el-input
                v-model="propertyUpload.price"
                type="number"
                placeholder="200"
              >
                <template slot="prepend">GH&#8373; </template>
                <template slot="append" v-if="category == 'Rent'"
                  >per month</template
                >
              </el-input>
            </el-col>
          </el-row>
          <div>
            <span class="pb-10">Property Description</span>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="Please property description"
              v-model="propertyUpload.description"
            >
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
            <el-slider v-model="step" disabled :min="1" :max="8"></el-slider>
          </div>
        </div>
        <div class="plans_price pb-20">
          <PlansPricing :pricingPlans="pricingPlans" @getPlan="getPrice" />
        </div>
      </div>
      <div v-if="step === 8">
        <div class="payment_container">
          <div class="payment_section pr-30">
            <h3>Payment</h3>
            <el-divider></el-divider>
            <div>
              <p>Select payment media</p>
              <div class="payment_methods">
                <p
                  v-for="method in paymentMedia"
                  :key="method.method"
                  @click="changePaymentMedia(method.method)"
                  :style="
                    media == method.method && {
                      background: '#1e293b',
                      'border-radius': '5px',
                      color: '#fff',
                    }
                  "
                  class="p-10 selected_media"
                >
                  <i :class="method.icon"></i>
                  <span class="pl-5">{{ method.method }} </span>
                </p>
              </div>
              <div v-if="media == 'Pay with Momo'" class="pt-20">
                <p>For payment using your mobile money wallets</p>
                <div class="d-flex_column pt-10">
                  <span class="demo-input-label pl-10 pb-5"
                    >Service provider</span
                  >
                  <el-select
                    name=""
                    id=""
                    class="provider"
                    placeholder="Please select a service provider"
                    v-model="mobile"
                  >
                    <el-option
                      v-for="media in mobile_money"
                      :key="media"
                      :value="media"
                    >
                      {{ media }}
                    </el-option>
                  </el-select>
                </div>
                <div class="d-flex_column pt-10">
                  <span class="demo-input-label pl-10 pb-5">Phone number</span>
                  <el-input
                    type="number"
                    v-model="selectedPlan.mobile_money_number"
                    placeholder="+233 21 324 2334"
                  />
                </div>
              </div>
              <div v-else class="pt-20">
                <p class="py-10">For payment through bank account.</p>
                <div class="d-flex_column pt-10">
                  <span class="demo-input-label pl-10 pb-5"
                    >Card holder name</span
                  >
                  <el-input
                    v-model="selectedPlan.card_payment.name_on_card"
                    placeholder="Enter the card holder name"
                  />
                </div>
                <div class="d-flex_column pt-10">
                  <span class="demo-input-label pl-10 pb-5">Card Number</span>
                  <el-input
                    type="number"
                    v-model="selectedPlan.card_payment.card_number"
                    placeholder="0000 0000 0000 0000"
                  />
                  <section class="pt-10">
                    <span class="demo-input-label pt-5">CVV</span>
                    <el-input
                      v-model="selectedPlan.card_payment.cvv"
                      placeholder="CVV"
                    />
                  </section>
                </div>
                <div class="d-flex pt-10">
                  <section class="pr-10">
                    <span class="demo-input-label pl-10 pb-5"
                      >Expiry month</span
                    >
                    <el-input
                      type="number"
                      v-model="selectedPlan.card_payment.card_expiry_month"
                      placeholder="05"
                    />
                  </section>
                  <section class="">
                    <span class="demo-input-label pl-10 pb-5">Expiry Year</span>
                    <el-input
                      type="number"
                      v-model="selectedPlan.card_payment.card_expiry_year"
                      placeholder="2022"
                    />
                  </section>
                </div>
                <!-- <div class="py-30">
                <el-button type="primary" class="full_width"
                  >Proceed to payment</el-button
                >
              </div> -->
              </div>
            </div>
          </div>
          <div class="payment_section pl-30">
            <div class="discount">
              <section class="d-flex justify_between pb-5">
                <span>Discount code</span>
                <!-- <span>**Required</span> -->
              </section>
              <el-input v-model="discount_code" />
            </div>
            <div class="property_rental pt-20">
              <section class="d-flex justify_between">
                <span>Property {{ category }}</span>
                <span>$12.567</span>
              </section>
              <section class="d-flex justify_between py-10">
                <h5>Subtotal:</h5>
                <h5>$24.32</h5>
              </section>
            </div>
          </div>
        </div>
        <div class="payment_btn pb-30">
          <el-button
            type="primary"
            :loading="btnLoading"
            class="full_width"
            @click="sendPayment"
            >Proceed to payment</el-button
          >
        </div>
      </div>
      <hr class="hr_rule" />
      <div class="property_upload_btns pt-10" v-if="step != 8">
        <el-button type="info" @click="toPrev" :disabled="step === 1"
          >Back</el-button
        >
        <el-button
          type="primary"
          class="btn_sm submit_register_button"
          @click="submitUpload"
          :loading="btnLoading"
          :disabled="!submitVal"
          v-if="step === 7"
          >Submit</el-button
        >
        <el-button
          type="primary"
          class="btn_sm submit_register_button"
          @click="toNext"
          :disabled="!isValid"
          v-else
        >
          Next</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import { IMixinState } from "@/types/mixinsTypes";
import ApplicationHandler from "@/handlers/ApplicationHandler.vue";
import url from "../url";
import regionsAndCities from "~/static/regions.json";
// const apiKey = process.env.GOOGLE_API_KEY;
var geocoder: any;
var map: any;

export default Vue.extend({
  // head: {
  //   script: [
  //     {
  //       src: `https://maps.googleapis.com/maps/api/js?key=${apiKey}`,
  //       hid: "map",
  //       defer: true,
  //     },
  //   ],
  // },
  mounted() {
    this.initAutocomplete();
  },
  name: "PropertyUpload",
  components: {
    ApplicationHandler,
    // regionsAndCities,
  },

  data() {
    return {
      step: 1 as number,
      searched: "",
      mapQuery: "",
      map: null,
      // regions: {},
      category: "" as string,
      pageLoad: false as boolean,
      country: "Ghana" as string,
      propLoad: false as boolean,
      propertySelected: false as boolean,
      media: "Pay with Momo" as string,
      imageErr: "" as string,
      paymentMedia: [
        { method: "Pay with Momo", icon: "el-icon-mobile-phone" },
        { method: "Pay with card", icon: "el-icon-bank-card" },
      ],
      mobile_money: ["MTN Mobile money", "Vodafone Cash", "Zeepay"],
      mobile: "",
      specErr: "" as string,
      selectedProperty: "",
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
          code: "+233",
          full_name: "GHANA",
          id: "39a40751-d7d2-4346-99e5-b0235b520ce5",
          short_name: "GH",
        },
      ],
      listing_photos: [] as any,
      discount_code: "",
      listing_plan_id: "",
      listing_id: "",
      discount: {
        no_of_days: 0,
        percentage_value: 0,
      },
      selectedPlan: {
        listing_id: "",
        listing_planid: "",
        discount_code: "",
        payment_option: "",
        card_payment: {
          cvv: "",
          name_on_card: "",
          card_number: "",
          card_expiry_month: "",
          card_expiry_year: "",
        },
        mobile_money_number: "",
      },
      propertyUpload: {
        name: "" as string,
        property_type_id: "" as string,
        country_id: "39a40751-d7d2-4346-99e5-b0235b520ce5" as string,
        // "39a40751-d7d2-4346-99e5-b0235b520ce5"
        listing_category_id: "" as string,
        latitude: 5.627703749893443 as number,
        longitude: -0.08697846429555343 as number,
        specifications: [] as any,
        property_amenities_id: [] as Array<string>,
        description: "" as string,
        price: 0 as number,
        location: "",
        city: "accra" as string,
        region: "Greater Accra",
        other_specifications: [{ name: "", number: 0 }],
      },
    };
  },

  async created() {
    try {
      const categories = await this.$listingCategoriesApi.index();
      this.categories = categories.data;

      const authors = await regionsAndCities;
      this.regions = authors;

      const getOne = Object.keys(authors);
      const values = authors["Ahafo"];
      // console.log(getOne);

      console.log(values);

      const propertyTypes = await this.$propertyTypesApi.index();
      this.propertyTypes = propertyTypes.data;
      this.propertyTypes ? (this.pageLoad = false) : (this.pageLoad = true);

      const listingPlans = await this.$listingPlansApi.index();

      const plans = listingPlans.data.filter(
        (plan: any) => plan.is_active == 1
      );
      console.log(plans);
      this.pricingPlans = plans;

      const countries = await this.$countriesApi.index();
      countries.data.filter((country: any) =>
        country.short_name == "GH"
          ? (this.propertyUpload.country_id = country.id)
          : ""
      );
      // this.countries = countries.data;
      // this.propertyTypes.country
      console.log(this.countries);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition);
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data) {
        (this as any as IMixinState).getNotification(
          "Please, login as an agent!",
          "warning"
        );
      }
    }
  },
  computed: {
    isValid() {
      let valid = false;
      if (
        this.step == 1 &&
        this.propertyUpload.property_type_id != "" &&
        this.propertyUpload.listing_category_id != ""
      ) {
        valid = true;
      } else if (
        this.step == 2 &&
        this.propertyUpload.specifications.length > 0
      ) {
        valid = true;
      } else if (
        this.step == 3 &&
        this.propertyUpload.property_amenities_id.length > 0
      ) {
        valid = true;
      } else if (this.step == 4 && this.listing_photos.length > 4) {
        valid = true;
      } else if (
        this.step == 5 &&
        this.propertyUpload.location != "" &&
        this.propertyUpload.region != ""
      ) {
        valid = true;
      } else if (
        this.step == 6 &&
        this.propertyUpload.price != 0 &&
        this.propertyUpload.name != ""
      ) {
        valid = true;
      } else if (this.step == 7 && this.listing_plan_id != "") {
        valid = true;
      }
      return valid;
    },
    submitVal() {
      let valid = false;
      if (this.step == 7 && this.propertyUpload.price) {
        valid = true;
      }
      // if (
      //   this.step == 8 &&
      //   this.media == "Pay with Momo" &&
      //   this.selectedPlan.mobile_money_number &&
      //   this.mobile
      // ) {
      //   valid = true;
      // } else if (
      //   this.step == 8 &&
      //   this.media == "Pay with card" &&
      //   this.selectedPlan.card_payment.cvv &&
      //   this.selectedPlan.card_payment.name_on_card &&
      //   this.selectedPlan.card_payment.card_number &&
      //   this.selectedPlan.card_payment.card_expiry_month &&
      //   this.selectedPlan.card_payment.card_expiry_year
      // ) {
      //   valid = true;
      // }
      return valid;
    },
  },
  methods: {
    // RegionsAndCities() {
    //   return this.regionsAndCities
    // },

    initAutocomplete() {
      map = new google.maps.Map(this.$refs["map"] as HTMLElement, {
        center: { lat: 5.627703749893443, lng: -0.08697846429555343 },
        zoom: 13,
        // mapTypeId: "roadmap",
      });
      const input = this.$refs["search"] as HTMLInputElement;
      const searchBox = new google.maps.places.SearchBox(input);

      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
      });

      let markers: google.maps.Marker[] = [];

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        console.log(places);
        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
          }

          const icon = {
            url: place.icon as string,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
          };

          // Create a marker for each place.
          markers.push(
            new google.maps.Marker({
              map,
              icon,
              title: place.name,
              position: place.geometry.location,
            })
          );

          console.log(
            "maps",
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    },
    url() {
      return url();
    },
    changePaymentMedia(method: string) {
      this.selectedPlan.card_payment.cvv = "";
      this.selectedPlan.card_payment.name_on_card = "";
      this.selectedPlan.card_payment.card_number = "";
      this.selectedPlan.card_payment.card_expiry_month = "";
      this.selectedPlan.card_payment.card_expiry_year = "";
      this.selectedPlan.mobile_money_number = "";
      this.media = method;
    },
    removeUpload(index: number) {
      this.listing_photos.splice(index, 1);
    },
    removeSpec(index: number) {
      this.propertyUpload.other_specifications.splice(index, 1);
    },
    getImage(pic: any): string {
      return this.url() + pic;
    },
    getSvg(pic: string): string {
      return require("../assets/svg/" + pic);
    },
    getPrice(plan: any) {
      console.log(plan);
      this.listing_plan_id = plan.id;
      // this.propertyUpload.plan = plan.price;
    },
    toggleUpload(event: any) {
      console.log(event.target.files[0]);
      const file = event.target.files[0];
      if (file.size >= 5000000) {
        this.imageErr = "Each image must not exceed 5 Mb.";
      } else {
        this.imageErr = "";
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onloadend = () => {
          let img = { tag: "front", is_featured: false, photo: reader.result };
          this.listing_photos.push(img);
        };
      }
    },
    addSpecSection() {
      let newSection = { name: "", number: 0 };
      this.propertyUpload.other_specifications.push(newSection);
    },
    handlePreview() {},
    handleRemove() {},
    async getProperty(newProperty: any) {
      this.propertyUpload.property_type_id = newProperty.id;
      // this.propertyUpload.name = newProperty.name;
      this.selectedProperty = newProperty.name;

      const property = await this.$propertyTypesApi.show(newProperty.id);
      this.propertySpecs = property.data;
      this.amenities = property.data.amenities;
      this.propertySpecs ? (this.propLoad = false) : (this.propLoad = true);

      console.log(property);
    },
    getAmenities(property: any): void {
      let singlePlan = Object.assign(
        [],
        this.propertyUpload.property_amenities_id
      );
      if (this.propertyUpload.property_amenities_id) {
        let amenityIndex = this.propertyUpload.property_amenities_id.indexOf(
          property.id
        );
        singlePlan.includes(property.id)
          ? this.propertyUpload.property_amenities_id.splice(amenityIndex, 1)
          : this.propertyUpload.property_amenities_id.push(property.id);
      }

      console.log(this.propertyUpload.property_amenities_id);
    },
    getSpec(num: Number, specId: string) {
      let specifications = Object.assign(
        [],
        this.propertyUpload.specifications
      );

      let specIndex = specifications.findIndex(
        (spec: any) => spec.id == specId
      );
      console.log(specIndex);
      if (specIndex == -1) {
        this.propertyUpload.specifications.push({
          number: num,
          property_type_specification_id: specId,
        });
      } else {
        this.propertyUpload.specifications[specIndex].number = num;
      }
      console.log(this.propertyUpload.specifications);
    },
    toPrev(): void {
      this.step--;
    },
    toNext() {
      this.step++;
      console.log(this.propertyUpload);
    },
    getCategory(e: any) {
      console.log(e);
      this.categories.filter((category: any) =>
        category.name == e
          ? (this.propertyUpload.listing_category_id = category.id)
          : ""
      );
    },
    showPosition(position: any) {
      this.propertyUpload.latitude = position.coords.latitude;
      this.propertyUpload.longitude = position.coords.longitude;
    },
    async sendPayment() {
      this.btnLoading = true;
      try {
        const data = {
          listing_id: this.listing_id,
          listing_plan_id: this.listing_plan_id,
          discount_code: this.discount_code,
          payment_option:
            this.media == "Pay with Momo" ? "mobile_money" : "card_payment",
          card_pament: {
            cvv: this.selectedPlan.card_payment.cvv,
            name_on_card: this.selectedPlan.card_payment.name_on_card,
            card_expiry_month: this.selectedPlan.card_payment.card_expiry_month,
            card_expiry_year: this.selectedPlan.card_payment.card_expiry_year,
          },
          mobile_money_number: this.selectedPlan.mobile_money_number,
        };
        const selectdPlanResponse = await this.$SelectdPlanApi.create(data);
        console.log(selectdPlanResponse);
        this.btnLoading = false;
        (this as any as IMixinState).$message({
          showClose: true,
          message: selectdPlanResponse.message,
          type: "error",
        });
        this.$router.replace("/");
      } catch (error: any) {
        console.log(error, "error");
        (this as any as IMixinState).catchError(error);
        this.btnLoading = false;

        if (error?.response?.data) {
          (this as any as IMixinState).$message({
            showClose: true,
            message: error.response.data.message,
            type: "error",
          });
        }
      }
    },

    async submitUpload() {
      this.btnLoading = true;
      try {
        // console.log(this.propertyUpload);

        const propertyResponse = await this.$listingApi.create(
          this.propertyUpload
        );
        console.log("property upload", propertyResponse);
        const imageListing = await this.$listingImagesApi.create({
          listing_id: propertyResponse.data.id,
          listing_photos: this.listing_photos,
        });
        console.log(propertyResponse);

        this.listing_id = propertyResponse.data.id;

        this.btnLoading = false;
        this.step++;
        (this as any as IMixinState).$message({
          showClose: true,
          message: propertyResponse.message,
          type: "success",
        });
      } catch (error) {
        console.log(error, "error");
        this.btnLoading = false;
        (this as any as IMixinState).catchError(error);
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
      font-size: 20px;
      padding-bottom: 5px;
      line-height: 27px;

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
        @media (max-width: $small_screen) {
          img {
            display: none;
          }
        }
        .property_description {
          font-size: 12px;
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

  .category {
    width: 70%;
    margin: 0 auto;
  }

  .payment_container {
    display: flex;
    padding-bottom: 30px;
    @media (max-width: $medium_screen) {
      flex-direction: column;
    }
    .discount {
      background: #f1f5f9;
      border-radius: 8px;
      padding: 20px;
    }
    .payment_section {
      width: 50%;
      @media (max-width: $medium_screen) {
        width: 80%;
        margin: 0 auto;
        padding-right: 0 !important;
        padding-left: 0 !important;
        padding-top: 20px;
      }
      @media (max-width: $small_screen) {
        width: 100%;
        padding-right: 0 !important;
        padding-left: 0 !important;
      }
      .payment_methods {
        display: flex;
        background: #f8fafc;
        padding-left: 10px;
        border-radius: 8px;
        @media (max-width: 320px) {
          flex-direction: column;
        }
      }
    }
  }
  .payment_btn {
    width: 50%;
    padding-right: 30px;
    @media (max-width: $medium_screen) {
      width: 80%;
      margin: 0 auto;
      padding-right: 0;
    }
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
