<!-- src/views/admin/StockBatchReports/StockBatchReport.vue -->

<template>
  <div class="stock-batch-report fluid-container mx-5" v-if="checkPermission('STOCK_BATCH_REPORT_VIEW')">
    <div class="stock-batch-report-wrapper position-relative" v-if="!isFetching">
      <!-- Title -->
      <div class="stock-batch-report-title my-4 d-flex align-items-center">
        <h4 class="gray-text">Management</h4>
        <h5 class="mx-1">/</h5> 
        <h4 class="primary-text">Stock Batch Reports</h4>
      </div>

      <!-- Alert -->
      <transition name="slide-fade">
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
      </transition>

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
                placeholder="Search by Ingredient Name, Description, or Supply Order Code..."
              />
            </div>
            <div class="col-lg-6 col-md-12 mb-md-2 mb-lg-0">
              <v-select
                :items="defaultUnitOptions"
                label="Default Unit"
                density="compact"
                variant="outlined"
                item-title="label"
                item-value="value"
                clearable
                v-model="filter.defaultUnit"
              />
            </div>
          </div>
          <!-- Advanced Filters -->
          <v-expansion-panels class="mb-5">
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span>Advanced Filters</span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="row">
                  <!-- Initial Quantity Range -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Initial Quantity"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.minInitialQuantity"
                      :rules="[value => value == null || value >= 0 || 'Initial quantity must be non-negative']"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Max Initial Quantity"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.maxInitialQuantity"
                      :rules="[value => value == null || value >= 0 || 'Initial quantity must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Remaining Quantity Range -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Remaining Quantity"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.minRemainingQuantity"
                      :rules="[value => value == null || value >= 0 || 'Remaining quantity must be non-negative']"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Max Remaining Quantity"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.maxRemainingQuantity"
                      :rules="[value => value == null || value >= 0 || 'Remaining quantity must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Expiration Date Range -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Expiration Date From" 
                      variant="solo" 
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.expirationDateFrom"
                      type="date-time"
                    />
                  </div>
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Expiration Date To" 
                      variant="solo" 
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.expirationDateTo"
                      type="date-time"
                    />
                  </div>
                  <!-- Received Date Range -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Received Date From" 
                      variant="solo" 
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.receivedDateFrom"
                      type="date-time"
                    />
                  </div>
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Received Date To" 
                      variant="solo" 
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.receivedDateTo"
                      type="date-time"
                    />
                  </div>
                  <!-- Ingredient IDs -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
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
                  <!-- Supplier IDs -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="supplierOptions"
                      label="Suppliers"
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
                  <!-- Number of Items Range -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Number of Items"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.minNumberOfItems"
                      :rules="[value => value == null || value >= 0 || 'Number of items must be non-negative']"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Max Number of Items"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.maxNumberOfItems"
                      :rules="[value => value == null || value >= 0 || 'Number of items must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Price Per Item Range -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Price Per Item ($)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.minPricePerItem"
                      :rules="[value => value == null || value >= 0 || 'Price must be non-negative']"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Max Price Per Item ($)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.maxPricePerItem"
                      :rules="[value => value == null || value >= 0 || 'Price must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Unit Value Range -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Unit Value"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.minUnitValue"
                      :rules="[value => value == null || value >= 0 || 'Unit value must be non-negative']"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Max Unit Value"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.maxUnitValue"
                      :rules="[value => value == null || value >= 0 || 'Unit value must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Subtotal Range -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Subtotal ($)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.minSubtotal"
                      :rules="[value => value == null || value >= 0 || 'Subtotal must be non-negative']"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Max Subtotal ($)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.maxSubtotal"
                      :rules="[value => value == null || value >= 0 || 'Subtotal must be non-negative']"
                    ></v-text-field>
                  </div>
                </div>
              </v-expansion-panel-content>
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

          <!-- Apply Filters and Export Buttons -->
          <div class="row mb-3">
            <div class="col-12 d-flex justify-content-end gap-2">
              <button @click="exportReport" class="btn btn-secondary">
                <i class="fa-solid fa-file-export"></i> Export
              </button>
              <button @click="getStockBatchReports" class="btn btn-success">
                <i class="fa-solid fa-filter"></i> Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Batch Report List -->
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <h5 class="my-2 d-flex align-items-center">Stock Batch Report</h5>
        </div>
        <div class="card-body">
          <div class="stock-batch-report-action d-flex justify-content-between mb-3">
            <div></div>
            <!-- Additional actions can be added here -->
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
                <th>Number of Items</th>
                <th>Price per Item ($)</th>
                <th>Unit Value</th>
                <th>Subtotal ($)</th>
                <th>Order Code</th>
                <th>Order Status</th>
                <th>Supplier Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="stockBatchReports.length">
              <tr v-for="(report, index) in stockBatchReports" :key="report.id">
                <td>
                  <input 
                    class="form-check-input" 
                    type="checkbox"
                    name="id"
                    :value="report.id"
                    v-model="checkedItems[index]"
                  >
                </td>
                <td>{{ (page - 1) * 10 + index + 1 }}</td>
                <td>{{ report.ingredientName }}</td>
                <td>{{ report.numberOfItems }}</td>
                <td>{{ formatCurrency(report.pricePerItem) }}</td>
                <td>{{ report.unitValue }} {{ getMeasurementUnitLabel(report.defaultUnit) }}</td>
                <td>{{ formatCurrency(report.subtotal) }}</td>
                <td>{{ report.supplyOrderCode }}</td>
                <td>
                  <v-chip :color="getStatusClass(report.orderStatus)">
                    {{ getStatusLabel(report.orderStatus) }}
                  </v-chip>
                </td>
                <td>{{ report.supplierName }}</td>
                <td>
                  <div class="d-flex icon">
                    <!-- View Report Details -->
                    <div
                      class="cursor-pointer me-2"
                      @click="viewReportDetail(report.id)"
                      title="View Report"
                    >
                      <i class="fa-regular fa-clipboard fa-lg fa-fw"></i>
                    </div>
                    <!-- Additional actions can be added here -->
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="11">
                  <div class="text-center">
                    No results found.
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
          <!-- View Report Dialog -->
          <div class="me-2">
            <v-dialog
              v-model="viewDialog"
              max-width="860"
              transition="dialog-top-transition"
            >
              <v-card
                prepend-icon="mdi-information"
                title="Stock Batch Report Details"
              >
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Ingredient Name"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.ingredientName"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Number of Items"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.numberOfItems"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Price per Item ($)"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.pricePerItem"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Unit Value"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.unitValue"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Subtotal ($)"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.subtotal"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Order Code"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.supplyOrderCode"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-select
                        :items="statusOptions"
                        label="Order Status"
                        density="compact"
                        variant="outlined"
                        item-title="label"
                        item-value="value"
                        v-model="reportDetail.orderStatus"
                        :readonly="true"
                      />
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Supplier Name"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.supplierName"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="Created By"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.createdBy"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="Created At"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.createdAt"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="Updated By"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.updatedBy"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="Updated At"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.updatedAt"
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
      <!-- Skeleton Loaders while fetching data -->
      <div class="stock-batch-report-wrapper" v-else>
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
                  <th colspan="11">
                    <v-skeleton-loader
                      class="my-0"
                      type="table-row"
                    ></v-skeleton-loader>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="11">
                    <v-skeleton-loader
                      class="my-0"
                      type="table-row-divider@11"
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
    <div class="stock-batch-report fluid-container mx-5" v-else>
      <Unauthorized />
    </div>
  </div>
