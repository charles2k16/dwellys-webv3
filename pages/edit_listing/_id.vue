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
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addImages" :loading="loading"
          >Add Image(s)</el-button
        >
      </span>
    </el-dialog>
    <div class="d-flex justify_between">
      <div class="d-flex pt-20">
        <!-- <section class="listing_bar"> -->
        <!-- <p>Lister</p> -->
        <!-- <p class="pt-10"> -->
        <!-- <b>{{ listing && listing.lister.first_name }} </b> -->
        <!-- </p> -->
        <!-- </section> -->
        <section class="listing_bar">
          <p>Listing type</p>
          <!-- <p class="pt-10">
            <b>{{ listing.property_type && listing.property_type.name }} </b>
          </p> -->
          <el-input
            v-if="listing.property_type"
            v-model="listing.property_type.name"
          />
        </section>
        <section class="listing_bar pl-20">
          <p>Amount</p>
          <!-- <p class="pt-10">
            <b>{{ listing.listing_detail && listing.listing_detail.price }} </b>
          </p> -->
          <el-input
            v-if="listing.listing_detail"
            v-model="listing.listing_detail.price"
          />
        </section>
      </div>
    </div>
    <el-divider></el-divider>
    <div>
      <!-- <div>
        <p>Listing title</p>
        <p class="pt-10"><b>3 bed room house in Community 25, Tema</b></p>
        <el-input v-model="listing.listing_detail.title" />
      </div> -->
      <div class="d-flex listing_location pt-30">
        <section class="pr-20">
          <p>Location</p>
          <!-- <p class="pt-10">
            <b
              >{{ listing.listing_detail && listing.listing_detail.region }}
            </b>
          </p> -->
          <el-input
            v-if="listing.listing_detail"
            v-model="listing.listing_detail.region"
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
            <el-input type="date" v-if="listing" v-model="listing.created_at" />
          </div>
        </section>
      </div>
    </div>
    <section class="pt-30 listing_description">
      <p>Description</p>
      <!-- <p>
        <b>
          {{ listing.listing_detail && listing.listing_detail.description }}</b
        >
      </p> -->
      <el-input
        type="textarea"
        :rows="2"
        v-if="listing.listing_detail"
        v-model="listing.listing_detail.description"
      />
    </section>
    <div v-if="listing.listing_detail" class="pt-30">
      <p>Images</p>
      <p>Select an image as front image</p>
      <div class="property_images pt-10 pb-10">
        <div
          v-for="img in listing.listing_detail.listing_images"
          :key="img.id"
          class=""
        >
          <!-- <el-checkbox v-model="checked">Option</el-checkbox> -->
          <img
            :src="url + img.photo"
            @click="getImage(img.id)"
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
      <el-button type="success" @click="dialogVisible = true"
        >Add Image(s)</el-button
      >
      <!-- <el-upload class="upload-demo" :on-change="newImage" multiple>
        <el-button size="small" type="primary">Click to upload</el-button>
        <div slot="tip" class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </el-upload> -->
    </div>
    <div class="pt-30">
      <p>Basic information</p>
      <!-- <ul v-for="amenity in listing.amenities" :key="amenity.id">
        <li>{{ amenity.amenity.name }}</li>
      </ul> -->
    </div>
    <div class="pt-30">
      <p>Amenities</p>
      <ul
        v-for="amenity in listing.amenities"
        :key="amenity.id"
        class="amenites_list"
      >
        <li class="d-flex">
          <!-- <img src="../assets/img/ac_unit.png" class="pr-5" /> -->
          <p>{{ amenity.amenity.name }}</p>
        </li>
      </ul>
    </div>
    <div class="d-flex justify_end pt-10">
      <el-button type="info" @click="approveLister(listing.id, 'inactive')">
        <i class="el-icon-check pr-10"></i>Save Changes</el-button
      >
      <el-button type="primary" :loading="loading" @click="deleteListingModal"
        ><i class="el-icon-close pr-10"></i>Delete</el-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { IMixinState } from "@/types/mixinsTypes";

export default Vue.extend({
  name: "ListingDetails",

  // props: {
  //   property: {
  //     type: Object,
  //     required: true,
  //   },
  // },
  data() {
    return {
      url: "http://localhost:8000/",
      activeName: "first" as string,
      image: "" as any,
      listing_id: this.$route.params.id,
      listing: {},
      loading: false as boolean,
      checked: false,
      imageId: "",
      dialogVisible: false,
      photos: [] as Array<object>,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const listing = await this.$listingApi.show(this.$route.params.id);
      console.log(listing);
      this.listing = listing.data;
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
      const reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onloadend = () => {
        this.photos.push({
          tag: "front",
          is_featured: false,
          photo: reader.result,
        });
      };
    },
    open(planId: string, planName: string) {
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
    deleteListingModal() {
      // const h = this.$createElement
      this.$confirm("Are you sure you want to delete listing?", {
        cancelButtonText: "No, i want to keep",
        confirmButtonText: "Yes,I want to delete it",
      })
        .then(() => {
          this.deleteListingImage();
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
    async deleteImage(planId: string) {
      this.loading = true;
      try {
        const ImageResponse = await this.$listingImagesApi.delete(planId);

        console.log(ImageResponse);

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
    async deleteListingImage() {
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
    async setFeatureImage(imageId: string) {
      try {
        const ImageResponse = await this.$listingImagesApi.update("feature", {
          listing_image_id: imageId,
        });

        console.log(ImageResponse);

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
      console.log(this.photos);
      try {
        const listingResponse = await this.$listingImagesApi.create({
          listing_id: this.listing_id,
          listing_photos: this.photos,
        });
        console.log(listingResponse);
        // console.log(listingId, active)
        this.dialogVisible = false;
        this.loading = false;
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
.listing_bar {
  width: 150px;
  padding-right: 10px;
}
.property_images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));

  img {
    // border-radius: 20px;
    height: 100px;
    max-width: 300px;
    width: 90%;
  }
}
.amenites_list {
  padding-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  width: 80%;

  max-width: 500px;

  li {
    background: #f1f5f9;
    border-radius: 80px;
    list-style: none;
    width: fit-content;
    padding: 10px 20px;
    color: #1e293b;
    font-size: 12px;
  }
}
.user_placeholder {
  background: #d9d9d9;
  border-radius: 50%;
}

.deleteImgIcon {
  color: red;
  font-size: 18px;
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
</style>
