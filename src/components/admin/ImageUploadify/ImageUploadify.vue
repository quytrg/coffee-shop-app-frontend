<template>
  <div class="imageuploadify-container">
    <label :for="fname" class="form-label">{{ title }}</label>
    <Field
      ref="fileInput"
      :id="fname"
      :name="fname"
      type="file"
      class="form-control"
      accept="image/*"
      @change="handleChangeImage($event)"
    />
    <ErrorMessage :name="fname" class="error-feedback text-warning" />
    
    <!-- Hiển thị trạng thái đang upload -->
    <div v-if="isUploading" class="uploading-indicator mt-2">
      <v-progress-circular
        indeterminate
        color="primary"
        size="24"
      ></v-progress-circular>
      <span class="ml-2">Uploading...</span>
    </div>
    
    <!-- Hiển thị thông báo lỗi nếu có -->
    <v-alert
      v-if="errorMessage"
      type="error"
      dismissible
      @dismissed="errorMessage = null"
      class="mt-3"
      border="start"
      variant="tonal"
      density="compact"
    >
      {{ errorMessage }}
    </v-alert>
    
    <!-- Hiển thị thông báo thành công nếu cần -->
    <v-alert
      v-if="successMessage"
      type="success"
      dismissible
      @dismissed="successMessage = null"
      class="mt-3"
      border="start"
      variant="tonal"
      density="compact"
    >
      {{ successMessage }}
    </v-alert>
    
    <!-- Hiển thị hình ảnh đã upload -->
    <v-img
      v-if="images[0]?.url && !isUploading"
      :src="images[0]?.url"
      aspect-ratio="4/3"
      max-width="320"
      max-height="240"
      class="bg-grey-lighten-2 mt-3"
      cover
      rounded
    >
      <template v-slot:placeholder>
        <v-row align="center" class="fill-height ma-0" justify="center">
          <v-progress-circular
            color="grey-lighten-5"
            indeterminate
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </div>
</template>

<script>
import { Field, ErrorMessage } from "vee-validate";
import ImageService from '@/services/admin/image.service';
import objectToFormData from '@/helpers/admin/convert/objectToFormData.helper'; 

export default {
  name: "ImageUploadify",
  components: {
    Field,
    ErrorMessage
  },
  props: {
    fname: {
      type: String,
      default: ''
    },
    images: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: 'Image'
    }
  },
  emits: ['update:images'],
  data() {
    return {
      isUploading: false, 
      errorMessage: null,  
      successMessage: null, 
    }
  },
  methods: {
    async handleChangeImage(event) {
      try {
        const file = event.target.files[0];
        if (!file) return;

        // Kiểm tra định dạng
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          this.errorMessage = "Only JPEG, PNG, and GIF files are allowed.";
          this.resetFileInput();
          return;
        }

        // Kiểm tra kích thước không vượt quá 5MB
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          this.errorMessage = "File size should not exceed 5MB.";
          this.resetFileInput();
          return;
        }

        // Tạo FormData
        const formData = objectToFormData({ file: file });

        // Bắt đầu upload
        this.isUploading = true;
        this.errorMessage = null;
        this.successMessage = null;

        const response = await ImageService.upload(formData);
        const image = {
          id: response.data.imageId,
          url: response.data.url
        }
        this.$emit('update:images', [image]);

        // Hiển thị thông báo thành công
        this.successMessage = "Image uploaded successfully!";
      } catch (err) {
        console.error("Error uploading image:", err);
        this.errorMessage = "Failed to upload image. Please try again.";
        // Phát ra sự kiện null
        this.$emit('update:cloudURL', null);
      } finally {
        this.isUploading = false;
        this.resetFileInput(); // Reset input file sau khi upload
      }
    },
    resetFileInput() {
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    }
  },
};
</script>

<style scoped lang="scss">
  .uploading-indicator {
    display: flex;
    align-items: center;
  }
  .ml-2 {
    margin-left: 0.5rem;
  }
</style>
