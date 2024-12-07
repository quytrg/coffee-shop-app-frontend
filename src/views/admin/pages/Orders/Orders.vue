<template>
  <div class="orders fluid-container mx-5" v-if="checkPermission('ORDER_VIEW')">
    <div class="orders-wrapper position-relative" v-if="!isFetching">
      <!-- Title -->
      <div class="orders-title my-4 d-flex align-items-center">
        <h4 class="gray-text">Management</h4>
        <h5 class="mx-1">/</h5> 
        <h4 class="primary-text">Orders</h4>
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
                placeholder="Search by Order Code or Customer Name..."
              />
            </div>
            <div class="col-lg-6 col-md-12 mb-md-2 mb-lg-0">
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
          </div>
          <!-- Expanded Filters -->
          <v-expansion-panels class="mb-5">
            <v-expansion-panel title="Advanced Filters">
              <v-expansion-panel-text>
                <div class="row">
                  <!-- Min Total Amount -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Total Amount ($)"
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
                      label="Max Total Amount ($)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.maxTotalAmount"
                      :rules="[value => value == null || value >= 0 || 'Total amount must be non-negative']"
                    ></v-text-field>
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
                  <!-- Min Received Amount -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Received Amount ($)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.minReceivedAmount"
                      :rules="[value => value == null || value >= 0 || 'Received amount must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Max Received Amount -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Max Received Amount ($)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.maxReceivedAmount"
                      :rules="[value => value == null || value >= 0 || 'Received amount must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- User IDs -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-select
                      :items="userOptions"
                      label="Users"
                      density="compact"
                      variant="outlined"
                      :item-title="customUserTitle"
                      item-value="id"
                      multiple
                      chips
                      clearable
                      v-model="filter.userIds"
                    />
                  </div>
                  <!-- Min Return Amount -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Min Return Amount ($)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.minReturnAmount"
                      :rules="[value => value == null || value >= 0 || 'Return amount must be non-negative']"
                    ></v-text-field>
                  </div>
                  <!-- Max Return Amount -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-text-field
                      label="Max Return Amount ($)"
                      density="compact"
                      variant="outlined"
                      type="number"
                      prefix="$"
                      v-model="filter.maxReturnAmount"
                      :rules="[value => value == null || value >= 0 || 'Return amount must be non-negative']"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-4 mb-md-2 mb-lg-0"></div>
                  <!-- Created At From -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Created At From" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.createdAtFrom"
                    />
                  </div>
                  <!-- Created At To -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Created At To" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.createdAtTo"
                    />
                  </div>
                  <div class="col-lg-4 mb-md-2 mb-lg-0"></div>
                  <!-- Updated At From -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Updated At From" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.updatedAtFrom"
                    />
                  </div>
                  <!-- Updated At To -->
                  <div class="col-lg-4 col-md-6 mb-md-2 mb-lg-0">
                    <v-date-input
                      clearable 
                      label="Updated At To" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="filter.updatedAtTo"
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
              <button @click="getOrders" class="btn btn-success">
                <i class="fa-solid fa-filter"></i> Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <h5 class="my-2 d-flex align-items-center">Orders</h5>
        </div>
        <div class="card-body">
          <div class="orders-action d-flex justify-content-between mb-3">
            <div></div>
            <!-- <router-link :to="{ name: 'CreateOrder' }">
              <button class="btn btn-main btn-primary">+ New Order</button>
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
                <th>Order Code</th>
                <th>Customer Name</th>
                <th>Status</th>
                <th>Total Amount</th>
                <th>Payment Method</th>
                <th>Received Amount</th>
                <th>Return Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="orders.length">
              <tr v-for="(order, index) in orders" :key="order.id">
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
                <td>{{ order.customerName }}</td>
                <td>
                  <v-chip :color="getStatusClass(order.status)">
                    {{ getStatusLabel(order.status) }}
                  </v-chip>
                </td>
                <td>{{ formatCurrency(order.totalAmount) }}</td>
                <td>{{ getPaymentMethodLabel(order.paymentMethod) }}</td>
                <td>{{ formatCurrency(order.receivedAmount) }}</td>
                <td>{{ formatCurrency(order.returnAmount) }}</td>
                <td>
                  <div class="d-flex icon">
                    <!-- View Order Details -->
                    <div
                      class="cursor-pointer me-2"
                      @click="viewOrderDetail(order.id)"
                      title="View Order"
                    >
                      <i class="fa-regular fa-clipboard fa-lg fa-fw"></i>
                    </div>
                    
                    <!-- Edit Order -->
                    <!-- <router-link 
                      :to="{ name: 'ModifyOrder', params: { id: `${order.id}` } }"
                      class="d-flex align-items-center me-2"
                      title="Modify Order"
                    >
                      <i class="fa-regular fa-pen-to-square fa-lg fa-fw"></i>
                    </router-link> -->

                    <!-- Delete Order -->
                    <div
                      @click="handleDelete(order.id)"
                      class="cursor-pointer"
                      title="Delete Order"
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
          <!-- View Order Dialog -->
          <div class="me-2">
            <v-dialog
              v-model="viewDialog"
              max-width="860"
              transition="dialog-top-transition"
            >
              <v-card
                prepend-icon="mdi-information"
                title="Order Details"
              >
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Order Code"
                        density="compact"
                        variant="outlined"
                        v-model="orderDetail.orderCode"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Customer Name"
                        density="compact"
                        variant="outlined"
                        v-model="orderDetail.customerName"
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
                        v-model="orderDetail.status" 
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
                        v-model="orderDetail.paymentMethod" 
                        :readonly="true"
                      />
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Total Amount"
                        density="compact"
                        variant="outlined"
                        v-model="orderDetail.totalAmount"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Received Amount"
                        density="compact"
                        variant="outlined"
                        v-model="orderDetail.receivedAmount"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                      <v-text-field
                        label="Return Amount"
                        density="compact"
                        variant="outlined"
                        v-model="orderDetail.returnAmount"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-textarea
                        label="Description"
                        row-height="20"
                        rows="2"
                        density="compact"
                        variant="outlined"
                        auto-grow
                        v-model="orderDetail.description"
                        :readonly="true"
                      ></v-textarea>
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="Created By"
                        density="compact"
                        variant="outlined"
                        v-model="orderDetail.createdBy"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="Created At"
                        density="compact"
                        variant="outlined"
                        v-model="orderDetail.createdAt"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="Updated By"
                        density="compact"
                        variant="outlined"
                        v-model="orderDetail.updatedBy"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="Updated At"
                        density="compact"
                        variant="outlined"
                        v-model="orderDetail.updatedAt"
                        :readonly="true"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Order Items Table -->
                  <v-divider class="my-4"></v-divider>
                  <v-row>
                    <v-col cols="12">
                      <h5>Order Items</h5>
                      <v-data-table-virtual
                        :headers="orderItemTableHeaders"
                        :items="orderDetail.orderItems"
                      >
                      </v-data-table-virtual>
                    </v-col>
                  </v-row>
                  <h6 class="text-end mt-3 mb-0">Total: {{ orderDetail.totalAmount }}</h6>
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
    <div class="orders-wrapper" v-else>
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
  <div class="orders fluid-container mx-5" v-else>
    <Unauthorized />
  </div>
