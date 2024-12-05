<template>
  <div class="supply-orders fluid-container mx-5" v-if="checkPermission('SUPPLY_ORDER_VIEW')">
    <div class="supply-orders-wrapper position-relative" v-if="!isFetching">
      <!-- Title -->
      <div class="supply-orders-title my-4 d-flex align-items-center">
        <h4 class="gray-text">Management</h4>
        <h5 class="mx-1">/</h5> 
        <h4 class="primary-text">Supply Orders</h4>
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
                  <!-- Min Total Amount -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Total Amount"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.minTotalAmount"
                      :rules="[value => value == null || value >= 0 || 'Total amount must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Max Total Amount -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Max Total Amount"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.maxTotalAmount"
                      :rules="[value => value == null || value >= 0 || 'Total amount must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Status -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="statusOptions"
                      label="Status"
                      density="compact"
                      variant="outlined"
                      item-title="label"
                      item-value="value"
                      clearable
                      v-model="filter.status"
                    />
                  </div>
                  <!-- Payment Method -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="paymentMethodOptions"
                      label="Payment Method"
                      density="compact"
                      variant="outlined"
                      item-title="label"
                      item-value="value"
                      clearable
                      v-model="filter.paymentMethod"
                    />
                  </div>
                  <!-- Payment Status -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="paymentStatusOptions"
                      label="Payment Status"
                      density="compact"
                      variant="outlined"
                      item-title="label"
                      item-value="value"
                      clearable
                      v-model="filter.paymentStatus"
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
                  <!-- Expected Delivery Date From -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Expected Delivery Date From" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      :max="new Date()"
                      density="compact"
                      v-model="filter.expectedDeliveryDateFrom"
                    >
                    </v-date-input>
                  </div>
                  <!-- Expected Delivery Date To -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Expected Delivery Date To" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      :max="new Date()"
                      density="compact"
                      v-model="filter.expectedDeliveryDateTo"
                    >
                    </v-date-input>
                  </div>
                  <div class="col-lg-4 mb-md-2 mb-lg-0"></div>
                  <!-- Actual Delivery Date From -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Actual Delivery Date From" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      :max="new Date()"
                      density="compact"
                      v-model="filter.actualDeliveryDateFrom"
                    >
                    </v-date-input>
                  </div>
                  <!-- Actual Delivery Date To -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Actual Delivery Date To" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      :max="new Date()"
                      density="compact"
                      v-model="filter.actualDeliveryDateTo"
                    >
                    </v-date-input>
                  </div>
                  <div class="col-lg-4 mb-md-2 mb-lg-0"></div>
                  <!-- Ingredients -->
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
                      hide-details
                      v-model="filter.ingredientIds"
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

          <!-- Apply Filters Button -->
          <div class="row mb-3">
            <div class="col-12 text-end">
              <button @click="getSupplyOrders" class="btn btn-success">
                <i class="fa-solid fa-filter"></i> Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Supply Orders List -->
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <h5 class="my-2 d-flex align-items-center">Supply Orders</h5>
        </div>
        <div class="card-body">
          <div class="supply-orders-action d-flex justify-content-between mb-3">
            <div></div>
            <router-link :to="{ name: 'CreateSupplyOrder' }">
              <button class="btn btn-main btn-primary">+ New Supply Order</button>
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
                <th>Order Code</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Total Amount</th>
                <th>Expected Delivery</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="supplyOrders.length">
              <tr v-for="(order, index) in supplyOrders" :key="order.id">
                <td>
                  <input 
                    class="form-check-input" 
                    type="checkbox"
                    name="id"
                    :value="order.id"
                    v-model="checkedItems[index]"
                  >
                </td>
                <td>{{ (page - 1) * 10 + index + 1 }}</td>
                <td>{{ order.orderCode }}</td>
                <td>{{ order.supplierName }}</td>
                <td>
                  <v-chip :color="getStatusClass(order.status)">
                    {{ getStatusLabel(order.status) }}
                  </v-chip>
                </td>
                <td>{{ formatCurrency(order.totalAmount) }}</td>
                <td>{{ formatDate(order.expectedDeliveryDate) }}</td>
                <td>
                  <v-chip :color="getPaymentStatusClass(order.paymentStatus)" v-if="order.paymentStatus">
                    {{ getPaymentStatusLabel(order.paymentStatus) }}
                  </v-chip>
                </td>
                <td>
                  <div class="d-flex icon">
                    <!-- View Supply Order Details -->
                    <div
                      class="cursor-pointer me-2"
                      @click="viewSupplyOrderDetail(order.id)"
                      title="View Supply Order"
                    >
                      <i class="fa-regular fa-clipboard fa-lg fa-fw"></i>
                    </div>
                    
                    <!-- Edit Supply Order -->
                    <router-link 
                      :to="{ name: 'ModifySupplyOrder', params: { id: `${order.id}` } }"
                      class="d-flex align-items-center me-2"
                      title="Modify Supply Order"
                    >
                      <i class="fa-regular fa-pen-to-square fa-lg fa-fw"></i>
                    </router-link>
                    
                    <!-- Delete Supply Order -->
                    <div
                      @click="handleDelete(order.id)"
                      class="cursor-pointer"
                      title="Delete Supply Order"
                    >
                      <i class="fa-regular fa-trash-can fa-lg fa-fw"></i>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="9">
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
          <!-- View Supply Order Dialog -->
          <div class="me-2">
            <v-dialog
              v-model="viewDialog"
              max-width="860"
              transition="dialog-top-transition"
            >
              <v-card
                prepend-icon="mdi-information"
                title="Supply Order Details"
              >
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Order Code"
                        density="compact"
                        variant="outlined"
                        v-model="supplyOrderDetail.orderCode"
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
                        v-model="supplyOrderDetail.status" 
                        :readonly="true"
                      />
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-select
                        :items="paymentStatusOptions"
                        label="Payment Status"
                        density="compact"
                        variant="outlined"
                        item-title="label"
                        item-value="value"
                        v-model="supplyOrderDetail.paymentStatus" 
                        :readonly="true"
                      />
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-select
                        :items="paymentMethodOptions"
                        label="Payment Method"
                        density="compact"
                        variant="outlined"
                        item-title="label"
                        item-value="value"
                        v-model="supplyOrderDetail.paymentMethod" 
                        :readonly="true"
                      />
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Expected Delivery Date"
                        density="compact"
                        variant="outlined"
                        v-model="supplyOrderDetail.expectedDeliveryDate"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Actual Delivery Date"
                        density="compact"
                        variant="outlined"
                        v-model="supplyOrderDetail.actualDeliveryDate"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Total Amount"
                        density="compact"
                        variant="outlined"
                        v-model="supplyOrderDetail.totalAmount"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Created By"
                        density="compact"
                        variant="outlined"
                        v-model="supplyOrderDetail.createdBy"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Created At"
                        density="compact"
                        variant="outlined"
                        v-model="supplyOrderDetail.createdAt"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Updated By"
                        density="compact"
                        variant="outlined"
                        v-model="supplyOrderDetail.updatedBy"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Updated At"
                        density="compact"
                        variant="outlined"
                        v-model="supplyOrderDetail.updatedAt"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Supplier Name"
                        density="compact"
                        variant="outlined"
                        v-model="supplyOrderDetail.supplierName"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        label="Description"
                        row-height="20"
                        rows="2"
                        density="compact"
                        variant="outlined"
                        auto-grow
                        v-model="supplyOrderDetail.description"
                        :readonly="true"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <!-- Supply Order Items Table -->
                  <v-divider class="my-4"></v-divider>
                  <v-row>
                    <v-col cols="12">
                      <h5>Supply Order Items</h5>
                      <v-data-table-virtual
                        :headers="itemTableHeaders"
                        :items="supplyOrderDetail.supplyOrderItems"
                      >
                      </v-data-table-virtual>
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
    <div class="supply-orders-wrapper" v-else>
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
                <th colspan="9">
                  <v-skeleton-loader
                    class="my-0"
                    type="table-row"
                  ></v-skeleton-loader>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="9">
                  <v-skeleton-loader
                    class="my-0"
                    type="table-row-divider@9"
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
  <div class="supply-orders fluid-container mx-5" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import Search from '@/components/admin/Search/Search.vue'
