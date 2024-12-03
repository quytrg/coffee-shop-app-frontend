<template>
  <div class="suppliers fluid-container mx-5" v-if="checkPermission('SUPPLIER_VIEW')">
    <div class="suppliers-wrapper position-relative" v-if="!isFetching">
      <!-- Title -->
      <div class="suppliers-title my-4 d-flex align-items-center">
        <h4 class="gray-text">Management</h4>
        <h5 class="mx-1">/</h5> 
        <h4 class="primary-text">Suppliers</h4>
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
          <!-- Basic Filters -->
          <div class="row mb-3">
            <div class="col-lg-6 col-md-12 mb-md-2 mb-lg-0">
              <Search 
                v-model:keyword="filter.keyword"
                placeholder="Search Suppliers..."
              />
            </div>
          </div>
          <!-- Expanded Filters -->
          <v-expansion-panels class="mb-5">
            <v-expansion-panel title="Advanced Filters">
              <v-expansion-panel-text>
                <div class="row">
                  <div class="col-lg-6 col-md-12 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Rating"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.minRating"
                      :rules="[value => value == null || (value >= 0 && value <= 10 || 'Rating cannot exceed 10.00')]"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-12">
                    <v-text-field
                      label="Max Rating"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.maxRating"
                      :rules="[value => value == null || (value >= 0 && value <= 10 || 'Rating cannot exceed 10.00')]"
                    ></v-text-field>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <!-- Dynamic Sort Criteria -->
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

          <!-- Apply Filters Button -->
          <div class="row mb-3">
            <div class="col-12 text-end">
              <button @click="getSuppliers" class="btn btn-success">
                <i class="fa-solid fa-filter"></i> Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Suppliers List -->
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <h5 class="my-2 d-flex align-items-center">Suppliers</h5>
        </div>
        <div class="card-body">
          <div class="suppliers-action d-flex justify-content-between mb-3">
            <div></div>
            <router-link :to="{ name: 'CreateSupplier' }">
              <button class="btn btn-main btn-primary">+ New Supplier</button>
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
                <th>Name</th>
                <th>Address</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="suppliers.length">
              <tr v-for="(supplier, index) in suppliers" :key="supplier.id">
                <td>
                  <input 
                    class="form-check-input" 
                    type="checkbox"
                    name="id"
                    :value="supplier.id"
                    v-model="checkedItems[index]"
                  >
                </td>
                <td>{{ (page - 1) * 10 + index + 1 }}</td>
                <td>{{ supplier.name }}</td>
                <td>{{ supplier.address }}</td>
                <td>{{ supplier.phoneNumber }}</td>
                <td>{{ supplier.email }}</td>
                <td>{{ supplier.rating }}</td>
                <td>
                  <div class="d-flex icon">
                    <!-- View Supplier Details -->
                    <div
                      class="cursor-pointer me-2"
                      @click="viewSupplierDetail(supplier.id)"
                      title="View Supplier"
                    >
                      <i class="fa-regular fa-clipboard fa-lg fa-fw"></i>
                    </div>
                    
                    <!-- Edit Supplier -->
                    <router-link 
                      :to="{ name: 'ModifySupplier', params: { id: `${supplier.id}` } }"
                      class="d-flex align-items-center me-2"
                      title="Modify Supplier"
                    >
                      <i class="fa-regular fa-pen-to-square fa-lg fa-fw"></i>
                    </router-link>
                    
                    <!-- Delete Supplier -->
                    <div
                      @click="handleDelete(supplier.id)"
                      class="cursor-pointer"
                      title="Delete Supplier"
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
          <!-- View Supplier Dialog -->
          <div class="me-2">
            <v-dialog
              v-model="viewDialog"
              max-width="720"
              transition="dialog-top-transition"
            >
              <v-card
                prepend-icon="mdi-information"
                title="Supplier Details"
              >
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Name"
                        density="compact"
                        variant="outlined"
                        v-model="supplierDetail.name"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Address"
                        density="compact"
                        variant="outlined"
                        v-model="supplierDetail.address"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Phone Number"
                        density="compact"
                        variant="outlined"
                        v-model="supplierDetail.phoneNumber"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Email"
                        density="compact"
                        variant="outlined"
                        v-model="supplierDetail.email"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Rating"
                        density="compact"
                        variant="outlined"
                        v-model="supplierDetail.rating"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Description"
                        density="compact"
                        variant="outlined"
                        v-model="supplierDetail.description"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Other Contact Info"
                        density="compact"
                        variant="outlined"
                        v-model="supplierDetail.otherContactInfo"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Tax Code"
                        density="compact"
                        variant="outlined"
                        v-model="supplierDetail.taxCode"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Bank Account"
                        density="compact"
                        variant="outlined"
                        v-model="supplierDetail.bankAccount"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Payment Terms"
                        density="compact"
                        variant="outlined"
                        v-model="supplierDetail.paymentTerms"
                        :readonly="true"
                      ></v-text-field>
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
    <!-- Skeleton Loaders while fetching data -->
    <div class="suppliers-wrapper" v-else>
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
                <th colspan="8">
                  <v-skeleton-loader
                    class="my-0"
                    type="table-row"
                  ></v-skeleton-loader>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="8">
                  <v-skeleton-loader
                    class="my-0"
                    type="table-row-divider@8"
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
  <!-- Unauthorized Component -->
  <div class="suppliers fluid-container mx-5" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import Search from '@/components/admin/Search/Search.vue'