</template>

<script>
import Search from '@/components/admin/Search/Search.vue'
import stockBatchReportService from '@/services/admin/stockBatchReport.service.js'
import userService from '@/services/admin/user.service.js'
import confirmDialogHelper from '@/helpers/admin/dialogs/confirm.helper.js'
import successDialogHelper from '@/helpers/admin/dialogs/success.helper.js'
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue'
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper.js';
import { FilterHelper } from '@/helpers/admin/filter/filter.helper.js';
import { StockBatchReportSortField, MeasurementUnit } from '@/enums/stockBatch.enum.js'
import { SortDirection } from '@/enums/sortDir.enum.js'
import Swal from 'sweetalert2';

export default {
  name: "StockBatchReport",
  components: {
    Search,
    Unauthorized,
  },
  data() {
    return {
      stockBatchReports: [],
      filter: {
        keyword: '',
        defaultUnit: null,
        minInitialQuantity: null,
        maxInitialQuantity: null,
        minRemainingQuantity: null,
        maxRemainingQuantity: null,
        expirationDateFrom: null,
        expirationDateTo: null,
        receivedDateFrom: null,
        receivedDateTo: null,
        ingredientIds: [],
        supplierIds: [],
        minNumberOfItems: null,
        maxNumberOfItems: null,
        minPricePerItem: null,
        maxPricePerItem: null,
        minUnitValue: null,
        maxUnitValue: null,
        minSubtotal: null,
        maxSubtotal: null,
      },
      sortCriteria: [ { sortBy: '', sortDir: '' } ], // Dynamic Sort Criteria
      checkall: false,
      checkedItems: [],
      page: 1,
      totalPages: 0,
      isFetching: true,
      alert: false,
      sortFieldOptions: StockBatchReportSortField.toArray(),
      sortDirectionOptions: SortDirection.toArray(),
      defaultUnitOptions: MeasurementUnit.toArray(),
      ingredientOptions: [],
      supplierOptions: [],
      userOptions: [],
      viewDialog: false,
      reportDetail: {
        id: null,
        ingredientId: null,
        ingredientName: '',
        numberOfItems: null,
        pricePerItem: '',
        unitValue: '',
        defaultUnit: '',
        subtotal: '',
        initialQuantity: '',
        remainingQuantity: '',
        supplyOrderId: null,
        supplyOrderCode: '',
        supplyOrderDescription: '',
        receivedDate: '',
        expirationDate: '',
        supplierId: null,
        supplierName: '',
        createdBy: '',
        createdAt: '',
        updatedBy: '',
        updatedAt: '',
      },
      stockBatchTableHeaders: [
        { title: 'Ingredient Name', key: 'ingredientName' },
        { title: 'Number of Items', key: 'numberOfItems' },
        { title: 'Price per Item ($)', key: 'pricePerItem' },
        { title: 'Unit Value', key: 'unitValue' },
        { title: 'Subtotal ($)', key: 'subtotal' },
        { title: 'Order Code', key: 'supplyOrderCode' },
        { title: 'Order Status', key: 'orderStatus' },
        { title: 'Supplier Name', key: 'supplierName' },
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
      return PermissionHelper.hasPermission(permissionName);
    },

    /**
     * Fetches the list of stock batch reports with applied filters and sorting.
     */
    async getStockBatchReports() {
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

        const response = await stockBatchReportService.getAll({
          params: params
        })
        console.log(response)
        this.stockBatchReports = response.data.content
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

    /**
     * Fetches ingredients to populate the ingredients dropdown.
     */
    async fetchIngredients() {
      try {
        const filter = {
          params: {
            size: 100,
          }
        }
        const result = await stockBatchReportService.getIngredients(filter)
        console.log(result)
        this.ingredientOptions = result.data.content
      }
      catch(err) {
        console.log(err)
      }
    },

    /**
     * Fetches suppliers to populate the suppliers dropdown.
     */
    async fetchSuppliers() {
      try {
        const filter = {
          params: {
            size: 100,
          }
        }
        const result = await stockBatchReportService.getSuppliers(filter)
        console.log(result)
        this.supplierOptions = result.data.content
      }
      catch(err) {
        console.log(err)
      }
    },

    /**
     * Fetches users to populate the user IDs dropdown.
     */
    async fetchUsers() {
      try {
        const filter = {
          params: {
            size: 100,
          }
        }
        const result = await userService.getAll(filter)
        console.log(result)
        this.userOptions = result.data.content
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
      }

      if (this.sortCriteria[0].sortBy !== '') {
        query.sortBy = this.sortCriteria.map(c => c.sortBy).join(',')
      }

      if (this.sortCriteria[0].sortDir !== '') {
        query.sortDir = this.sortCriteria.map(c => c.sortDir).join(',')
      }

      this.$router.push({ query })
    },

    /**
     * Clears all filters and resets sort criteria.
     */
    handleClear() {
      this.filter = {
        keyword: '',
        defaultUnit: null,
        minInitialQuantity: null,
        maxInitialQuantity: null,
        minRemainingQuantity: null,
        maxRemainingQuantity: null,
        expirationDateFrom: null,
        expirationDateTo: null,
        receivedDateFrom: null,
        receivedDateTo: null,
        ingredientIds: [],
        supplierIds: [],
        minNumberOfItems: null,
        maxNumberOfItems: null,
        minPricePerItem: null,
        maxPricePerItem: null,
        minUnitValue: null,
        maxUnitValue: null,
        minSubtotal: null,
        maxSubtotal: null,
      }
      this.sortCriteria = [ { sortBy: '', sortDir: '' } ] // Reset sortCriteria
      this.getStockBatchReports()
    },

    /**
     * Handles the "Check All" functionality.
     */
    handleCheckAll() {  
      this.checkedItems = this.stockBatchReports.map(() => this.checkall)
    },

    /**
     * Deletes a stock batch report after confirmation.
     * @param {Number} id - The ID of the report to delete.
     */
    async handleDelete(id) {
      try{
        if (this.checkPermission('STOCK_BATCH_REPORT_DELETE')) {
          confirmDialogHelper().then(async (result) => {
            if (result.isConfirmed) {
              await stockBatchReportService.deleteOne(id)
              this.getStockBatchReports()
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
     * Fetches and displays stock batch report details in a dialog.
     * @param {Number} id - The ID of the report to view.
     */
    async viewReportDetail(id) {
      try {
        const res = await stockBatchReportService.getOne(id);
        console.log(res)
        this.reportDetail = { 
          id: res.data.id,
          ingredientId: res.data.ingredientId,
          ingredientName: res.data.ingredientName,
          numberOfItems: res.data.numberOfItems,
          pricePerItem: this.formatCurrency(res.data.pricePerItem),
          unitValue: `${res.data.unitValue} ${this.getMeasurementUnitLabel(res.data.defaultUnit)}`,
          defaultUnit: res.data.defaultUnit,
          subtotal: this.formatCurrency(res.data.subtotal),
          initialQuantity: res.data.initialQuantity,
          remainingQuantity: res.data.remainingQuantity,
          supplyOrderId: res.data.supplyOrderId,
          supplyOrderCode: res.data.supplyOrderCode,
          supplyOrderDescription: res.data.supplyOrderDescription,
          receivedDate: this.formatDateTime(res.data.receivedDate),
          expirationDate: this.formatDateTime(res.data.expirationDate),
          supplierId: res.data.supplierId,
          supplierName: res.data.supplierName,
          createdBy: res.data.createdBy,
          createdAt: this.formatDateTime(res.data.createdAt),
          updatedBy: res.data.updatedBy,
          updatedAt: this.formatDateTime(res.data.updatedAt),
        };
        this.viewDialog = true;
      } catch (error) {
        console.error("Error fetching report details:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch report details.',
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
     * Formats a datetime string.
     * @param {String} dateTimeStr - The datetime string to format.
     * @returns {String}
     */
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return '';
      const date = new Date(dateTimeStr);
      return date.toLocaleString();
    },

    /**
     * Gets the label for a given measurement unit.
     * @param {String} unit - The measurement unit value.
     * @returns {String}
     */
    getMeasurementUnitLabel(unit) {
      const found = this.defaultUnitOptions.find(u => u.value === unit);
      return found ? found.label : unit;
    },

    /**
     * Gets the label for a given order status.
     * @param {String} status - The order status value.
     * @returns {String}
     */
    getStatusLabel(status) {
      return StockBatchReportSortField.getStatusLabel(status);
    },

    /**
     * Gets the class for a given order status.
     * @param {String} status - The order status value.
     * @returns {String}
     */
    getStatusClass(status) {
      const config = StockBatchReportSortField.getStatusConfig(status);
      return `${config.color}`;
    },

    /**
     * Exports the report data based on current filters.
     */
    async exportReport() {
      try {
        loadingDialogHelper("Exporting Report...");
        const params = { ...this.filter };

        // Handle sorting
        if (this.sortCriteria.length > 0) {
          const sortBy = this.sortCriteria.map(c => c.sortBy).filter(Boolean).join(',');
          const sortDir = this.sortCriteria.map(c => c.sortDir).filter(Boolean).join(',');
          if (sortBy) params.sortBy = sortBy;
          if (sortDir) params.sortDir = sortDir;
        }

        // Fetch all data without pagination
        const exportParams = { ...params, page: 0, size: 10000 } // Adjust size as needed
        const response = await stockBatchReportService.getAll({ params: exportParams })
        const data = response.data.content

        // Convert data to CSV
        const csv = this.convertToCSV(data)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "stock_batch_report.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        Swal.close()
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Report exported successfully!',
          confirmButtonText: 'OK',
        })
      } catch (error) {
        console.error("Error exporting report:", error)
        Swal.close()
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to export report.',
          confirmButtonText: 'OK',
        });
      }
    },

    /**
     * Converts JSON data to CSV format.
     * @param {Array} data - The JSON data to convert.
     * @returns {String} - The CSV string.
     */
    convertToCSV(data) {
      if (!data || !data.length) {
        return '';
      }

      const headers = [
        'Ingredient Name',
        'Number of Items',
        'Price per Item ($)',
        'Unit Value',
        'Subtotal ($)',
        'Order Code',
        'Order Status',
        'Supplier Name',
        'Created By',
        'Created At',
        'Updated By',
        'Updated At'
      ];
      const csvRows = [
        headers.join(','), // header row first
        ...data.map(row => [
          `"${row.ingredientName || ''}"`,
          row.numberOfItems || '',
          row.pricePerItem != null ? this.formatCurrency(row.pricePerItem) : '',
          `"${row.unitValue ? `${row.unitValue} ${this.getMeasurementUnitLabel(row.defaultUnit)}` : ''}"`,
          row.subtotal != null ? this.formatCurrency(row.subtotal) : '',
          `"${row.supplyOrderCode || ''}"`,
          `"${this.getStatusLabel(row.orderStatus)}"`,
          `"${row.supplierName || ''}"`,
          `"${row.createdBy || ''}"`,
          `"${this.formatDateTime(row.createdAt)}"`,
          `"${row.updatedBy || ''}"`,
          `"${this.formatDateTime(row.updatedAt)}"`,
        ].join(',')) // data rows
      ];

      return csvRows.join('\n');
    },
  },
  mounted() {
    this.initFilterFromUrl()
    this.getStockBatchReports()
    this.fetchIngredients()
    this.fetchSuppliers()
    this.fetchUsers() 
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
      this.getStockBatchReports()
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
  .d-flex:not(.stock-batch-report-title, .card-header) {
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

  .stock-batch-report-action {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