import supplyOrderService from '@/services/admin/supplyOrder.service.js'
import supplierService from '@/services/admin/supplier.service.js'
import ingredientService from '@/services/admin/ingredient.service.js'
import confirmDialogHelper from '@/helpers/admin/dialogs/confirm.helper.js'
import successDialogHelper from '@/helpers/admin/dialogs/success.helper.js'
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue'
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper'
import { FilterHelper } from '@/helpers/admin/filter/filter.helper.js';
import { SupplyOrderSortField, SupplyOrderStatus } from '@/enums/supplyOrder.enum.js'
import { PaymentMethod, PaymentStatus } from '@/enums/payment.enum.js'
import { SortDirection } from '@/enums/sortDir.enum.js'

export default {
  name: "SupplyOrders",
  components: {
    Search,
    Unauthorized,
  },
  data() {
    return {
      supplyOrders: [],
      filter: {
        keyword: '',
        minTotalAmount: null,
        maxTotalAmount: null,
        status: null,
        paymentMethod: null,
        paymentStatus: null,
        expectedDeliveryDateFrom: null,
        expectedDeliveryDateTo: null,
        actualDeliveryDateFrom: null,
        actualDeliveryDateTo: null,
        supplierIds: [],
        ingredientIds: [], 
      },
      sortCriteria: [ { sortBy: '', sortDir: '' } ], // Use sortCriteria
      checkall: false,
      checkedItems: [],
      page: 1,
      totalPages: 0,
      isFetching: true,
      alert: false,
      sortFieldOptions: SupplyOrderSortField.toArray(),
      sortDirectionOptions: SortDirection.toArray(),
      statusOptions: SupplyOrderStatus.toArray(),
      paymentMethodOptions: PaymentMethod.toArray(),
      paymentStatusOptions: PaymentStatus.toArray(),
      viewDialog: false,
      supplyOrderDetail: {
        orderCode: '',
        status: '',
        paymentStatus: '',
        paymentMethod: '',
        expectedDeliveryDate: '',
        actualDeliveryDate: '',
        totalAmount: '',
        createdBy: '',
        createdAt: '',
        updatedBy: '',
        updatedAt: '',
        supplierName: '',
        description: '',
        supplyOrderItems: []
      },
      supplierOptions: [],
      ingredientOptions: [],
      itemTableHeaders: [
        { title: 'Ingredient Name', key: 'ingredientName' },
        { title: 'Price ($)', key: 'price' },
        { title: 'Quantity', key: 'quantity' },
        { title: 'Unit Value', key: 'unitValue' },
        { title: 'Unit', key: 'defaultUnit' },
        { title: 'Discount (%)', key: 'discount' },
        { title: 'Subtotal', key: 'subtotal' },
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
     * Fetches the list of supply orders with applied filters and sorting.
     */
    async getSupplyOrders() {
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
        const response = await supplyOrderService.getAll({
          params: params
        })
        console.log(response)
        this.supplyOrders = response.data.content
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
        minTotalAmount: null,
        maxTotalAmount: null,
        status: null,
        paymentMethod: null,
        paymentStatus: null,
        expectedDeliveryDateFrom: null,
        expectedDeliveryDateTo: null,
        actualDeliveryDateFrom: null,
        actualDeliveryDateTo: null,
        supplierIds: [],
        supplyOrderItems: [],
        ingredientIds: [], 
      }
      this.sortCriteria = [ { sortBy: '', sortDir: '' } ] // Reset sortCriteria
      this.getSupplyOrders()
    },

    /**
     * Handles the "Check All" functionality.
     */
    handleCheckAll() {  
      this.checkedItems = this.supplyOrders.map(() => this.checkall)
    },

    /**
     * Deletes a supply order after confirmation.
     * @param {Number} id - The ID of the supply order to delete.
     */
    async handleDelete(id) {
      try{
        if (this.checkPermission('SUPPLY_ORDER_DELETE')) {
          confirmDialogHelper().then(async (result) => {
            if (result.isConfirmed) {
              await supplyOrderService.deleteOne(id)
              this.getSupplyOrders()
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
     * Fetches and displays supply order details in a dialog.
     * @param {Number} id - The ID of the supply order to view.
     */
    async viewSupplyOrderDetail(id) {
      try {
        const res = await supplyOrderService.getOne(id);
        console.log(res)
        this.supplyOrderDetail = { 
          orderCode: res.data.orderCode,
          status: res.data.status,
          paymentStatus: res.data.paymentStatus,
          paymentMethod: res.data.paymentMethod,
          expectedDeliveryDate: this.formatDate(res.data.expectedDeliveryDate),
          actualDeliveryDate: this.formatDate(res.data.actualDeliveryDate),
          totalAmount: this.formatCurrency(res.data.totalAmount),
          createdBy: res.data.createdBy,
          createdAt: this.formatDateTime(res.data.createdAt),
          updatedBy: res.data.updatedBy,
          updatedAt: this.formatDateTime(res.data.updatedAt),
          supplierName: res.data.supplier.name,
          description: res.data.description,
          supplyOrderItems: res.data.supplyOrderItems
        };
        console.log(this.supplyOrderDetail)
        this.viewDialog = true;
      } catch (error) {
        console.error("Error fetching supply order details:", error);
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
    getStatusClass(status) {
      const config = SupplyOrderStatus.getConfig(status);
      return `${config.color}`;
    },
    getStatusLabel(status) {
      return SupplyOrderStatus.getLabel(status);
    },
    getPaymentMethodClass(status) {
      const config = PaymentMethod.getConfig(status);
      return `${config.color}`;
    },
    getPaymentMethodLabel(status) {
      return PaymentMethod.getLabel(status);
    },
    getPaymentStatusClass(status) {
      const config = PaymentStatus.getConfig(status);
      return `${config.color}`;
    },
    getPaymentStatusLabel(status) {
      return PaymentStatus.getLabel(status);
    },
  },
  mounted() {
    this.initFilterFromUrl()
    this.getSupplyOrders()
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
      this.getSupplyOrders()
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
  .d-flex:not(.supply-orders-title, .card-header) {
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

  .supply-orders-action {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
