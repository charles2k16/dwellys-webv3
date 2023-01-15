<template>
  <div class="new_lister_container section">
    <h3 class="center py-20">Become a Lister</h3>
    <el-form class="new_lister_form">
      <el-form-item label="ID type" class="pb-20">
        <el-select
          v-model="property_account.id_card_type"
          placeholder="Select ID type"
          class="id_type"
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="ID card number" class="pb-20">
        <el-input
          v-model="property_account.id_card_number"
          placeholder="Enter ID number"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="Upload ID" class="">
        <el-upload
          drag
          action=""
          :on-change="propertyCard"
          :multiple="false"
          class="new_lister_upload w-100"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text w-100">
            Upload a front photo of your ID
          </div>
        </el-upload>
      </el-form-item>

      <div v-if="property_account.id_card_upload" class="d-flex justify_center">
        <img
          :src="property_account.id_card_upload"
          width="80%"
          height="200px"
          class="mx-10 mt-10"
        />
      </div>

      <div class="mt-20 d-flex justify_end">
        <div class="register_btn">
          <el-button
            type="primary"
            :loading="btnLoading"
            class="second_next submit_register_button"
            @click="submit_account"
            >Save</el-button
          >
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import { IMixinState } from '@/types/mixinsTypes';

export default Vue.extend({
  name: 'NewLister',
  data() {
    return {
      message: '' as string,
      contact: '' as string,
      btnLoading: false as boolean,
      options: ['SSNIT', 'PASSPORT', 'VOTER'],
      property_account: {
        id_card_type: '' as string,
        id_card_upload: '' as any,
        id_card_number: '' as string,
      },
    };
  },
  methods: {
    propertyCard(file: any) {
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onloadend = () => {
        this.property_account.id_card_upload = reader.result;
      };
    },
    async submit_account(): Promise<void> {
      try {
        const property_account = {
          id_card_type: this.property_account.id_card_type,
          id_card_upload: this.property_account.id_card_upload,
          id_card_number: this.property_account.id_card_number,
        };
        const response = await this.$transformtoLister.create(property_account);
        console.log(response);

        this.$confirm(response.message, {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'success',
        })
          .then(() => {
            this.btnLoading = false;
            this.$router.push('/login');
          })
          .catch(() => {
            this.btnLoading = false;
          });
        this.btnLoading = false;
      } catch (error: any) {
        this.btnLoading = false;
        if (error?.response?.data) {
          (this as any as IMixinState).$message({
            showClose: true,
            message: error.response.data.message,
            type: 'error',
          });
        }
        (this as any as IMixinState).catchError(error);
      }
    },
  },
});
</script>

<style lang="scss">
.new_lister_container {
  margin-top: 40px;
  .new_lister_form {
    width: 60%;
    margin: 0 auto;
    @media (max-width: 426px) {
      width: 85%;
    }
  }
}
</style>
