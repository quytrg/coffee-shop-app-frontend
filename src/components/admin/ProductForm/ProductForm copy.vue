<template>
  <div class="product-form fluid-container mx-5">
    <h4 class="page-title mt-4 mb-0 d-flex align-items-center">
      <h4 class="gray-text">Management</h4>
      <h5 class="mx-1">/</h5> 
      <h4 class="primary-text">{{ pageTitle }}</h4>
    </h4>
    <Form @submit="handleSubmit" :validation-schema="productSchema">
      <div class="row">
        <div class="mb-3 d-flex justify-content-end">
          <button
            type="submit"
            class="btn btn-main"
          >
            Publish product
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-7">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Product Information</h5>
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  class="form-control"
                  placeholder="Enter product name"
                  v-model="localProduct.name"
                />
                <ErrorMessage name="name" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  name="description" 
                  id="description"  
                  class="form-control tiny-editor"
                  v-model="localProduct.description"
                >
                </textarea>
              </div>
            </div>
          </div>

          <div class="card mb-3 px-2" v-if="pageTitle.includes('Modify')">
            <div class="card-body">
              <h5 class="card-title">Product Variants</h5>
              <!-- Search Box and Filter -->
              <div class="mb-3">
                <input
                  type="text"
                  v-model="variantFilter.keyword"
                  class="form-control"
                  placeholder="Search variants"
                />
              </div>

              <div class="mb-3">
                <v-select
                  :items="variantStatusOptions"
                  label="Status"
                  density="compact"
                  variant="outlined"
                  item-title="label"
                  item-value="value"
                  v-model="variantFilter.status"
                  clearable
                />
              </div>

              <!-- <div class="mb-3">
                <v-select
                  :items="variantSortOptions"
                  label="Sort by"
                  density="compact"
                  variant="outlined"
                  item-title="label"
                  item-value="value"
                  v-model="selectedSortField"
                  clearable
                />
              </div> -->

              <!-- Display Product Variants -->
              <div v-if="variants.length">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="variant in variants" :key="variant.id">
                      <td>
                        <v-chip :color="getProductSizeClass(variant.size)">
                          {{ getProductSizeLabel(variant.size) }}
                        </v-chip>
                      </td>
                      <td>
                        <v-chip :color="getVariantStatusClass(variant.status)">
                          {{ getVariantStatusLabel(variant.status) }}
                        </v-chip>
                      </td>
                      <td>{{ variant.price }}</td>
                      <td>
                        <button class="btn btn-link" @click="editVariant(variant)">
                          Edit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <p>No variants found</p>
              </div>

              <!-- Add Variant Button -->
              <!-- <div class="d-flex justify-content-end mt-3">
                <button @click="addVariant" class="btn btn-primary">
                  Add Variant
                </button>
              </div> -->
            </div>
          </div>
        </div>

        <div class="col-5">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Organize</h5>
              <div class="mb-3">
                <label for="category" class="form-label">Category</label>
                <v-select
                  id="category"
                  :items="formattedCategories"
                  label="Select Category"
                  density="compact"
                  variant="outlined"
                  item-title="name"
                  item-value="id"
                  clearable
                  hide-details
                  v-model="localProduct.categoryId" 
                  :loading="categoryStore.isLoading"
                  :disabled="categoryStore.isLoading || categoryStore.error"
                />
                <div v-if="categoryStore.error" class="text-danger mt-1">{{ categoryStore.error }}</div>
              </div>
              <div class="mb-3">
                <label for="position" class="form-label">Position</label>
                <Field
                  id="position"
                  name="position"
                  type="number"
                  class="form-control"
                  min="1"
                  placeholder="Auto increase"
                  v-model="localProduct.position"
                />
                <ErrorMessage name="position" class="error-feedback text-warning" />
              </div>
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
                  v-model="localProduct.status" 
                />
                <ErrorMessage name="status" class="error-feedback text-warning" />
              </div>
            </div>
          </div>
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Media</h5>
              <div class="mb-3 col-10">
                <ImageUploadify v-model:images="localProduct.images" fname="file"/>
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
  import MultiSelectCategory from '@/components/admin/MultiSelectCategory/MultiSelectCategory.vue'
  import ImageUploadify from '@/components/admin/ImageUploadify/ImageUploadify.vue'
  import { useCategoryStore } from '@/stores/admin/category.store';
  import { computed, onMounted } from 'vue';
  import { ProductStatus, ProductSize } from '@/enums/product.enum.js'
  import { ProductVariantStatus, ProductVariantSortField } from '@/enums/productVariant.enum.js'
  import { FilterHelper } from '@/helpers/admin/filter/filter.helper.js';
  import productService from '@/services/admin/product.service.js'


  export default {
    name: "ProductForm",
    components: {
      Form,
      Field,
      ErrorMessage,
      MultiSelectCategory,
      ImageUploadify
    },
    emits: ["submit:product"],
    props: {
      product: {
        type: Object,
        default: () => ({})
      },
      pageTitle: {
        type: String,
        default: ''
      }
    },
    data() {
      const productSchema = yup.object().shape({
        name: yup
          .string()
          .required('Product name must have value')
          .min(2, "Product name must be at least 2 characters")
          .max(200, "Product name can have a maximum of 200 characters."),
        position: yup
          .number("The position must be a numerical value") 
          .transform((value, originalValue) => {
            if (originalValue === '') {
              return undefined;
            }
            return value;
          })
          .min(1, "The minimum position is 1")
          .positive("The position must be a positive number")
          .integer("The position must be an integer.")
      })
      return {
        localProduct: { 
          ...this.product,
          categoryId: this.product.category ? this.product.category.id : this.product.categoryId,
        },
        productSchema,
        statusOptions: ProductStatus.toArray(),
        variantStatusOptions: ProductVariantStatus.toArray(),
        variantFilter: {
          status: null,
          keyword: null,
        },
        variants: [],
      }
    },
    setup() {
      const categoryStore = useCategoryStore();

      // Fetch categories khi component được mount
      onMounted(() => {
        if (categoryStore.categories.length === 0) {
          categoryStore.fetchCategories();
        }
      });

      // Định dạng categories cho v-select nếu cần
      const formattedCategories = computed(() => {
        return categoryStore.categories.map(category => ({
          id: category.id,
          name: category.name
        }));
      });

      return {
        categoryStore,
        formattedCategories,
      };
    },
    methods: {
      handleSubmit() {
        // get description from tiny-mce
        this.localProduct.description = tinymce.get("description").getContent();

        // map images to imageIds
        this.localProduct.imageIds = this.localProduct.images.map(image => (image.id))

        this.$emit("submit:product", this.localProduct)
      },
      async getAllVariants() {
        try {
          if (this.pageTitle.includes('Modify')) {
            const processedFilter = FilterHelper.processFilter(this.filter);
            const params = {
              ...processedFilter,
            }
            const result = await productService.getAllVariants(this.localProduct.id, {
              params: params
            })
            console.log(result)
            this.variants = result.data.content
          }
        }
        catch(err) {
          console.log(err)
        }
      },
      getProductSizeClass(size) {
        const config = ProductSize.getConfig(size);
        return `${config.color}`;
      },
      getProductSizeLabel(size) {
        return ProductSize.getLabel(size);
      },
      getVariantStatusClass(status) {
        const config = ProductVariantStatus.getConfig(status);
        return `${config.color}`;
      },
      getVariantStatusLabel(status) {
        return ProductVariantStatus.getLabel(status);
      },
    },
    mounted() {
      tinymce.init({
        selector: "textarea.tiny-editor",
      });
      this.getAllVariants()
    },
  }
</script>

<style scoped lang="scss">
</style>
