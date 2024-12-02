<template>
  <div class="products fluid-container mx-5" v-if="checkPermission('PRODUCT_VIEW')">
    <div class="products-wrapper position-relative" v-if="!isFetching">
      <!-- Tiêu đề -->
      <div class="products-title my-4 d-flex align-items-center">
        <h4 class="gray-text">Management</h4>
        <h5 class="mx-1">/</h5> 
        <h4 class="primary-text">Products</h4>
      </div>

      <!-- Alert -->
      <Transition name="slide-fade">
        <v-alert
          v-if="alert"
          text="You need permission to perform this action"
          border-color="warning"
          color="warning"
          width="480px"
          border="start"
          variant="tonal"
          density="compact"
          icon="$warning"
          closable
          @input="alert = false"
          class="alert position-absolute top-0 end-0 z-99"
        ></v-alert>
      </Transition>

      <!-- Filters -->
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <h5 class="my-0 mt-ms-auto d-flex align-items-center">Filters</h5>
          <div @click="handleClear" class="icon" style="cursor: pointer;">
            <i class="fa-solid fa-filter-circle-xmark fa-lg"></i>
          </div>
        </div>
        <div class="card-body">
          <!-- Các trường lọc cơ bản -->
          <div class="row mb-3">
            <div class="col-lg-4 col-md-12 mb-md-2 mb-lg-0">
              <v-select
                :items="statusOptions"
                label="Status"
                density="compact"
                variant="outlined"
                item-title="label"
                item-value="value"
                clearable
                hide-details
                v-model="filter.status" 
              />
            </div>
            <div class="col-lg-4 col-md-12 mb-md-2 mb-lg-0">
              <Select 
                v-model:selectedValue="filter.categoryIds" 
                :items="categories" 
                label="Category"
              />
            </div>
            <div class="col-lg-4 col-md-12">
              <Search 
                v-model:keyword="filter.keyword"
              />
            </div>
          </div>

          <!-- Các tiêu chí sắp xếp động -->
          <div class="row mb-3">
            <div class="col-12">
              <h5>Sort Criteria</h5>
              <div 
                v-for="(criteria, index) in sortCriteria" 
                :key="index" 
                class="d-flex mb-2 align-items-center sort-criteria-row"
              >
                <v-select
                  :items="sortFieldOptions"
                  label="Sort Field"
                  density="compact"
                  variant="outlined"
                  item-title="label"
                  item-value="value"
                  clearable
                  hide-details
                  v-model="criteria.sortBy"
                  class="flex-fill me-2"
                />
                <v-select
                  :items="sortDirectionOptions"
                  label="Sort Direction"
                  density="compact"
                  variant="outlined"
                  item-title="label"
                  item-value="value"
                  clearable
                  hide-details
                  v-model="criteria.sortDir"
                  class="flex-fill me-2"
                />
                <button 
                  @click="removeSortCriteria(index)" 
                  class="btn btn-danger sort-remove-button"
                  :disabled="sortCriteria.length === 1"
                  title="Remove Sort Criteria"
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
              </div>
              <button @click="addSortCriteria" class="btn btn-primary">
                <i class="fa-solid fa-plus"></i> Add Sort
              </button>
            </div>
          </div>

          <!-- Nút Thực Hiện Lọc -->
          <div class="row mb-3">
            <div class="col-12 text-end">
              <button @click="getProducts" class="btn btn-success">
                <i class="fa-solid fa-filter"></i> Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Products List -->
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <h5 class="my-2 d-flex align-items-center">Products</h5>
        </div>
        <div class="card-body">
          <div class="product-action d-flex justify-content-between mb-3">
            <!-- <ChangeMulti @apply=""/> -->
             <div></div>
            <router-link :to="{ name: 'CreateProduct' }">
              <button class="btn btn-main btn-primary">+ New Product</button>
            </router-link>
          </div>
          <table class="table table-sm mt-3">
            <thead>
              <tr>
                <th>
                  <input
                    class="form-check-input" 
                    type="checkbox"
                    name="checkall"
                    @change="handleCheckAll"
                    v-model="checkall"
                  >
                </th>
                <th>STT</th>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Position</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="products.length">
              <tr v-for="(product, index) in products" :key="product.id">
                <td>
                  <input 
                    class="form-check-input"
                    type="checkbox"
                    name="id"
                    :value="product.id"
                    v-model="checkedItems[index]"
                  >
                </td>
                <td>{{ (page - 1) * 10 + index + 1 }}</td>
                <td>
                  <div class="thumbnail">
                    <img 
                      :src="product.imageUrls[0] ? product.imageUrls[0] : '/default-coffee-image.png'" 
                      :alt="product.name"
                    >
                  </div>
                </td>
                <td>{{ product.name }}</td>
                <td>{{ product.categoryName }}</td>
                <td>
                  <input 
                    type="number"
                    name="position"
                    v-model="product.position"
                    :style="{ 
                      width: '60px', 
                      padding: '3px', 
                    }"
                  >
                </td>
                <td>
                  <v-chip :color="getStatusClass(product.status)">
                    {{ getStatusLabel(product.status) }}
                  </v-chip>
                </td>
                <td>
                  <div class="d-flex icon">
                    <div
                      class="cursor-pointer me-2"
                      @click="viewProductDetail(product.id)"
                    >
                      <i class="fa-regular fa-clipboard fa-lg fa-fw"></i>
                    </div>
                    <router-link 
                      :to="{ name: 'ModifyProduct', params: { id: `${product.id}`} }"
                      class="d-flex align-items-center me-2"
                      title="Modify Product"
                    >
                      <i class="fa-regular fa-pen-to-square fa-lg fa-fw"></i>
                    </router-link>
                    <div
                      @click="handleDelete(product.id)"
                      class="cursor-pointer"
                      title="Delete Product"
                    >
                      <i class="fa-regular fa-trash-can fa-lg fa-fw"></i>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="8">
                  <div class="text-center">
                    No result.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination -->
          <div class="text-center">
            <v-container>
              <v-row justify="center">
                <v-col cols="8">
                  <v-container class="max-width p-0">
                    <v-pagination
                      v-model="page"
                      :length="totalPages"
                      :total-visible="6"
                      @input="handlePageChange"
                    ></v-pagination>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </div>
          <!-- Product detail dialog -->
          <div class="me-2">
            <v-dialog
              v-model="dialog"
              max-width="720"
              opacity="0.32"
              transition="dialog-top-transition"
            >
              <v-card
                prepend-icon="mdi-package-variant"
                title="Product Information"
              >
                <v-card-text>
                  <v-row dense>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        label="Name"
                        density="compact"
                        variant="outlined"
                        v-model="productDetail.name"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        label="Category"
                        density="compact"
                        variant="outlined"
                        v-model="productDetail.category.name"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        label="Position"
                        density="compact"
                        variant="outlined"
                        type="number"
                        v-model="productDetail.position"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-select
                        :items="statusOptions"
                        label="Status"
                        density="compact"
                        variant="outlined"
                        item-title="label"
                        item-value="value"
                        v-model="productDetail.status" 
                        :readonly="true"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <label for="description" class="form-label">Description</label>
                      <h6 v-html="productDetail.description"></h6>
                    </v-col>
                  </v-row>
                  <!-- Variant Section -->
                  <v-divider class="my-4"></v-divider>
                  <h5 class="mb-4">Variants</h5>
                  <div v-if="variants.length">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Size</th>
                          <th>Status</th>
                          <th>Price</th>
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
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-else>
                    <p>No variants found</p>
                  </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    text="Close"
                    variant="plain"
                    @click="dialog = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>
    </div>
    <div class="products-wrapper" v-else>
      <!-- Skeleton Loaders khi đang fetch dữ liệu -->
      <v-row>
        <v-col cols="6">
          <v-skeleton-loader
            color="grey-lighten-5"
            class="my-2"
            max-width="400"
            type="heading"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <v-row>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="my-0"
                max-width="120"
                type="subtitle"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="ms-auto my-0"
                max-width="120"
                type="subtitle"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
        <div class="card-body">
          <v-row>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="my-0"
                max-width="300"
                type="heading"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="ms-auto my-0"
                max-width="400"
                type="heading"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <v-row>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="my-0"
                max-width="120"
                type="subtitle"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="ms-auto my-0"
                max-width="120"
                type="subtitle"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
        <div class="card-body">
          <v-row>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="my-0"
                max-width="300"
                type="heading"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="6" class="py-1">
              <v-skeleton-loader
                class="ms-auto my-0"
                max-width="400"
                type="heading"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
          <table class="table table-sm mt-3">
            <thead>
              <tr>
                <th colspan="12">
                  <v-skeleton-loader
                    class="my-0"
                    type="table-row"
                  ></v-skeleton-loader>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="12">
                  <v-skeleton-loader
                    class="my-0"
                    type="table-row-divider@6"
                  ></v-skeleton-loader>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-center">
            <v-container>
              <v-row justify="center">
                <v-col cols="8" class="p-0">
                  <v-container class="max-width p-0">
                    <v-skeleton-loader
                      class="mx-auto"
                      max-width="300"
                      type="heading"
                    ></v-skeleton-loader>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="product fluid-container mx-5" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import FilterStatus from '@/components/admin/FilterStatus/FilterStatus.vue'
