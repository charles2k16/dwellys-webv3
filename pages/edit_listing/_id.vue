<template>
  <div class="section">
    <el-dialog
      title="Add Property Image(s)"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-upload
        id="category-image"
        class="image-upload"
        drag
        :on-change="newImage"
        action="#"
        multiple
        :auto-upload="false"
        accept="image/x-png,image/jpeg"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
      </el-upload>
      <div class="uploadImgs">
        <div v-for="image in photos" :key="image.photo">
          <img :src="image.photo" width="70px" class="mx-10 my-10" />
        </div>
      </div>
      <p v-if="imageErr" style="color: red">{{ imageErr }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeImgUpload">Cancel</el-button>
        <el-button type="primary" @click="addImages" :loading="loading"
          >Add Image(s)</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="Add Property Specification(s)"
      :visible.sync="specVisible"
      width="45%"
    >
      <div v-for="spec in propertySpecs" :key="spec.id">
        <div class="property_main_content">
          <div class="d-flex_column">
            <p>
              <b> {{ spec.name }} </b>
            </p>
          </div>
          <div class="d-flex">
            <el-input-number :min="0" size="small" v-model="spec.number">
              {{ spec.number ? spec.number : 0 }}
              <!-- v-model="propertyUpload.specifications.number" -->
            </el-input-number>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="specVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addSpecs" :loading="loading"
          >Add Specification(s)</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="Add Other Specification(s)"
      :visible.sync="otherSpecVisible"
      width="45%"
    >
      <!-- <div v-for="spec in propertySpecs" :key="spec.id"> -->
      <div class="property_main_content">
        <div class="d-flex_column">
          <el-input
            v-model="newOtherSpec.name"
            placeholder="E.g storage room"
          />
        </div>
        <div class="d-flex">
          <el-input-number :min="0" size="small" v-model="newOtherSpec.number">
            {{ newOtherSpec.number ? newOtherSpec.number : 0 }}
            <!-- v-model="propertyUpload.specifications.number" -->
          </el-input-number>
        </div>
      </div>
      <!-- </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="otherSpecVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addOtherSpecs" :loading="loading"
          >Add Other Specification(s)</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="Add Property Amenitie(s)"
      :visible.sync="amenityVisible"
      width="45%"
    >
      <div class="grid_container">
        <div v-for="(property, index) in amenities" :key="index">
          <div
            class="grid_content"
            @click="getAmenities(property)"
            :style="
              checkAmenity(property)
                ? { background: '#E2E8F0' }
                : { background: '#fff' }
            "
          >
            <div class="">
              <!-- <img :src="getSvg(property.img)" class="pt-10" /> -->
              <p><i :class="'el-icon-' + property.icon"></i></p>
              <p class="mt-30">{{ property.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="amenityVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addAmenities" :loading="loading"
          >Add Amenitie(s)</el-button
        >
      </span>
    </el-dialog>
    <div class="d-flex justify_between pt-20">
      <div class="d-flex pt-20">
        <section class="listing_bar">
          <p>Listing Name</p>
          <el-input
            v-if="listing.listing_detail"
            v-model="listing.listing_detail.name"
          />
        </section>
        <section class="listing_bar pl-20">
          <p>Amount</p>
          <el-input
            v-if="listing.listing_detail"
            v-model="listing.listing_detail.price"
          >
            <template slot="prepend">GH&#8373; </template></el-input
          >
        </section>
      </div>
    </div>
    <el-divider></el-divider>
    <div v-if="listing.listing_detail" class="">
      <p>Select an image as front image</p>
      <div class="property_images pt-10 pb-10">
        <div
          v-for="img in listing.listing_detail.listing_images"
          :key="img.id"
          class="pb-5"
        >
          <img
            :src="apiUrl + '/' + img.photo"
            @click="getImage(img.id)"
            class="img_border"
            :style="img.id == imageId && 'border: 1px solid green'"
          />
          <div class="d-flex justify_end pr-20 pt-5">
            <!-- <i class="el-icon-edit-outline"></i> -->
            <i
              class="el-icon-delete-solid deleteImgIcon"
              @click="open(img.id)"
            ></i>
          </div>
        </div>
      </div>
      <div class="d-flex justify_end">
        <el-button type="success" @click="dialogVisible = true" class="p-10"
          >Add Image(s)</el-button
        >
      </div>
      <!-- <el-upload class="upload-demo" :on-change="newImage" multiple>
        <el-button size="small" type="primary">Click to upload</el-button>
        <div slot="tip" class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </el-upload> -->
    </div>
    <div>
      <div class="d-flex listing_location pt-30">
        <section class="pr-20">
          <p>Location</p>
          <el-input
            v-if="listing.listing_detail"
            v-model="listing.listing_detail.city"
          />
        </section>
        <section class="pl-20 date">
          <p>Upload Date</p>
          <div class="d-flex">
            <p class="pt-10 w-100 pr-10">
              <b>
                {{
                  listing && $moment(listing.created_at).format("MMM DD, YY")
                }}
              </b>
            </p>
            <!-- <el-input type="date" v-if="listing" v-model="listing.created_at" /> -->
          </div>
        </section>
      </div>
      <div class="pt-10 pb-10" v-if="listing.listing_detail">
        <Map
          :lat="listing.listing_detail.latitude"
          :lng="listing.listing_detail.longitude"
        />
      </div>
    </div>
    <section class="pt-30 listing_description">
      <p>Description</p>
      <el-input
        type="textarea"
        :rows="2"
        v-if="listing.listing_detail"
        v-model="listing.listing_detail.description"
      />
    </section>

    <div class="pt-30">
      <h3>Basic information</h3>
      <p class="pt-20">Specifications</p>
      <ul class="specs_container">
        <li
          v-for="(specification, index) in listing.property_specifications"
          :key="specification.id"
          class="py-10 d-flex"
        >
          <el-input v-model="specification.number" class="px-10">
            <template slot="prepend"
              >{{
                specification.name
                  ? specification.name
                  : specification.specification.name
              }}
            </template></el-input
          >
          <i
            class="el-icon-close deleteImgIcon pt-10"
            @click="removeSpec(index, specification.id)"
          ></i>
        </li>
      </ul>
      <el-button
        v-if="propertySpecs > 0"
        type="success"
        @click="specVisible = true"
        class="p-10"
        >Add Specification(s)</el-button
      >
    </div>
    <div class="pt-30">
      <p>Other Specifications</p>
      <ul class="specs_container">
        <li
          v-for="(specification, index) in listing.other_specifications"
          :key="specification.id"
          class="py-10 d-flex"
        >
          <el-input v-model="specification.number" class="px-10">
            <template slot="prepend"
              >{{
                specification.name
                  ? specification.name
                  : specification.specification.name
              }}
            </template></el-input
          >
          <i
            class="el-icon-close deleteImgIcon pt-10"
            @click="removeOtherSpec(index, specification.id)"
          ></i>
        </li>
      </ul>
      <el-button type="success" @click="otherSpecVisible = true" class="p-10"
        >Add Other Specification(s)</el-button
      >
    </div>
    <div class="pt-30">
      <p>Amenities</p>
      <ul class="amenites_list pb-10">
        <li
          v-for="(amenity, index) in listing.amenities"
          :key="amenity.id"
          class="d-flex"
        >
          <!-- 0599610266 -->
          <!-- <img src="../assets/img/ac_unit.png" class="pr-5" /> -->
          <p class="pr-10" id="amenity_inner">
            {{ amenity.name ? amenity.name : amenity.amenity.name }}
          </p>
          <i
            class="el-icon-close deleteImgIcon pl-5 pt-10"
            @click="removeAmenity(index, amenity.id)"
          ></i>
        </li>
      </ul>
      <el-button
        v-if="amenities.length > 0"
        type="success"
        @click="amenityVisible = true"
        class="p-10"
        >Add Amenitie(s)</el-button
      >
    </div>
    <div class="d-flex justify_end pt-10">
      <el-button type="primary" @click="updateListing" :loading="loading">
        <i class="el-icon-check pr-10"></i>Save Changes</el-button
      >
      <el-button type="danger" plain @click="deleteListingModal"
        ><i class="el-icon-delete-solid pr-10"></i>Delete</el-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { IMixinState } from "@/types/mixinsTypes";
import map from "../../components/profile/map.vue";
// var map: any;
export default Vue.extend({
  name: "ListingDetails",
  components: {
    map,
  },
  // props: {
  //   property: {
  //     type: Object,
  //     required: true,
  //   },
  // },
  data() {
    return {
      url: "http://localhost:8000/",
      imageErr: "" as string,
      activeName: "first" as string,
      image: "" as any,
      searched: "" as string,
      listing_id: this.$route.params.id,
      newOtherSpec: {
        name: "",
        number: 0,
        id: "",
      } as any,
      listing: {} as any,
      loading: false as boolean,
      checked: false,
      imageId: "",
      dialogVisible: false,
      specVisible: false,
      amenityVisible: false,
      otherSpecVisible: false,
      photos: [] as Array<object>,
      propertySpecs: [] as any,
      amenities: [] as any,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const listing = await this.$listingApi.show(this.$route.params.id);
      console.log("listing", listing);
      this.listing = listing.data;

      const property = await this.$propertyTypesApi.show(
        listing.data.property_type.id
      );

      const propertySpecs = property.data.specifications;
      const propertyAmenities = property.data.amenities;
      // console.log(propertyAmenities);

      for (let i = 0; i < propertySpecs.length; i++) {
        if (
          this.listing.property_specifications[i] == undefined ||
          this.listing.property_specifications[i].id != propertySpecs[i].id
        ) {
          propertySpecs.splice(i, 1);
        }
      }
      this.propertySpecs = propertySpecs;
      let newAmenities = Object.assign([], this.listing.amenities);
      let unSelectedAmenities = propertyAmenities.filter((newAme: any) => {
        let getRest = !newAmenities.some(
          (propAme: any) => propAme.amenity.id == newAme.id
        );
        return getRest;
      });

      this.amenities = unSelectedAmenities;
    },
    getImage(imageId: string) {
      this.imageId = imageId;
      this.checked = true;
      this.$confirm(
        "Are you sure you want to set this image as property cover?",
        {
          cancelButtonText: "No",
          confirmButtonText: "Yes",
        }
      )
        .then(() => {
          this.setFeatureImage(imageId);
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
    newImage(file: any) {
      console.log(file);

      if (file.size >= 5000000) {
        this.imageErr = "Image must not exceed 5 Mb.";
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onloadend = () => {
          this.photos.push({
            tag: "front",
            is_featured: false,
            photo: reader.result,
          });
        };
      }
    },
    closeImgUpload() {
      this.dialogVisible = false;
      this.photos = [];
    },
    removeSpec(index: number, id: string) {
      console.log("specification id", index);
      // const h = this.$createElement
      this.$confirm("Are you sure you want to delete?", {
        cancelButtonText: "No, i want to keep",
        confirmButtonText: "Yes,I want to Delete",
      })
        .then(() => {
          // this.listing.property_specifications.splice(index, 1);
          this.deleteSepcification(id);
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
    removeAmenity(index: number, id: string) {
      this.$confirm("Are you sure you want to delete?", {
        cancelButtonText: "No, i want to keep",
        confirmButtonText: "Yes,I want to Delete",
      })
        .then(() => {
          this.listing.amenities.splice(index, 1);
          this.deleteAmenity(id);
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
    removeOtherSpec(index: number, id: string) {
      // const h = this.$createElement
      this.$confirm("Are you sure you want to delete?", {
        cancelButtonText: "No, i want to keep",
        confirmButtonText: "Yes,I want to Delete",
      })
        .then(() => {
          this.listing.other_specifications.splice(index, 1);
          this.deleteOtherSepcification(id);
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
    open(planId: string) {
      console.log(planId, "profile");
      // const h = this.$createElement
      this.$confirm("Are you sure you want to delete?", {
        cancelButtonText: "No, i want to keep",
        confirmButtonText: "Yes,I want to Delete",
      })
        .then(() => {
          this.deleteImage(planId);
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
    getAmenities(property: any): void {
      // if (this.amenities) {
      let propertyAmenities = Object.assign([], this.listing.amenities);
      let findIndex = propertyAmenities.findIndex(
        (amenity: any) => amenity.id == property.id
      );

      // console.log(findIndex)
      // let amenityIndex = this.listing.amenities.indexOf(property);

      this.listing.amenities.includes(property)
        ? this.listing.amenities.splice(findIndex, 1)
        : this.listing.amenities.push(property);
      // }

      console.log(this.listing.amenities);
    },
    deleteListingModal() {
      // const h = this.$createElement
      this.$confirm("Are you sure you want to delete listing?", {
        cancelButtonText: "No, i want to keep",
        confirmButtonText: "Yes,I want to delete it",
      })
        .then(() => {
          this.deleteListing();
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
    checkAmenity(property: any) {
      let propertyAmenities = Object.assign([], this.listing.amenities);
      let find = false;
      for (let i = 0; i < propertyAmenities.length; i++) {
        if (
          propertyAmenities[i].amenity &&
          propertyAmenities[i].amenity.id == property.id
        ) {
          console.log(propertyAmenities[i].name);
          find = true;
        } else if (propertyAmenities[i].id == property.id) {
          console.log(propertyAmenities[i].name);
          find = true;
        }
      }

      return find;
    },
    addSpecs() {
      console.log(this.propertySpecs);
      for (let i = 0; i < this.propertySpecs.length; i++) {
        if (this.propertySpecs[i].number > 0) {
          this.listing.property_specifications.push(this.propertySpecs[i]);
        }
      }
      this.specVisible = false;
    },
    addAmenities() {
      console.log(this.listing.amenities);
      this.amenityVisible = false;

      // for (let i = 0; i < this.propertySpecs.length; i++) {
      //   if (this.propertySpecs[i].number > 0) {
      //     this.listing.property_specifications.push(this.propertySpecs[i]);
      //   }
      // }
    },
    addOtherSpecs() {
      this.listing.other_specifications.push({
        name: this.newOtherSpec.name,
        number: this.newOtherSpec.number,
        id: "",
      });
      this.otherSpecVisible = false;
      this.newOtherSpec.name = "";
      this.newOtherSpec.number = 0;
      this.listing.other_specifications;
    },
    async deleteImage(planId: string) {
      try {
        const ImageResponse = await this.$listingImagesApi.delete(planId);
        this.fetchData();
        (this as any as IMixinState).$message({
          showClose: true,
          message:"Image Deleted Successffully!",
          type: "success",
        });
      } catch (error) {
        console.log(error, "error");
        (this as any as IMixinState).catchError(error);
      }
    },
    async deleteSepcification(id: string) {
      try {
        const SpecificationResponse =
          await this.$listingSpecificationApi.delete(id);
        this.fetchData();
        (this as any as IMixinState).$message({
          showClose: true,
          message: "Specification Deleted Successffully!",
          type: "success",
        });
      } catch (error) {
        console.log(error, "error");
        (this as any as IMixinState).catchError(error);
      }
    },
    async deleteOtherSepcification(id: string) {
      try {
        const SpecificationResponse =
          await this.$listingOtherSpecificationApi.delete(id);
        this.fetchData();
        (this as any as IMixinState).$message({
          showClose: true,
          message: "Specification  Deleted Successffully!",
          type: "success",
        });
      } catch (error) {
        console.log(error, "error");
        (this as any as IMixinState).catchError(error);
      }
    },
    async deleteAmenity(id: string) {
      try {
        const amenityResponse = await this.$listingAmenitiesApi.delete(id);
        this.fetchData();
        (this as any as IMixinState).$message({
          showClose: true,
          message: "Amenity Deleted Successffully!",
          type: "success",
        });
      } catch (error) {
        console.log(error, "error");
        (this as any as IMixinState).catchError(error);
      }
    },
    async deleteListing() {
      this.loading = true;
      try {
        const ListingResponse = await this.$listingApi.delete(this.listing_id);
        console.log(ListingResponse);
        this.loading = false;
        this.fetchData();
        (this as any as IMixinState).$message({
          showClose: true,
          message: ListingResponse.message,
          type: "success",
        });
        this.$router.replace("/profile");
      } catch (error) {
        console.log(error, "error");
        (this as any as IMixinState).catchError(error);
      }
    },
    async updateListing() {
      this.loading = true;
      const specifications = this.listing.property_specifications.map(
        (specification: any) => {
          return {
            id: specification.specification ? specification.id : "",
            property_type_specification_id: specification.specification
              ? specification.specification.id
              : specification.id,
            number: specification.number,
          };
        }
      );

      const other_specifications = this.listing.other_specifications.map(
        (OtherSpecification: any) => {
          return {
            id: OtherSpecification ? OtherSpecification.id : "",
            name: OtherSpecification.name,
            number: OtherSpecification.number,
          };
        }
      );

      const amenities = this.listing.amenities.map((amenity: any) => {
        return {
          id: amenity.amenity ? amenity.id : "",
          property_type_amenity_id: amenity.amenity
            ? amenity.amenity.id
            : amenity.id,
          icon: amenity.icon,
        };
      });
      console.log(amenities);

      try {
        const listingResponse = await this.$listingApi.update(this.listing_id, {
          property_type_id: this.listing.property_type.id,
          specifications: specifications,
          amenities: amenities,
          other_specifications: other_specifications,
          name: this.listing.listing_detail.name,
          location: this.listing.listing_detail.location,
          region: this.listing.listing_detail.region,
          country_id: this.listing.listing_detail.country.id,
          city: this.listing.listing_detail.city,
          latitude: this.listing.listing_detail.latitude,
          longitude: this.listing.listing_detail.longitude,
          listing_category_id: this.listing.listing_detail.category.id,
          description: this.listing.listing_detail.description,
          price: this.listing.listing_detail.price,
        });

        console.log(listingResponse);

        this.loading = false;
        this.fetchData();
        (this as any as IMixinState).$message({
          showClose: true,
          message: listingResponse.message,
          type: "success",
        });
        // this.$router.replace("/profile");
      } catch (error) {
        console.log(error, "error");
        (this as any as IMixinState).catchError(error);
        this.loading = false;
      }
    },
    async setFeatureImage(imageId: string) {
      try {
        const ImageResponse = await this.$listingImagesApi.update("feature", {
          listing_image_id: imageId,
        });
        this.loading = false;
        this.fetchData();
        (this as any as IMixinState).$message({
          showClose: true,
          message: ImageResponse.message,
          type: "success",
        });
      } catch (error) {
        console.log(error, "error");
        (this as any as IMixinState).catchError(error);
      }
    },
    async addImages() {
      try {
        const listingResponse = await this.$listingImagesApi.create({
          listing_id: this.listing_id,
          listing_photos: this.photos,
        });
        console.log(listingResponse);
        this.dialogVisible = false;
        this.loading = false;
        this.photos = [];
        this.fetchData();
        (this as any as IMixinState).$message({
          showClose: true,
          message: listingResponse.message,
          type: "success",
        });
      } catch (error: any) {
        console.log(error, "error");
        (this as any as IMixinState).$message({
          showClose: true,
          message: error.message,
          type: "success",
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
$small_screen: 426px;
$medium_screen: 769px;
.listing_bar {
  max-width: 200px;
  padding-right: 10px;
}
.property_images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 250px));
  .img_border {
    border-radius: 10px;
  }

  img {
    // border-radius: 20px;
    height: 150px;
    max-width: 300px;
    width: 90%;
  }
}
.specs_container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 200px));
  li {
    list-style-type: none;
  }
}
.amenites_list {
  padding-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 200px));
  width: 100%;

  // max-width: 500px;
  #amenity_inner {
    background: #f1f5f9;
    color: #1e293b;
    border-radius: 80px;
    padding: 10px 20px;
  }
  li {
    list-style: none;
    width: fit-content;

    font-size: 12px;
  }
}
.user_placeholder {
  background: #d9d9d9;
  border-radius: 50%;
}

.deleteImgIcon {
  color: red;
  font-size: 20px;
}
.listing_img {
  border: 1px solid green;
  border-radius: 20px;
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.listing_description {
  width: 70%;
  @media (max-width: 425px) {
    width: 100%;
  }
}

@media (max-width: 425px) {
  .listing_location {
    flex-direction: column;
    .date {
      padding-left: 0 !important;
      padding-top: 10px;
    }
  }
}
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
.uploadImgs {
  display: grid;
  align-items: baseline;
  // width: fit-content;
  grid-template-columns: repeat(auto-fit, minmax(100px, 120px));
}
</style>