</template>

  <script>
  import Search from '@/components/admin/Search/Search.vue'
  import orderService from '@/services/admin/order.service.js'
  import accountService from '@/services/admin/account.service.js'
  import confirmDialogHelper from '@/helpers/admin/dialogs/confirm.helper.js'
  import successDialogHelper from '@/helpers/admin/dialogs/success.helper.js'
  import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue'
  import { PermissionHelper } from '@/helpers/admin/auth/permission.helper.js';
  import { FilterHelper } from '@/helpers/admin/filter/filter.helper.js';
  import { OrderSortField, OrderStatus } from '@/enums/order.enum.js'
  import { PaymentMethod } from '@/enums/payment.enum.js'
  import { SortDirection } from '@/enums/sortDir.enum.js'
  import Swal from 'sweetalert2';

  export default {
    name: "Orders",
    components: {
      Search,
      Unauthorized,
    },
    data() {
      return {
        orders: [],
        filter: {
          keyword: '',
          status: null,
          minTotalAmount: null,
          maxTotalAmount: null,
          paymentMethod: null,
          minReceivedAmount: null,
          maxReceivedAmount: null,
          minReturnAmount: null,
          maxReturnAmount: null,
          userIds: [],
          createdAtFrom: null,
          createdAtTo: null,
          updatedAtFrom: null,
          updatedAtTo: null,
        },
        sortCriteria: [ { sortBy: '', sortDir: '' } ], // Dynamic Sort Criteria
        checkall: false,
        checkedItems: [],
        page: 1,
        totalPages: 0,
        isFetching: true,
        alert: false,
        sortFieldOptions: OrderSortField.toArray(),
        sortDirectionOptions: SortDirection.toArray(),
        statusOptions: OrderStatus.toArray(),
        paymentMethodOptions: PaymentMethod.toArray(),
        userOptions: [],
        viewDialog: false,
        orderDetail: {
          id: null,
          orderCode: '',
          customerName: '',
          description: '',
          totalAmount: '',
          paymentMethod: '',
          status: '',
          receivedAmount: '',
          returnAmount: '',
          orderItems: [],
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
       * Fetches the list of orders with applied filters and sorting.
       */
      async getOrders() {
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
          const response = await orderService.getAll({
            params: params
          })
          console.log(response)
          this.orders = response.data.content
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
       * Fetches users to populate the user IDs dropdown.
       */
      async fetchUsers() {
        try {
          const filter = {
            params: {
              size: 50,
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
          status: null,
          minTotalAmount: null,
          maxTotalAmount: null,
          paymentMethod: null,
          minReceivedAmount: null,
          maxReceivedAmount: null,
          minReturnAmount: null,
          maxReturnAmount: null,
          userIds: [],
          createdAtFrom: null,
          createdAtTo: null,
          updatedAtFrom: null,
          updatedAtTo: null,
        }
        this.sortCriteria = [ { sortBy: '', sortDir: '' } ] // Reset sortCriteria
        this.getOrders()
      },

      /**
       * Handles the "Check All" functionality.
       */
      handleCheckAll() {  
        this.checkedItems = this.orders.map(() => this.checkall)
      },

      /**
       * Deletes an order after confirmation.
       * @param {Number} id - The ID of the order to delete.
       */
      async handleDelete(id) {
        try{
          if (this.checkPermission('ORDER_DELETE')) {
            confirmDialogHelper().then(async (result) => {
              if (result.isConfirmed) {
                await orderService.deleteOne(id)
                this.getOrders()
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
       * Fetches and displays order details in a dialog.
       * @param {Number} id - The ID of the order to view.
       */
      async viewOrderDetail(id) {
        try {
          const res = await orderService.getOne(id);
          console.log(res)
          this.orderDetail = { 
            id: res.data.id,
            orderCode: res.data.orderCode,
            customerName: res.data.customerName,
            description: res.data.description,
            totalAmount: this.formatCurrency(res.data.totalAmount),
            paymentMethod: this.getPaymentMethodLabel(res.data.paymentMethod),
            status: this.getStatusLabel(res.data.status),
            receivedAmount: this.formatCurrency(res.data.receivedAmount),
            returnAmount: this.formatCurrency(res.data.returnAmount),
            orderItems: res.data.orderItems,
            createdBy: res.data.createdBy,
            createdAt: this.formatDateTime(res.data.createdAt),
            updatedBy: res.data.updatedBy,
            updatedAt: this.formatDateTime(res.data.updatedAt),
          };
          this.viewDialog = true;
        } catch (error) {
          console.error("Error fetching order details:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch order details.',
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

      /**
       * Gets the label for a given payment method.
       * @param {String} paymentMethod - The payment method value.
       * @returns {String}
       */
      getPaymentMethodLabel(paymentMethod) {
        const method = this.paymentMethodOptions.find(pm => pm.value === paymentMethod);
        return method ? method.label : paymentMethod;
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
       * Gets the label for a given order status.
       * @param {String} status - The order status value.
       * @returns {String}
       */
      getStatusLabel(status) {
        return OrderStatus.getLabel(status);
      },
      customUserTitle(item) {
        return `${item.fullName} - ${item.phoneNumber}`;
      }
    },
    mounted() {
      this.initFilterFromUrl()
      this.getOrders()
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
        this.getOrders()
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
    .d-flex:not(.orders-title, .card-header) {
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

    .orders-action {
      flex-direction: column;
      gap: 10px;
    }
  }
  </style>
