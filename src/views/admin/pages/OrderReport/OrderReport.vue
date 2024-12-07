<template>
  <div class="order-report fluid-container mx-5" v-if="checkPermission('ORDER_REPORT_VIEW')">
    <div class="order-report-wrapper position-relative" v-if="!isFetching">
      <!-- Title -->
      <div class="order-report-title my-4 d-flex align-items-center">
        <h4 class="gray-text">Management</h4>
        <h5 class="mx-1">/</h5> 
        <h4 class="primary-text">Order Reports</h4>
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
                placeholder="Search by Product Name, Description, or Order Code..."
              />
            </div>
            <div class="col-lg-6 col-md-12 mb-md-2 mb-lg-0">
              <v-select
                :items="statusOptions"
                label="Order Status"
                density="compact"
                variant="outlined"
                item-title="label"
                item-value="value"
                hide-details
                clearable
                v-model="filter.orderStatus"
              />
            </div>
          </div>
          <!-- Advanced Filters -->
          <v-expansion-panels class="mb-5">
            <v-expansion-panel title="Advanced Filters">
              <v-expansion-panel-text>
                <div class="row">
                  <!-- Product Variants -->
                  <!-- <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="productVariantOptions"
                      label="Product Variants"
                      density="compact"
                      variant="outlined"
                      item-title="name"
                      item-value="id"
                      multiple
                      chips
                      clearable
                      v-model="filter.productVariantIds"
                    />
                  </div> -->
                  <!-- Products -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="productOptions"
                      label="Products"
                      density="compact"
                      variant="outlined"
                      item-title="name"
                      item-value="id"
                      multiple
                      chips
                      clearable
                      v-model="filter.productIds"
                    />
                  </div>
                  <!-- Product Variant Size -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="productSizeOptions"
                      label="Product Size"
                      density="compact"
                      variant="outlined"
                      item-title="label"
                      item-value="value"
                      clearable
                      v-model="filter.productVariantSize"
                    />
                  </div>
                  <!-- Price Range -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Price ($)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.minPrice"
                      :rules="[value => value == null || value >= 0 || 'Price must be non-negative']"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Max Price ($)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.maxPrice"
                      :rules="[value => value == null || value >= 0 || 'Price must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Quantity Range -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Quantity"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.minQuantity"
                      :rules="[value => value == null || value >= 0 || 'Quantity must be non-negative']"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Max Quantity"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.maxQuantity"
                      :rules="[value => value == null || value >= 0 || 'Quantity must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Discount Range -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Discount (%)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.minDiscount"
                      :rules="[value => value == null || (value >= 0 && value <= 100) || 'Discount must be between 0 and 100']"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Max Discount (%)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      v-model="filter.maxDiscount"
                      :rules="[value => value == null || (value >= 0 && value <= 100) || 'Discount must be between 0 and 100']"
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
                  <!-- Order IDs -->
                  <!-- <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="orderOptions"
                      label="Order IDs"
                      density="compact"
                      variant="outlined"
                      item-title="orderCode"
                      item-value="id"
                      multiple
                      chips
                      clearable
                      v-model="filter.orderIds"
                    />
                  </div> -->
                  <!-- Order Codes -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="orderCodeOptions"
                      label="Order Codes"
                      density="compact"
                      variant="outlined"
                      item-title="orderCode"
                      item-value="orderCode"
                      multiple
                      chips
                      clearable
                      v-model="filter.orderCodes"
                    />
                  </div>
                  <div class="col-lg-4 mb-md-2 mb-lg-0"></div>
                  <!-- Created At Range -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Created At From" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.createdAtFrom"
                      type="datetime"
                    />
                  </div>
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Created At To" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.createdAtTo"
                      type="datetime"
                    />
                  </div>
                  <!-- Updated At Range -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Updated At From" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.updatedAtFrom"
                      type="datetime"
                    />
                  </div>
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Updated At To" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.updatedAtTo"
                      type="datetime"
                    />
                  </div>
                  <!-- Created By IDs -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="userOptions"
                      label="Created By Users"
                      density="compact"
                      variant="outlined"
                      :item-title="customUserTitle"
                      item-value="id"
                      multiple
                      chips
                      clearable
                      v-model="filter.createdByIds"
                    />
                  </div>
                  <!-- Updated By IDs -->
                  <div class="col-lg-6 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="userOptions"
                      label="Updated By Users"
                      density="compact"
                      variant="outlined"
                      :item-title="customUserTitle"
                      item-value="id"
                      multiple
                      chips
                      clearable
                      v-model="filter.updatedByIds"
                    />
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

          <!-- Apply Filters and Export Buttons -->
          <div class="row mb-3">
            <div class="col-12 d-flex justify-content-end gap-2">
              <button @click="exportReport" class="btn btn-secondary">
                <i class="fa-solid fa-file-export"></i> Export
              </button>
              <button @click="getOrderItemReports" class="btn btn-success">
                <i class="fa-solid fa-filter"></i> Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Report List -->
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <h5 class="my-2 d-flex align-items-center">Order Report</h5>
        </div>
        <div class="card-body">
          <div class="order-report-action d-flex justify-content-between mb-3">
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
                <th>Product Name</th>
                <th>Size</th>
                <th>Description</th>
                <th>Price ($)</th>
                <th>Quantity</th>
                <th>Discount (%)</th>
                <th>Subtotal ($)</th>
                <th>Order Code</th>
                <th>Order Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="orderItemReports.length">
              <tr v-for="(report, index) in orderItemReports" :key="report.id">
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
                <td>{{ report.productName }}</td>
                <td>{{ getProductSizeLabel(report.productVariantSize) }}</td>
                <td>{{ report.description }}</td>
                <td>{{ formatCurrency(report.price) }}</td>
                <td>{{ report.quantity }}</td>
                <td>{{ report.discount }}</td>
                <td>{{ formatCurrency(report.subtotal) }}</td>
                <td>{{ report.orderCode }}</td>
                <td>
                  <v-chip :color="getStatusClass(report.orderStatus)">
                    {{ getStatusLabel(report.orderStatus) }}
                  </v-chip>
                </td>
                <td>
                  <div class="d-flex icon">
                    <!-- View Report Details -->
                    <div
                      class="cursor-pointer me-2"
                      @click="viewReportDetail(index)"
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
                <td colspan="12">
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
                title="Order Report Details"
              >
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Product Name"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.productName"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Size"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.productVariantSize"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Description"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.description"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Price ($)"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.price"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Quantity"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.quantity"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Discount (%)"
                        density="compact"
                        variant="outlined"
                        v-model="reportDetail.discount"
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
                        v-model="reportDetail.orderCode"
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
      
    </div>
    <!-- Skeleton Loaders while fetching data -->
    <div class="order-report-wrapper" v-else>
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
                    type="table-row-divider@12"
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
  <div class="order-report fluid-container mx-5" v-else>
    <Unauthorized />
  </div>