import supplierService from '@/services/admin/supplier.service.js'
import confirmDialogHelper from '@/helpers/admin/dialogs/confirm.helper.js'
import successDialogHelper from '@/helpers/admin/dialogs/success.helper.js'
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue'
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper'
import { FilterHelper } from '@/helpers/admin/filter/filter.helper.js';
import { SupplierSortField } from '@/enums/supplier.enum.js'
import { SortDirection } from '@/enums/sortDir.enum.js'

export default {
  name: "Suppliers",
  components: {
    Search,
    Unauthorized,
  },
  data() {
    return {
      suppliers: [],
      filter: {
        keyword: '',
        minRating: null,
        maxRating: null
      },
      sortCriteria: [ { sortBy: '', sortDir: '' } ], // Use sortCriteria
      checkall: false,
      checkedItems: [],
      page: 1,
      totalPages: 0,
      isFetching: true,
      alert: false,
      sortFieldOptions: SupplierSortField.toArray(),
      sortDirectionOptions: SortDirection.toArray(),
      viewDialog: false,
      supplierDetail: {
        name: '',
        description: '',
        address: '',
        phoneNumber: '',
        email: '',
        otherContactInfo: '',
        taxCode: '',
        bankAccount: '',
        paymentTerms: '',
        rating: null,
      }
    }
  },
  methods: {
    /**
     * Checks if the user has the required permission.
     * @param {String} permissionName - The name of the permission to check.
     * @returns {Boolean}
     */
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName)
    },

    /**
     * Fetches the list of suppliers with applied filters and sorting.
     */
    async getSuppliers() {
      const processedFilter = FilterHelper.processFilter(this.filter);
      // Convert sortCriteria into sortBy and sortDir arrays
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

        if (sortDir.length !== 0) {
          params.sortDir = sortDir.join(',')
        }
        const response = await supplierService.getAll({
          params: params
        })
        console.log(response)
        this.suppliers = response.data.content
        this.totalPages = response.data.page.totalPages
        this.isFetching = false

        // update url
        this.updateURL(processedFilter)
      }
      catch (err) {
        console.log(err)
        this.isFetching = false
        // Optionally, display an error message to the user
      }
    },

    /**
     * Updates the URL with current filters and sorting parameters.
     * @param {Object} processedFilter - The processed filter object.
     */
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

    /**
     * Clears all filters and resets sort criteria.
     */
    handleClear() {
      this.filter = {
        keyword: '',
        minRating: null,
        maxRating: null
      }
      this.sortCriteria = [ { sortBy: '', sortDir: '' } ] // Reset sortCriteria
      this.getSuppliers()
    },

    /**
     * Handles the "Check All" functionality.
     */
    handleCheckAll() {  
      this.checkedItems = this.suppliers.map(() => this.checkall)
    },

    /**
     * Deletes a supplier after confirmation.
     * @param {Number} id - The ID of the supplier to delete.
     */
    async handleDelete(id) {
      try{
        if (this.checkPermission('SUPPLIER_DELETE')) {
          confirmDialogHelper().then(async (result) => {
            if (result.isConfirmed) {
              await supplierService.deleteOne(id)
              this.getSuppliers()
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
        // Optionally, display an error message to the user
      }
    },

    /**
     * Initializes filters from URL parameters when the page loads.
     */
    initFilterFromUrl() {
      const searchParams = new URLSearchParams(window.location.search);
      this.filter = FilterHelper.parseFilterFromUrl(searchParams);
      
      // Restore sortCriteria from URL
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

    /**
     * Adds a new sort criteria row.
     */
    addSortCriteria() {
      this.sortCriteria.push({ sortBy: '', sortDir: '' });
    },

    /**
     * Removes a sort criteria row at a specific index.
     * @param {Number} index - The index of the sort criteria to remove.
     */
    removeSortCriteria(index) {
      if (this.sortCriteria.length > 1) {
        this.sortCriteria.splice(index, 1);
      }
    },

    /**
     * Handles page changes for pagination.
     * @param {Number} newPage - The new page number.
     */
    handlePageChange(newPage) {
      this.page = newPage;
    },

    /**
     * Fetches and displays supplier details in a dialog.
     * @param {Number} id - The ID of the supplier to view.
     */
    async viewSupplierDetail(id) {
      try {
        const res = await supplierService.getOne(id);
        console.log(res)
        this.supplierDetail = { 
          name: res.data.name,
          description: res.data.description,
          address: res.data.address,
          phoneNumber: res.data.phoneNumber,
          email: res.data.email,
          otherContactInfo: res.data.otherContactInfo,
          taxCode: res.data.taxCode,
          bankAccount: res.data.bankAccount,
          paymentTerms: res.data.paymentTerms,
          rating: res.data.rating,
        };
        this.viewDialog = true;
      } catch (error) {
        console.error("Error fetching supplier details:", error);
      }
    }
  },
  mounted() {
    this.initFilterFromUrl()
    this.getSuppliers()
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
      },
      deep: true
    },
    page() {
      this.getSuppliers()
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
  .d-flex:not(.suppliers-title, .card-header) {
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

  .suppliers-action {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
