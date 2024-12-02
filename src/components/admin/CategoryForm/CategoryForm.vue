<template>
  <div class="category-form fluid-container mx-5">
    <h4 class="page-title mt-4 mb-0 d-flex align-items-center">
      <h4 class="gray-text">Management</h4>
      <h5 class="mx-1">/</h5> 
      <h4 class="primary-text">{{ pageTitle }}</h4>
    </h4>
    <Form @submit="handleSubmit" :validation-schema="categorySchema">
      <div class="row">
        <div class="mb-3 d-flex justify-content-end">
          <button
            type="submit"
            class="btn btn-main"
          >
            Publish category
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-7">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Category Information</h5>
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  class="form-control"
                  placeholder="Enter category name"
                  v-model="localCategory.name"
                />
                <ErrorMessage name="name" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  name="description" 
                  id="description"  
                  class="form-control tiny-editor"
                  v-model="localCategory.description"
                >
                </textarea>
                <ErrorMessage name="description" class="error-feedback text-warning" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-5">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Organize</h5>
              <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <v-select
                  :items="statusOptions"
                  label="Select Status"
                  density="compact"
                  variant="outlined"
                  item-title="label"
                  item-value="value"
                  clearable
                  hide-details
                  v-model="localCategory.status" 
                />
                <ErrorMessage name="status" class="error-feedback text-warning" />
              </div>
            </div>
          </div>

          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Media</h5>
              <div class="mb-3 col-10">
                <ImageUploadify v-model:images="localCategory.images" fname="file" title="Upload Images"/>
                <ErrorMessage name="imageIds" class="error-feedback text-warning" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import ImageUploadify from '@/components/admin/ImageUploadify/ImageUploadify.vue'
import { CategoryStatus } from '@/enums/category.enum.js'

export default {
  name: "CategoryForm",
  components: {
    Form,
    Field,
    ErrorMessage,
    ImageUploadify
  },
  emits: ["submit:category"],
  props: {
    category: {
      type: Object,
      default: () => ({})
    },
    pageTitle: {
      type: String,
      default: 'Create Category'
    }
  },
  data() {
    const categorySchema = yup.object().shape({
      name: yup
        .string()
        .required('Category name is required')
        .min(2, "Category name must be at least 2 characters")
        .max(200, "Category name can have a maximum of 200 characters."),
      description: yup
        .string()
        .max(1000, "Description can have a maximum of 500 characters."),
    })
    return {
      localCategory: { 
        ...this.category,
      },
      categorySchema,
      statusOptions: CategoryStatus.toArray(),
    }
  },
  methods: {
    handleSubmit() {
      // Lấy nội dung từ TinyMCE
      this.localCategory.description = tinymce.get("description").getContent();

      // map images to imageIds
      this.localCategory.imageIds = this.localCategory.images.map(image => (image.id))

      this.$emit("submit:category", this.localCategory)
    },
  },
  mounted() {
    tinymce.init({
      selector: "textarea.tiny-editor",
    });
  },
}
</script>

<style scoped lang="scss">
</style>