</template>

  <script>
  import Search from '@/components/admin/Search/Search.vue'
  import orderService from '@/services/admin/order.service.js'
  import accountService from '@/services/admin/account.service.js'
  import productService from '@/services/admin/product.service.js'
  import confirmDialogHelper from '@/helpers/admin/dialogs/confirm.helper.js'
  import successDialogHelper from '@/helpers/admin/dialogs/success.helper.js'
  import loadingDialogHelper from '@/helpers/admin/dialogs/loading.helper.js';
  import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue'
  import { PermissionHelper } from '@/helpers/admin/auth/permission.helper.js';
  import { FilterHelper } from '@/helpers/admin/filter/filter.helper.js';
  import { OrderReportSortField, OrderStatus } from '@/enums/order.enum.js'
  import { PaymentMethod } from '@/enums/payment.enum.js'
  import { ProductSize } from '@/enums/product.enum.js'
  import { SortDirection } from '@/enums/sortDir.enum.js'
  import Swal from 'sweetalert2';

  export default {
    name: "OrderReport",
    components: {
      Search,
      Unauthorized,
    },
    data() {
      return {
        orderItemReports: [],
        filter: {
          keyword: '',
          productVariantIds: [],
          productIds: [],
          productVariantSize: null,
          minPrice: null,
          maxPrice: null,
          minQuantity: null,
          maxQuantity: null,
          minDiscount: null,
          maxDiscount: null,
          minSubtotal: null,
          maxSubtotal: null,
          orderIds: [],
          orderCodes: [],
          orderStatus: null,
          createdAtFrom: null,
          createdAtTo: null,
          updatedAtFrom: null,
          updatedAtTo: null,
          createdByIds: [],
          updatedByIds: [],
        },
        sortCriteria: [ { sortBy: '', sortDir: '' } ], // Dynamic Sort Criteria
        checkall: false,
        checkedItems: [],
        page: 1,
        totalPages: 0,
        isFetching: true,
        alert: false,
        sortFieldOptions: OrderReportSortField.toArray(),
        sortDirectionOptions: SortDirection.toArray(),
        statusOptions: OrderStatus.toArray(),
        paymentMethodOptions: PaymentMethod.toArray(),
        productSizeOptions: ProductSize.toArray(),
        productVariantOptions: [],
        productOptions: [],
        orderOptions: [],
        orderCodeOptions: [],
        userOptions: [],
        viewDialog: false,
        reportDetail: {
          id: null,
          productVariantId: null,
          productId: null,
          productName: '',
          productVariantSize: '',
          description: '',
          price: '',
          quantity: null,
          discount: null,
          subtotal: '',
          orderId: null,
          orderCode: '',
          orderStatus: '',
          createdBy: '',
          createdAt: '',
          updatedBy: '',
          updatedAt: '',
        },
        orderItemTableHeaders: [
          { title: 'Product Name', key: 'productName' },
          { title: 'Size', key: 'productVariantSize' },
          { title: 'Description', key: 'description' },
          { title: 'Price ($)', key: 'price' },
          { title: 'Quantity', key: 'quantity' },
          { title: 'Discount (%)', key: 'discount' },
          { title: 'Subtotal ($)', key: 'subtotal' },
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
       * Fetches the list of order item reports with applied filters and sorting.
       */
      async getOrderItemReports() {
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

          const response = await orderService.getOrderItemReports({
            params: params
          })
          console.log(response)
          this.orderItemReports = response.data.content
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
       * Fetches product variants to populate the dropdown.
       */
      // async fetchProductVariants() {
      //   try {
      //     const filter = {
      //       params: {
      //         size: 100,
      //       }
      //     }
      //     const result = await orderItemReportService.getProductVariants(filter)
      //     console.log(result)
      //     this.productVariantOptions = result.data.content
      //   }
      //   catch(err) {
      //     console.log(err)
      //   }
      // },

      /**
       * Fetches products to populate the dropdown.
       */
      async fetchProducts() {
        try {
          const filter = {
            params: {
              size: 100,
            }
          }
          const result = await productService.get(filter)
          console.log(result)
          this.productOptions = result.data.content
        }
        catch(err) {
          console.log(err)
        }
      },

      /**
       * Fetches orders to populate order IDs and order codes dropdowns.
       */
      async fetchOrders() {
        try {
          const filter = {
            params: {
              size: 100,
            }
          }
          const result = await orderService.getAll(filter)
          console.log(result)
          this.orderOptions = result.data.content
          this.orderCodeOptions = result.data.content.map(order => ({ orderCode: order.orderCode, id: order.id }))
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
          const result = await accountService.getAll(filter)
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
          productVariantIds: [],
          productIds: [],
          productVariantSize: null,
          minPrice: null,
          maxPrice: null,
          minQuantity: null,
          maxQuantity: null,
          minDiscount: null,
          maxDiscount: null,
          minSubtotal: null,
          maxSubtotal: null,
          orderIds: [],
          orderCodes: [],
          orderStatus: null,
          createdAtFrom: null,
          createdAtTo: null,
          updatedAtFrom: null,
          updatedAtTo: null,
          createdByIds: [],
          updatedByIds: [],
        }
        this.sortCriteria = [ { sortBy: '', sortDir: '' } ] // Reset sortCriteria
        this.getOrderItemReports()
      },

      /**
       * Handles the "Check All" functionality.
       */
      handleCheckAll() {  
        this.checkedItems = this.orderItemReports.map(() => this.checkall)
      },

      /**
       * Deletes an order item report after confirmation.
       * @param {Number} id - The ID of the report to delete.
       */
      // async handleDelete(id) {
      //   try{
      //     if (this.checkPermission('ORDER_REPORT_DELETE')) {
      //       confirmDialogHelper().then(async (result) => {
      //         if (result.isConfirmed) {
      //           await orderItemReportService.deleteOne(id)
      //           this.getOrderItemReports()
      //           successDialogHelper()
      //         }
      //       });
      //     }
      //     else {
      //       this.alert = true
      //       setTimeout(() => {
      //         this.alert = false
      //       }, 1200)
      //     }
      //   }
      //   catch (err) {
      //     console.log(err)
      //   }
      // },

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

        // restore createdAtFrom
        const createdAtFromParams = searchParams.get('createdAtFrom')
        if (createdAtFromParams) {
          this.filter.createdAtFrom = new Date(createdAtFromParams)
        } 
        // restore createdAtTo
        const createdAtToParams = searchParams.get('createdAtTo')
        if (createdAtToParams) {
          this.filter.createdAtTo = new Date(createdAtToParams)
        }
        // restore updatedAtFrom
        const updatedAtFromParams = searchParams.get('updatedAtFrom')
        if (updatedAtFromParams) {
          this.filter.updatedAtFrom = new Date(updatedAtFromParams)
        }
        // restore updatedAtTo
        const updatedAtToParams = searchParams.get('updatedAtTo')
        if (updatedAtToParams) {
          this.filter.updatedAtTo = new Date(updatedAtToParams)
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
       * Fetches and displays order item report details in a dialog.
       * @param {Number} id - The ID of the report to view.
       */
      async viewReportDetail(index) {
        try {
          // const res = await orderItemReportService.getOne(id);
          // console.log(res)
          console.log(this.orderItemReports)
          this.reportDetail = { 
            id: this.orderItemReports[index].id,
            productVariantId: this.orderItemReports[index].productVariantId,
            productId: this.orderItemReports[index].productId,
            productName: this.orderItemReports[index].productName,
            productVariantSize: this.getProductSizeLabel(this.orderItemReports[index].productVariantSize),
            description: this.orderItemReports[index].description,
            price: this.formatCurrency(this.orderItemReports[index].price),
            quantity: this.orderItemReports[index].quantity,
            discount: this.orderItemReports[index].discount,
            subtotal: this.formatCurrency(this.orderItemReports[index].subtotal),
            orderId: this.orderItemReports[index].orderId,
            orderCode: this.orderItemReports[index].orderCode,
            orderStatus: this.getStatusLabel(this.orderItemReports[index].orderStatus),
            createdBy: this.orderItemReports[index].createdBy,
            createdAt: this.formatDateTime(this.orderItemReports[index].createdAt),
            updatedBy: this.orderItemReports[index].updatedBy,
            updatedAt: this.formatDateTime(this.orderItemReports[index].updatedAt),
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
       * Gets the label for a given product size.
       * @param {String} size - The product size value.
       * @returns {String}
       */
      getProductSizeLabel(size) {
        const found = this.productSizeOptions.find(s => s.value === size);
        return found ? found.label : size;
      },

      /**
       * Gets the label for a given order status.
       * @param {String} status - The order status value.
       * @returns {String}
       */
      getStatusLabel(status) {
        return OrderStatus.getLabel(status);
      },

      /**
       * Gets the class for a given order status.
       * @param {String} status - The order status value.
       * @returns {String}
       */
      getStatusClass(status) {
        const config = OrderStatus.getConfig(status);
        return `${config.color}`;
      },

      /**
       * Exports the report data based on current filters.
       */
      async exportReport() {
        try {
          loadingDialogHelper("Exporting Report...");
          const processedFilter = FilterHelper.processFilter(this.filter);
          const params = { ...processedFilter };

          // Handle sorting
          if (this.sortCriteria.length > 0) {
            const sortBy = this.sortCriteria.map(c => c.sortBy).filter(Boolean).join(',');
            const sortDir = this.sortCriteria.map(c => c.sortDir).filter(Boolean).join(',');
            if (sortBy) params.sortBy = sortBy;
            if (sortDir) params.sortDir = sortDir;
          }
          console.log(params)
          // Fetch all data without pagination
          const exportParams = { ...params, page: 0, size: 10000 } 
          const response = await orderService.getOrderItemReports({ params: exportParams })
          const data = response.data.content

          // Convert data to CSV
          const csv = this.convertToCSV(data)
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.setAttribute("href", url)
          link.setAttribute("download", "order_report.csv")
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

        const headers = Object.keys(data[0]);
        const csvRows = [
          headers.join(','), // header row first
          ...data.map(row => headers.map(field => `"${row[field] || ''}"`).join(',')) // data rows
        ];

        return csvRows.join('\n');
      },

      customUserTitle(item) {
        return `${item.fullName} - ${item.phoneNumber}`;
      }
    },
    mounted() {
      this.initFilterFromUrl()
      this.getOrderItemReports()
      // this.fetchProductVariants()
      this.fetchProducts()
      this.fetchOrders()
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
        this.getOrderItemReports()
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
    .d-flex:not(.order-report-title, .card-header) {
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

    .order-report-action {
      flex-direction: column;
      gap: 10px;
    }
  }
  </style>