import Search from '@/components/admin/Search/Search.vue'
import ProductService from '@/services/admin/product.service.js'
import SelectCategory from '@/components/admin/SelectCategory/SelectCategory.vue'
import ChangeMulti from '@/components/admin/ChangeMulti/ChangeMulti.vue'
import confirmDialogHelper from '@/helpers/admin/dialogs/confirm.helper.js'
import successDialogHelper from '@/helpers/admin/dialogs/success.helper.js'
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue'
import Select from '@/components/admin/Select/Select.vue'
import CategoryService from '@/services/admin/category.service'
import { ProductStatus, ProductSortField, ProductSize } from '@/enums/product.enum.js'
import { SortDirection } from '@/enums/sortDir.enum.js'
import { FilterHelper } from '@/helpers/admin/filter/filter.helper.js';
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper'
import { CategoryStatus } from '@/enums/category.enum.js'
import { ProductVariantStatus } from '@/enums/productVariant.enum.js'

export default {
  name: "Product",
  components: {
    FilterStatus,
    Search,
    SelectCategory,
    ChangeMulti,
    Unauthorized,
    Select,
  },
  data() {
    return {
      products: [],
      categories: [],
      filter: {
        status: '',
        keyword: '',
        categoryIds: [],
      },
      sortCriteria: [ { sortBy: '', sortDir: '' } ], // Sử dụng sortCriteria
      checkall: false,
      checkedItems: [],
      page: 1,
      totalPages: 0,
      isFetching: true,
      alert: false,
      statusOptions: ProductStatus.toArray(),
      sortFieldOptions: ProductSortField.toArray(),
      sortDirectionOptions: SortDirection.toArray(),
      dialog: false,
      productDetail: {
        name: null,
        category: null,
        position: null,
        status: null,
        description: '',
      },
      variants: []
    }
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName)
    },
    async getProducts() {
      const processedFilter = FilterHelper.processFilter(this.filter);
      // Chuyển đổi sortCriteria thành sortBy và sortDir arrays
      const sortBy = this.sortCriteria.map(criteria => criteria.sortBy).filter(Boolean);
      const sortDir = this.sortCriteria.map(criteria => criteria.sortDir).filter(Boolean);
      try {
        const params = {
          ...processedFilter,
          page: this.page - 1
        }

        if (sortBy.length !== 0) {
          params.sortBy = sortBy.join(',')
        }

        if (sortBy.sortDir !== 0) {
          params.sortDir = sortDir.join(',')
        }
        console.log(params)
        const response = await ProductService.get({
          params: params
        })
        console.log(response)
        this.products = response.data.content
        this.totalPages = response.data.page.totalPages
        this.isFetching = false

        // update url
        this.updateURL(processedFilter)
      } catch (error) {
        console.error(error)
        this.isFetching = false
      }
    },
    updateURL(processedFilter) {
      const query = {
        ...processedFilter,
        page: this.page,
      };

      if (this.sortCriteria[0].sortBy !== '') {
        query.sortBy = this.sortCriteria.map(c => c.sortBy).join(',')
      }

      if (this.sortCriteria[0].sortDir !== '') {
        query.sortDir = this.sortCriteria.map(c => c.sortDir).join(',')
      }

      this.$router.push({ query });
    },
    handleClear() {
      this.filter = {
        status: '',
        keyword: '',
        categoryIds: [],
      },
      this.sortCriteria = [ { sortBy: '', sortDir: '' } ] // Reset sortCriteria
      this.getProducts()
    },
    handleCheckAll() {  
      this.checkedItems = this.products.map(() => this.checkall)
    },
    async handleDelete(id) {
      try {
        if (this.checkPermission('PRODUCT_DELETE')) {
          confirmDialogHelper().then(async (result) => {
            if (result.isConfirmed) {
              await ProductService.deleteOne(id)
              this.getProducts()
              successDialogHelper()
            }
          });
        }
        else {
          this.alert = true
          setTimeout(() => {
            this.alert = false
          }, 1200)
        }
      }
      catch (err) {
        console.log(err)
      }
    },
    async getAllCategories() {
      try {
        const filter = {
          params: {
            size: 50,
            status: CategoryStatus.ACTIVE
          }
        }
        const result = await CategoryService.getAll(filter)
        console.log(result)
        this.categories = result.data.content
      }
      catch(err) {
        console.log(err)
      }
    },
    async getAllVariants(productId) {
      try {
        const filter = {
          params: {
            size: 50,
          }
        }
        const result = await ProductService.getAllVariants(productId, filter)
        console.log(result)
        this.variants = result.data.content
      }
      catch(err) {
        console.log(err)
      }
    },
    getStatusClass(status) {
      const config = ProductStatus.getConfig(status);
      return `${config.color}`;
    },
    getStatusLabel(status) {
      return ProductStatus.getLabel(status);
    },
    // Khôi phục filter từ URL khi load page
    initFilterFromUrl() {
      const searchParams = new URLSearchParams(window.location.search);
      this.filter = FilterHelper.parseFilterFromUrl(searchParams);
      
      // Khôi phục sortCriteria từ URL
      const sortByParam = searchParams.get('sortBy');
      const sortDirParam = searchParams.get('sortDir');
      if (sortByParam && sortDirParam) {
        const sortByArray = sortByParam.split(',');
        const sortDirArray = sortDirParam.split(',');
        this.sortCriteria = sortByArray.map((field, index) => ({
          sortBy: field,
          sortDir: sortDirArray[index] || '',
        }));
      }
      else {
        this.sortCriteria = [ { sortBy: '', sortDir: '' } ];
      }
    },
    // Thêm tiêu chí sắp xếp
    addSortCriteria() {
      this.sortCriteria.push({ sortBy: '', sortDir: '' });
    },
    // Xóa tiêu chí sắp xếp
    removeSortCriteria(index) {
      if (this.sortCriteria.length > 1) {
        this.sortCriteria.splice(index, 1);
      }
    },
    // Xử lý thay đổi trang
    handlePageChange(newPage) {
      this.page = newPage;
    },
    resetProductDetail() {
      this.productDetail = {
        name: null,
        category: null,
        position: null,
        status: null,
        description: '',
      }
    },
    async viewProductDetail(id) {
      // reset productDetail variable
      this.resetProductDetail()
      // fetch product deltail by id
      const res = await ProductService.getProductById(id);
      console.log("Product deltail: ", res)
      this.productDetail = { ...res.data };
      // fetch all variants of product
      await this.getAllVariants(id)
      // display dialog
      this.dialog = true;
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
    this.initFilterFromUrl();
    this.getAllCategories()
    this.getProducts()
  },
  watch: {
    filter: {
      handler() {
        this.page = 1
      },
      deep: true
    },
    sortCriteria: {
      handler() {
        this.page = 1
      },
      deep: true
    },
    page() {
      this.getProducts()
    }
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">
.sort-criteria-row {
  gap: 8px;
}

@media (max-width: 960px) {
  .d-flex:not(.products-title, .card-header) {
    flex-direction: column !important;
    align-items: stretch !important;
  }

  .sort-criteria-row {
    flex-direction: column;
  }

  .sort-criteria-row .flex-fill {
    width: 100%;
  }

  .sort-remove-button {
    align-self: flex-end;
  }

  .product-action {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
