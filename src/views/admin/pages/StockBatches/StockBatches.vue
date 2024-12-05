<template>
  <div class="stock-batches fluid-container mx-5" v-if="checkPermission('STOCK_BATCH_VIEW')">
    <div class="stock-batches-wrapper position-relative" v-if="!isFetching">
      <!-- Title -->
      <div class="stock-batches-title my-4 d-flex align-items-center">
        <h4 class="gray-text">Management</h4>
        <h5 class="mx-1">/</h5> 
        <h4 class="primary-text">Stock Batches</h4>
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
                placeholder="Search..."
              />
            </div>
          </div>
          <!-- Expanded Filters -->
          <v-expansion-panels class="mb-5">
            <v-expansion-panel title="Advanced Filters">
              <v-expansion-panel-text>
                <div class="row">
                  <!-- Ingredient -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="ingredientOptions"
                      label="Ingredients"
                      density="compact"
                      variant="outlined"
                      item-title="name"
                      item-value="id"
                      multiple
                      chips
                      clearable
                      v-model="filter.ingredientIds"
                    />
                  </div>
                  <!-- Supplier -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="supplierOptions"
                      label="Supplier"
                      density="compact"
                      variant="outlined"
                      item-title="name"
                      item-value="id"
                      multiple
                      chips
                      clearable
                      v-model="filter.supplierIds"
                    />
                  </div>
                  <!-- Status -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="measurementUnitOptions"
                      label="Unit"
                      density="compact"
                      variant="outlined"
                      item-title="label"
                      item-value="value"
                      clearable
                      v-model="filter.defaultUnit"
                    />
                  </div>
                  <div class="col-lg-0 mb-md-2 mb-lg-0"></div>
                  <!-- Received Date From -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Received Date From" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.receivedDateFrom"
                    />
                  </div>
                  <!-- Received Date To -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Received Date To" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.receivedDateTo"
                    />
                  </div>
                  <div class="col-lg-4 mb-md-2 mb-lg-0"></div>
                  <!-- Expiration Date From -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Expiration Date From" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.expirationDateFrom"
                    />
                  </div>
                  <!-- Expiration Date To -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Expiration Date To" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.expirationDateTo"
                    />
                  </div>
                  <div class="col-lg-4 mb-md-2 mb-lg-0"></div>
                  <!-- Initial Quantity From -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Initial Quantity From"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.minInitialQuantity"
                      :rules="[value => value == null || value >= 0 || 'Initial quantity must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Initial Quantity To -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Initial Quantity To"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.maxInitialQuantity"
                      :rules="[value => value == null || value >= 0 || 'Initial quantity must be non-negative']"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-4 mb-md-2 mb-lg-0"></div>
                  <!-- Remaining Quantity From -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Remaining Quantity From"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.minRemainingQuantity"
                      :rules="[value => value == null || value >= 0 || 'Remaining quantity must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Remaining Quantity To -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Remaining Quantity To"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.maxRemainingQuantity"
                      :rules="[value => value == null || value >= 0 || 'Remaining quantity must be non-negative']"
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
              <button @click="getStockBatches" class="btn btn-success">
                <i class="fa-solid fa-filter"></i> Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Batches List -->
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <h5 class="my-2 d-flex align-items-center">Stock Batches</h5>
        </div>
        <div class="card-body">
          <div class="stock-batches-action d-flex justify-content-between mb-3">
            <div></div>
            <!-- Add New Stock Batch Button -->
            <!-- <router-link :to="{ name: 'CreateStockBatch' }">
              <button class="btn btn-main btn-primary">+ New Stock Batch</button>
            </router-link> -->
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
                <th>Ingredient Name</th>
                <th>Supplier</th>
                <th>Supply Order Code</th>
                <th>Initial Quantity</th>
                <th>Remaining Quantity</th>
                <th>Unit</th>
                <th>Received Date</th>
                <th>Expiration Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="stockBatches.length">
              <tr v-for="(batch, index) in stockBatches" :key="batch.id">
                <td>
                  <input 
                    class="form-check-input" 
                    type="checkbox"
                    name="id"
                    :value="batch.id"
                    v-model="checkedItems[index]"
                  >
                </td>
                <td>{{ (page - 1) * 10 + index + 1 }}</td>
                <td>{{ batch.ingredientName }}</td>
                <td>{{ batch.supplierName }}</td>
                <td>{{ batch.supplyOrderCode }}</td>
                <td>{{ batch.initialQuantity }}</td>
                <td>{{ batch.remainingQuantity }}</td>
                <td>{{ getMeasurementUnitLabel(batch.defaultUnit) }}</td>
                <td>{{ formatDate(batch.receivedDate) }}</td>
                <td>{{ formatDate(batch.expirationDate) }}</td>
                <td>
                  <div class="d-flex icon">
                    <!-- View Stock Batch Details -->
                    <div
                      class="cursor-pointer me-2"
                      @click="viewStockBatchDetail(batch.id)"
                      title="View Stock Batch"
                    >
                      <i class="fa-regular fa-clipboard fa-lg fa-fw"></i>
                    </div>
                    
                    <!-- Edit Stock Batch -->
                    <!-- <router-link 
                      :to="{ name: 'ModifyStockBatch', params: { id: `${batch.id}` } }"
                      class="d-flex align-items-center me-2"
                      title="Modify Stock Batch"
                    >
                      <i class="fa-regular fa-pen-to-square fa-lg fa-fw"></i>
                    </router-link> -->

                    <!-- Delete Stock Batch -->
                    <div
                      @click="handleDelete(batch.id)"
                      class="cursor-pointer"
                      title="Delete Stock Batch"
                    >
                      <i class="fa-regular fa-trash-can fa-lg fa-fw"></i>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="10">
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
          <!-- View Stock Batch Dialog -->
          <div class="me-2">
            <v-dialog
              v-model="viewDialog"
              max-width="860"
              transition="dialog-top-transition"
            >
              <v-card
                prepend-icon="mdi-information"
                title="Stock Batch Details"
              >
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Ingredient Name"
                        density="compact"
                        variant="outlined"
                        v-model="stockBatchDetail.ingredientName"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-select
                        :items="measurementUnitOptions"
                        label="Default Unit"
                        density="compact"
                        variant="outlined"
                        item-title="label"
                        item-value="value"
                        v-model="stockBatchDetail.defaultUnit"
                        :readonly="true"
                      />
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Initial Quantity"
                        density="compact"
                        variant="outlined"
                        v-model="stockBatchDetail.initialQuantity"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Remaining Quantity"
                        density="compact"
                        variant="outlined"
                        v-model="stockBatchDetail.remainingQuantity"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Supply Order Code"
                        density="compact"
                        variant="outlined"
                        v-model="stockBatchDetail.supplyOrderCode"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Supply Order Description"
                        density="compact"
                        variant="outlined"
                        v-model="stockBatchDetail.supplyOrderDescription"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Received Date"
                        density="compact"
                        variant="outlined"
                        v-model="stockBatchDetail.receivedDate"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Expiration Date"
                        density="compact"
                        variant="outlined"
                        v-model="stockBatchDetail.expirationDate"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Supplier Name"
                        density="compact"
                        variant="outlined"
                        v-model="stockBatchDetail.supplierName"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Number of Items"
                        density="compact"
                        variant="outlined"
                        v-model="stockBatchDetail.numberOfItems"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Price Per Item"
                        density="compact"
                        variant="outlined"
                        v-model="stockBatchDetail.pricePerItem"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Unit Value"
                        density="compact"
                        variant="outlined"
                        v-model="stockBatchDetail.unitValue"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Subtotal"
                        density="compact"
                        variant="outlined"
                        prefix="$"
                        v-model="stockBatchDetail.subtotal"
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
    <div class="stock-batches-wrapper" v-else>
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
                <th colspan="10">
                  <v-skeleton-loader
                    class="my-0"
                    type="table-row"
                  ></v-skeleton-loader>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="10">
                  <v-skeleton-loader
                    class="my-0"
                    type="table-row-divider@10"
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
  <div class="stock-batches fluid-container mx-5" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import Search from '@/components/admin/Search/Search.vue'
