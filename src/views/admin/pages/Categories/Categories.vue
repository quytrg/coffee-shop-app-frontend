<template>
  <div class="categories fluid-container mx-5" v-if="checkPermission('CATEGORY_VIEW')">
    <div class="categories-wrapper position-relative" v-if="!isFetching">
      <!-- Tiêu đề -->
      <div class="categories-title my-4 d-flex align-items-center">
        <h4 class="gray-text">Management</h4>
        <h5 class="mx-1">/</h5> 
        <h4 class="primary-text">Categories</h4>
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
            <div class="col-md-6 col-sm-12 mb-2 mb-md-0">
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
            <div class="col-md-6 col-sm-12">
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
              <button @click="getCategories" class="btn btn-success">
                <i class="fa-solid fa-filter"></i> Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories List -->
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <h5 class="my-2 d-flex align-items-center">Categories</h5>
        </div>
        <div class="card-body">
          <div class="categories-action d-flex justify-content-between mb-3">
            <div></div>
            <router-link :to="{ name: 'CreateCategory' }">
              <button class="btn btn-main btn-primary">+ New Category</button>
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
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="categories.length">
              <tr v-for="(category, index) in categories" :key="category.id">
                <td>
                  <input 
                    class="form-check-input" 
                    type="checkbox"
                    name="id"
                    :value="category.id"
                    v-model="checkedItems[index]"
                  >
                </td>
                <td>{{ (page - 1) * 10 + index + 1 }}</td>
                <td>
                  <div class="thumbnail">
                    <img 
                      :src="category.imageUrls[0] ? category.imageUrls[0] : '/default-coffee-image.png'" 
                      :alt="category.name"
                    >
                  </div>
                </td>
                <td>{{ category.name }}</td>
                <td>
                  <p v-html="category.description"></p>
                </td>
                <td>
                  <v-chip :color="getStatusClass(category.status)">
                    {{ getStatusLabel(category.status) }}
                  </v-chip>
                </td>
                <td>
                  <div class="d-flex icon">
                    <!-- View Category Details -->
                    <div
                      class="cursor-pointer me-2"
                      @click="viewCategoryDetail(category.id)"
                      title="View Category"
                    >
                      <i class="fa-regular fa-clipboard fa-lg fa-fw"></i>
                    </div>
                    <router-link 
                      :to="{ name: 'ModifyCategory', params: { id: `${category.id}` } }"
                      class="d-flex align-items-center me-2"
                      title="Modify Category"
                    >
                      <i class="fa-regular fa-pen-to-square fa-lg fa-fw"></i>
                    </router-link>
                    <div
                      @click="handleDelete(category.id)"
                      class="cursor-pointer"
                      title="Delete Category"
                    >
                      <i class="fa-regular fa-trash-can fa-lg fa-fw"></i>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="7">
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

          <!-- View Supplier Dialog -->
          <div class="me-2">
            <v-dialog
              v-model="viewDialog"
              max-width="720"
              transition="dialog-top-transition"
            >
              <v-card
                prepend-icon="mdi-information"
                title="Category Details"
              >
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Name"
                        density="compact"
                        variant="outlined"
                        v-model="categoryDetail.name"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                      <v-select
                        :items="statusOptions"
                        label="Status"
                        density="compact"
                        variant="outlined"
                        item-title="label"
                        item-value="value"
                        v-model="categoryDetail.status" 
                        :readonly="true"
                      />
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                      <label for="description" class="form-label">Description</label>
                      <h6 v-html="categoryDetail.description"></h6>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    text="Close"
                    variant="plain"
                    @click="viewDialog = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>
    </div>

    <div class="categories-wrapper" v-else>
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

  <div class="categories fluid-container mx-5" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import FilterStatus from '@/components/admin/FilterStatus/FilterStatus.vue'
import Search from '@/components/admin/Search/Search.vue'
import categoryService from '@/services/admin/category.service'
import ChangeMulti from '@/components/admin/ChangeMulti/ChangeMulti.vue'
import confirmDialogHelper from '@/helpers/admin/dialogs/confirm.helper.js'
import successDialogHelper from '@/helpers/admin/dialogs/success.helper.js'
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue'
import Select from '@/components/admin/Select/Select.vue'
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper'
import { FilterHelper } from '@/helpers/admin/filter/filter.helper.js';
import { CategoryStatus, CategorySortField } from '@/enums/category.enum.js'
import { SortDirection } from '@/enums/sortDir.enum.js'

export default {
  name: "Categories",
  components: {
    FilterStatus,
    Search,
    ChangeMulti,
    Unauthorized,
    Select
  },
  data() {
    return {
      categories: [],
      filter: {
        status: '',
        keyword: ''
      },
      sortCriteria: [ { sortBy: '', sortDir: '' } ], // Sử dụng sortCriteria
      checkall: false,
      checkedItems: [],
      page: 1,
      totalPages: 0,
      isFetching: true,
      alert: false,
      statusOptions: CategoryStatus.toArray(),
      sortFieldOptions: CategorySortField.toArray(),
      sortDirectionOptions: SortDirection.toArray(),
      viewDialog: false,
      categoryDetail: {
        name: '',
        status: '',
        description: '',
      }
    }
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName)
    },
    async getCategories() {
      const processedFilter = FilterHelper.processFilter(this.filter);
      // Chuyển đổi sortCriteria thành sortBy và sortDir arrays
      const sortBy = this.sortCriteria.map(criteria => criteria.sortBy).filter(Boolean);
      const sortDir = this.sortCriteria.map(criteria => criteria.sortDir).filter(Boolean);
      console.log(processedFilter, sortBy, sortDir)
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
        const response = await categoryService.getAll({
          params: params
        })
        console.log(response)
        this.categories = response.data.content
        this.totalPages = response.data.page.totalPages
        this.isFetching = false

        // update url
        this.updateURL(processedFilter)
      }
      catch (err) {
        console.log(err)
        this.isFetching = false
        // Có thể hiển thị thông báo lỗi cho người dùng
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
      }
      this.sortCriteria = [ { sortBy: '', sortDir: '' } ] // Reset sortCriteria
      this.getCategories()
    },
    handleCheckAll() {  
      this.checkedItems = this.categories.map(() => this.checkall)
    },
    async handleDelete(id) {
      try{
        if (this.checkPermission('CATEGORY_DELETE')) {
          confirmDialogHelper().then(async (result) => {
            if (result.isConfirmed) {
              await categoryService.deleteOne(id)
              this.getCategories()
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
    getStatusClass(status) {
      const config = CategoryStatus.getConfig(status);
      return `${config.color}`;
    },
    getStatusLabel(status) {
      return CategoryStatus.getLabel(status);
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
        /**
     * Fetches and displays category details in a dialog.
     * @param {Number} id - The ID of the category to view.
     */
     async viewCategoryDetail(id) {
      try {
        const res = await categoryService.getOne(id);
        console.log(res)
        this.categoryDetail = { 
          name: res.data.name,
          status: res.data.status,
          description: res.data.description,
        };
        this.viewDialog = true;
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    }
  },
  mounted() {
    this.initFilterFromUrl()
    this.getCategories()
  },
  watch: {
    filter: {
      handler() {
        this.page = 1
        // Do not auto-fetch, user must click "Apply Filters"
      },
      deep: true
    },
    sortCriteria: {
      handler() {
        // Do not auto-fetch, user must click "Apply Filters"
      },
      deep: true
    },
    page() {
      this.getCategories()
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

@media (max-width: 767.98px) {
  .d-flex:not(.categories-title, .card-header) {
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

  .categories-action {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
