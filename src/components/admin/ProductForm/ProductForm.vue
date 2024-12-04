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
              <div class="d-flex justify-content-between">
                <div></div>
                <div @click="handleClearVariantFilter" class="icon" style="cursor: pointer;">
                  <i class="fa-solid fa-filter-circle-xmark fa-lg"></i>
                </div>
              </div>
              <v-row dense>
                <v-col
                  cols="12"
                  md="6"
                  sm="6"
                >
                  <div class="mb-3">
                    <input
                      type="text"
                      v-model="variantFilter.keyword"
                      class="form-control"
                      placeholder="Search..."
                    />
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  sm="6"
                >
                  <div class="mb-3">
                    <v-select
                      :items="variantStatusOptions"
                      label="Status"
                      density="compact"
                      variant="outlined"
                      item-title="label"
                      item-value="value"
                      hide-details
                      v-model="variantFilter.status"
                      clearable
                    />
                  </div>
                </v-col>
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
              </v-row>

              <div class="row mb-3">
                <div class="col-12 text-end">
                  <div @click="getAllVariants" class="btn btn-success">
                    <i class="fa-solid fa-filter"></i> Apply Filters
                  </div>
                </div>
              </div>
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
                      <td>${{ variant.price }}</td>
                      <td>
                        <div class="d-flex">
                          <div class="cursor-pointer" @click="viewVariant(variant.id)">
                            <i class="fa-regular fa-clipboard fa-lg fa-fw"></i>
                          </div>
                          <div class="cursor-pointer" @click="editVariant(variant.id)">
                            <i class="fa-regular fa-pen-to-square fa-lg fa-fw"></i>
                          </div>
                          <div class="cursor-pointer" @click="deleteVariant(variant.id)">
                            <i class="fa-regular fa-trash-can fa-lg fa-fw"></i>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <p>No variants found</p>
              </div>

            </div>
            <!-- Dialog add and modify variant -->
            <div class="pb-4 pe-4 text-right" >
              <v-dialog
                v-model="dialog"
                max-width="720"
              >
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn
                    variant="flat"
                    v-bind="activatorProps"
                    color="primary"
                    @click="addVariant"
                  >
                    <v-icon left>mdi-plus</v-icon>
                    New variant
                  </v-btn>
                </template>

                <v-card
                  prepend-icon="mdi-package-variant"
                  title="Product variant"
                >
                  <v-card-text>
                    <v-row dense>
                      <v-col
                        cols="12"
                        md="4"
                        sm="6"
                      >
                        <v-select
                          :items="productSizes"
                          label="Size*"
                          density="compact"
                          variant="outlined"
                          item-title="label"
                          item-value="value"
                          v-model="variantDetail.size"
                          :rules="[value => !!value || 'Be required']"
                          :readonly="isViewingVariant"
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        md="4"
                        sm="6"
                      >
                        <v-select
                          :items="variantStatusOptions"
                          label="Status*"
                          density="compact"
                          variant="outlined"
                          item-title="label"
                          item-value="value"
                          v-model="variantDetail.status"
                          :rules="[value => !!value || 'Be required']"
                          :readonly="isViewingVariant"
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        md="4"
                        sm="6"
                      >
                        <v-text-field
                          label="Price*"
                          density="compact"
                          variant="outlined"
                          prefix="$"
                          type="number"
                          v-model="variantDetail.price"
                          :rules="[value => !!value && value >= 0 || 'Be required and non-negative']"
                          required
                          :readonly="isViewingVariant"
                        ></v-text-field>
                      </v-col>

                      <v-col
                        cols="12"
                        md="4"
                        sm="6"
                      >
                        <v-text-field
                          label="Cost*"
                          density="compact"
                          variant="outlined"
                          v-model="variantDetail.cost"
                          prefix="$"
                          type="number"
                          :rules="[value => !!value && value >= 0 || 'Be required and non-negative']"
                          required
                          :readonly="isViewingVariant"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col
                        cols="12"
                        md="12"
                        sm="12"
                      >
                      <v-textarea
                        label="Description..."
                        row-height="20"
                        rows="2"
                        density="compact"
                        variant="outlined"
                        auto-grow
                        v-model="variantDetail.description"
                        :readonly="isViewingVariant"
                      ></v-textarea>
                      </v-col>
                    </v-row> 

                    <!-- Ingredients Section -->
                    <v-divider class="my-4"></v-divider>
                    <!-- <h5 class="mb-4">Ingredients</h5> -->

                    <!-- Ingredient List -->
                    <div v-for="(ingredient, index) in variantDetail.ingredients" :key="index" class="mb-4">
                      <h5 class="mb-4">Ingredient {{ index + 1 }}</h5>
                      <v-row dense>
                        <!-- Ingredient Selection -->
                        <v-col cols="12" md="6" sm="6">
                          <v-select
                            :items="ingredients"
                            label="Ingredient*"
                            density="compact"
                            variant="outlined"
                            item-title="name"
                            item-value="id"
                            v-model="ingredient.ingredientId"
                            :rules="[value => !!value || 'Ingredient is required']"
                            required
                            @update:modelValue="value => handleChangeIngredient(index, value)"
                            :readonly="isViewingVariant"
                          ></v-select>
                        </v-col>

                        <!-- Quantity -->
                        <v-col cols="12" md="5" sm="6">
                          <v-text-field
                            label="Quantity*"
                            density="compact"
                            variant="outlined"
                            v-model="ingredient.quantity"
                            type="number"
                            :rules="[value => !!value && value >= 0 || 'Be required and non-negative']"
                            required
                            :readonly="isViewingVariant"
                          ></v-text-field>
                        </v-col>

                        <!-- Measurement Unit -->
                        <v-col cols="12" md="6" sm="6">
                          <v-select
                            :items="unitOptions"
                            label="Unit*"
                            density="compact"
                            variant="outlined"
                            item-title="label"
                            item-value="value"
                            v-model="ingredient.unit"
                            :rules="[value => !!value || 'Unit is required']"
                            required
                            :readonly="isViewingVariant"
                          ></v-select>
                        </v-col>

                        <!-- Preparation Order -->
                        <v-col cols="12" md="5" sm="6">
                          <v-text-field
                            label="Prep Order*"
                            density="compact"
                            variant="outlined"
                            v-model="ingredient.preparationOrder"
                            type="number"
                            :rules="[value => !!value && value >= 0 || 'Be required and non-negative']"
                            required
                            :readonly="isViewingVariant"
                          ></v-text-field>
                        </v-col>

                        <!-- Description -->
                        <v-col cols="12" md="11" sm="12">
                          <v-textarea
                            label="Description..."
                            row-height="20"
                            rows="2"
                            density="compact"
                            variant="outlined"
                            auto-grow
                            v-model="ingredient.description"
                            :readonly="isViewingVariant"
                          ></v-textarea>
                        </v-col>

                        <!-- Remove Ingredient Button -->
                        <v-col cols="12" md="1" sm="12" class="d-flex align-center">
                          <v-btn
                            :disabled="isViewingVariant"
                            icon
                            color="red"
                            @click="removeIngredient(index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                    </div>

                    <!-- Add Ingredient Button -->
                    <v-btn
                      :disabled="isViewingVariant"
                      class="mt-2"
                      color="primary"
                      @click="addIngredient"
                    >
                      <v-icon left>mdi-plus</v-icon>
                      Add Ingredient
                    </v-btn>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      text="Close"
                      variant="plain"
                      @click="dialog = false"
                    ></v-btn>

                    <v-btn
                      :disabled="isViewingVariant"
                      color="primary"
                      text="Save"
                      variant="tonal"
                      @click="saveVariant"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
  import { MeasurementUnit } from '@/enums/measurementUnit.enum.js'
  import { ProductVariantStatus, ProductVariantSortField } from '@/enums/productVariant.enum.js'
  import { FilterHelper } from '@/helpers/admin/filter/filter.helper.js';
  import productService from '@/services/admin/product.service.js'
  import ingredientService from '@/services/admin/ingredient.service.js'
  import loadingDialogHelper from '@/helpers/admin/dialogs/loading.helper';
  import Swal from 'sweetalert2';

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
        variantSortOptions: ProductVariantSortField.toArray(),
        productSizes: ProductSize.toArray(),
        variantFilter: {
          status: null,
          keyword: null,
        },
        variants: [],
        dialog: false,
        variantDetail: {
          size: null,
          status: null,
          price: null,
          cost: null,
          description: '',
          ingredients: [{
            ingredientId: null,
            quantity: null,
            unit: null,
            preparationOrder: null,
            description: '',
          }],
        },
        ingredients: [], 
        unitOptions: MeasurementUnit.toArray(),
        isEditingVariant: false,
        isViewingVariant: false
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
            const processedFilter = FilterHelper.processFilter(this.variantFilter);
            const params = {
              ...processedFilter,
            }
            console.log(params)
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
      async getAllIngredients() {
        try {
          const result = await ingredientService.getAll({
            params: {
              size: 50
            }
          })
          console.log(result)
          this.ingredients = result.data.content
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
      // Add a new ingredient to the list
      addIngredient() {
        this.variantDetail.ingredients.push({
          ingredientId: null,
          quantity: null,
          unit: null,
          preparationOrder: null,
          description: '',
        });
      },
      // Remove an ingredient from the list
      removeIngredient(index) {
        this.variantDetail.ingredients.splice(index, 1);
      },
      // Reset variantDetail to default
      resetVariantDetail() {
        this.variantDetail = {
          size: null,
          status: null,
          price: null,
          cost: null,
          description: '',
          ingredients: [{
            ingredientId: null,
            quantity: null,
            unit: null,
            preparationOrder: null,
            description: '',
          }],
        };
      },
      // View an existing variant
      async viewVariant(id) {
        this.isViewingVariant = true
        const res = await productService.getVariantProductIdAndId(this.localProduct.id, id);
        console.log(res)
        this.isEditingVariant = true; // prevent err create a new variant
        this.variantDetail = { ...res.data };
        this.dialog = true;
      },
      // Edit an existing variant
      async editVariant(id) {
        const res = await productService.getVariantProductIdAndId(this.localProduct.id, id);
        console.log(res)
        this.isEditingVariant = true;
        this.variantDetail = { ...res.data };
        this.dialog = true;
      },
      async deleteVariant(id) {
        try {
          console.log('Deleting variant with id:', id);

          await productService.deleteVariant(this.localProduct.id, id)

          // Refresh the variant list
          await this.getAllVariants();

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Deleted variant successfully!',
            confirmButtonText: 'OK',
          })

        } catch (error) {
          console.error("Error deleting variant:", error);
          Swal.close();

          let errorMessage = 'Failed to delete variant.';
          if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonText: 'OK',
          });
        }
      },
      // Open dialog to add a new variant
      addVariant() {
        this.isEditingVariant = false;
        this.resetVariantDetail();
        this.dialog = true;
      },
      async saveVariant() {
        console.log(this.variantDetail)
        // Prepare the data for the API
        const payload = {
          size: this.variantDetail.size,
          status: this.variantDetail.status,
          price: this.variantDetail.price,
          cost: this.variantDetail.cost,
          description: this.variantDetail.description,
          ingredients: this.variantDetail.ingredients.map(ingredient => ({
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            preparationOrder: ingredient.preparationOrder,
            description: ingredient.description,
          })),
        };

        try {
          // If it's an edit, update the variant
          if (this.isEditingVariant) {
            // Display loading dialog
            // loadingDialogHelper("Updating variant...");

            await productService.updateVariant(this.localProduct.id, this.variantDetail.id, payload);4

            // Close loading dialog
            // Swal.close();
          } else {
            // Display loading dialog
            // loadingDialogHelper("Creating variant...");

            // If it's a new variant, create it
            await productService.createVariant(this.localProduct.id, payload);

            // Close loading dialog
            // Swal.close();
          }

          // Refresh the variant list
          await this.getAllVariants();

          // Close the dialog
          this.dialog = false;

          // Reset variantDetail
          this.resetVariantDetail();

          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Add variant successfully!',
            confirmButtonText: 'OK',
          })
        } catch (error) {
          console.error("Error saving variant:", error);
          // Close loading dialog
          // Swal.close();

          // Handle error, show error message
          let errorMessage = 'Failed to change variant.';
          if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonText: 'OK',
          });
        }
      },
      handleChangeIngredient(index, value) {
        const result = this.ingredients.find(item => item.id === value);
        this.variantDetail.ingredients[index].unit = result.defaultUnit
      },
      handleClearVariantFilter() {
        this.variantFilter = {
          status: '',
          keyword: '',
        },
        this.getAllVariants()
      },
    },
    mounted() {
      tinymce.init({
        selector: "textarea.tiny-editor",
      });
      this.getAllVariants(),
      this.getAllIngredients()
    },
    watch: {
      dialog() {
        if (this.dialog == false) {
          this.isViewingVariant = false
        }
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