import stockBatchService from '@/services/admin/stockBatch.service.js'
import supplierService from '@/services/admin/supplier.service.js'
import ingredientService from '@/services/admin/ingredient.service.js'
import confirmDialogHelper from '@/helpers/admin/dialogs/confirm.helper.js'
import successDialogHelper from '@/helpers/admin/dialogs/success.helper.js'
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue'
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper'
import { FilterHelper } from '@/helpers/admin/filter/filter.helper.js';
import { StockBatchSortField } from '@/enums/stockBatch.enum.js'
import { MeasurementUnit } from '@/enums/measurementUnit.enum.js'
import { SortDirection } from '@/enums/sortDir.enum.js'
import Swal from 'sweetalert2';

export default {
  name: "StockBatches",
  components: {
    Search,
    Unauthorized,
  },
  data() {
    return {
      stockBatches: [],
      filter: {
        keyword: '',
        minInitialQuantity: null,
        maxInitialQuantity: null,
        minRemainingQuantity: null,
        maxRemainingQuantity: null,
        receivedDateFrom: null,
        receivedDateTo: null,
        expirationDateFrom: null,
        expirationDateTo: null,
        supplierIds: [],
        ingredientIds: [], 
        defaultUnit: null
      },
      sortCriteria: [ { sortBy: '', sortDir: '' } ], 
      checkall: false,
      checkedItems: [],
      page: 1,
      totalPages: 0,
      isFetching: true,
      alert: false,
      sortFieldOptions: StockBatchSortField.toArray(),
      sortDirectionOptions: SortDirection.toArray(),
      measurementUnitOptions: MeasurementUnit.toArray(),
      viewDialog: false,
      stockBatchDetail: {
        id: null,
        ingredientId: null,
        ingredientName: '',
        numberOfItems: null,
        pricePerItem: null,
        unitValue: null,
        defaultUnit: '',
        subtotal: null,
        initialQuantity: null,
        remainingQuantity: null,
        supplyOrderId: null,
        supplyOrderCode: '',
        supplyOrderDescription: '',
        receivedDate: '',
        expirationDate: '',
        supplierId: null,
        supplierName: '',
      },
      supplierOptions: [],
      ingredientOptions: [],
      itemTableHeaders: [
        { title: 'Number of Items', key: 'numberOfItems' },
        { title: 'Price Per Item ($)', key: 'pricePerItem' },
        { title: 'Unit Value', key: 'unitValue' },
        { title: 'Default Unit', key: 'defaultUnit' },
        { title: 'Subtotal ($)', key: 'subtotal' },
        { title: 'Initial Quantity', key: 'initialQuantity' },
        { title: 'Remaining Quantity', key: 'remainingQuantity' },
        { title: 'Received Date', key: 'receivedDate' },
        { title: 'Expiration Date', key: 'expirationDate' },
      ],
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
     * Fetches the list of stock batches with applied filters and sorting.
     */
    async getStockBatches() {
      console.log(this.filter)
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
        const response = await stockBatchService.getAll({
          params: params
        })
        console.log(response)
        this.stockBatches = response.data.content
        this.totalPages = response.data.page.totalPages
        this.isFetching = false

        // Update URL
        this.updateURL(processedFilter)
      }
      catch (err) {
        console.log(err)
        this.isFetching = false
      }
    },

    async fetchSuppliers() {
      try {
        const filter = {
          params: {
            size: 50,
          }
        }
        const result = await supplierService.getAll(filter)
        console.log(result)
        this.supplierOptions = result.data.content
      }
      catch(err) {
        console.log(err)
      }
    },

    async fetchIngredients() {
      try {
        const filter = {
          params: {
            size: 50,
          }
        }
        const result = await ingredientService.getAll(filter)
        console.log(result)
        this.ingredientOptions = result.data.content
      }
      catch(err) {
        console.log(err)
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
        minInitialQuantity: null,
        maxInitialQuantity: null,
        minRemainingQuantity: null,
        maxRemainingQuantity: null,
        status: null,
        paymentMethod: null,
        paymentStatus: null,
        receivedDateFrom: null,
        receivedDateTo: null,
        expirationDateFrom: null,
        expirationDateTo: null,
        supplierIds: [],
        ingredientIds: [], 
      }
      this.sortCriteria = [ { sortBy: '', sortDir: '' } ] // Reset sortCriteria
      this.getStockBatches()
    },

    /**
     * Handles the "Check All" functionality.
     */
    handleCheckAll() {  
      this.checkedItems = this.stockBatches.map(() => this.checkall)
    },

    /**
     * Deletes a stock batch after confirmation.
     * @param {Number} id - The ID of the stock batch to delete.
     */
    async handleDelete(id) {
      try{
        if (this.checkPermission('STOCK_BATCH_DELETE')) {
          confirmDialogHelper().then(async (result) => {
            if (result.isConfirmed) {
              await stockBatchService.deleteOne(id)
              this.getStockBatches()
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

      // restore receivedDateFrom
      const receivedDateFromParams = searchParams.get('receivedDateFrom')
      if (receivedDateFromParams) {
        this.filter.receivedDateFrom = new Date(receivedDateFromParams)
      } 

      // restore receivedDateTo
      const receivedDateToParams = searchParams.get('receivedDateTo')
      if (receivedDateToParams) {
        this.filter.receivedDateTo = new Date(receivedDateToParams)
      }

      // restore expirationDateFrom
      const expirationDateFromParams = searchParams.get('expirationDateFrom')
      if (expirationDateFromParams) {
        this.filter.expirationDateFrom = new Date(expirationDateFromParams)
      } 

      // restore expirationDateTo
      const expirationDateToParams = searchParams.get('expirationDateTo')
      if (expirationDateToParams) {
        this.filter.expirationDateTo = new Date(expirationDateToParams)
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
     * Fetches and displays stock batch details in a dialog.
     * @param {Number} id - The ID of the stock batch to view.
     */
    async viewStockBatchDetail(id) {
      try {
        const res = await stockBatchService.getOne(id);
        console.log(res)
        this.stockBatchDetail = { 
          id: res.data.id,
          ingredientId: res.data.ingredientId,
          ingredientName: res.data.ingredientName,
          numberOfItems: res.data.numberOfItems,
          pricePerItem: res.data.pricePerItem,
          unitValue: res.data.unitValue,
          defaultUnit: res.data.defaultUnit,
          subtotal: res.data.subtotal,
          initialQuantity: res.data.initialQuantity,
          remainingQuantity: res.data.remainingQuantity,
          supplyOrderId: res.data.supplyOrderId,
          supplyOrderCode: res.data.supplyOrderCode,
          supplyOrderDescription: res.data.supplyOrderDescription,
          receivedDate: this.formatDateTime(res.data.receivedDate),
          expirationDate: this.formatDateTime(res.data.expirationDate),
          supplierId: res.data.supplierId,
          supplierName: res.data.supplierName,
        };
        this.viewDialog = true;
      } catch (error) {
        console.error("Error fetching stock batch details:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch stock batch details.',
          confirmButtonText: 'OK',
        });
      }
    },

    /**
     * Formats a number as currency.
     * @param {Number} amount - The amount to format.
     * @returns {String}
     */
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    },

    /**
     * Formats a date string.
     * @param {String} dateStr - The date string to format.
     * @returns {String}
     */
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },

    /**
     * Formats a datetime string.
     * @param {String} dateTimeStr - The datetime string to format.
     * @returns {String}
     */
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return '';
      const date = new Date(dateTimeStr);
      return date.toLocaleString();
    },
    getMeasurementUnitLabel(status) {
      return MeasurementUnit.getLabel(status);
    },
  },
  mounted() {
    this.initFilterFromUrl()
    this.getStockBatches()
    this.fetchSuppliers() 
    this.fetchIngredients() 
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
      this.getStockBatches()
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
  .d-flex:not(.stock-batches-title, .card-header) {
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

  .stock-batches-action {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
