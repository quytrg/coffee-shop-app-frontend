<template>
  <div class="supply-order-form fluid-container mx-5">
    <h4 class="page-title mt-4 mb-0 d-flex align-items-center">
      <h4 class="gray-text">Management</h4>
      <h5 class="mx-1">/</h5> 
      <h4 class="primary-text">{{ pageTitle }}</h4>
    </h4>
    <Form @submit="handleSubmit" :validation-schema="supplyOrderSchema">
      <div class="row">
        <div class="mb-3 d-flex justify-content-end">
          <button
            type="submit"
            class="btn btn-main"
          >
            {{ submitButtonText }}
          </button>
        </div>
      </div>
      <div class="row">
        <!-- Supply Order Information -->
        <div class="col-12">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Supply Order Information</h5>
              <div class="row">
                <!-- Supplier -->
                <div class="col-md-4 col-sm-12 mb-3">
                  <v-select
                    :items="supplierOptions"
                    label="Supplier"
                    density="compact"
                    variant="outlined"
                    item-title="name"
                    item-value="id"
                    clearable
                    v-model="localSupplyOrder.supplierId"
                    :rules="[v => !!v || 'Supplier ID is required']"
                  />
                </div>
                
                <!-- Payment Status -->
                <div class="col-md-4 col-sm-12 mb-3">
                  <v-select
                    :items="paymentStatusOptions"
                    label="Payment Status"
                    density="compact"
                    variant="outlined"
                    item-title="label"
                    item-value="value"
                    clearable
                    v-model="localSupplyOrder.paymentStatus"
                  />
                </div>
                <!-- Payment Method -->
                <div class="col-md-4 col-sm-12 mb-3">
                  <v-select
                    :items="paymentMethodOptions"
                    label="Payment Method"
                    density="compact"
                    variant="outlined"
                    item-title="label"
                    item-value="value"
                    clearable
                    v-model="localSupplyOrder.paymentMethod"
                  />
                </div>
                <!-- Description -->
                <div class="col-md-6 col-sm-12 mb-3">
                  <v-textarea
                    label="Description"
                    row-height="20"
                    rows="2"
                    density="compact"
                    variant="outlined"
                    auto-grow
                    v-model="localSupplyOrder.description"
                    :rules="[v => !v || v.length <= 2000 || 'Description cannot exceed 2000 characters']"
                  ></v-textarea>
                </div>
                
                <!-- Expected Delivery Date -->
                <div class="col-md-6 col-sm-12 mb-3">
                  <v-date-input
                    clearable 
                    label="Expected Delivery Date" 
                    variant="solo" 
                    prepend-icon=""
                    prepend-inner-icon="$calendar"
                    density="compact"
                    v-model="localSupplyOrder.expectedDeliveryDate"
                  >
                  </v-date-input>
                </div>
                <!-- Status -->
                <div class="col-md-4 col-sm-12 mb-3">
                  <v-select
                    :items="statusOptions"
                    label="Status"
                    density="compact"
                    variant="outlined"
                    item-title="label"
                    item-value="value"
                    clearable
                    v-model="localSupplyOrder.status"
                    :rules="[v => !!v || 'Supply order status is required']"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Supply Order Items -->
        <div class="col-12">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title d-flex justify-content-between align-items-center">
                Supply Order Items
                <button @click="addItem" class="btn btn-primary btn-sm">
                  <i class="fa-solid fa-plus"></i> Add Item
                </button>
              </h5>

              <div v-for="(item, index) in localSupplyOrder.supplyOrderItems" :key="index" class="supply-order-item mb-4 p-3 border rounded">
                <h5 class="mb-3">Item {{ index + 1 }}</h5>
                <div class="row">
                  <!-- Ingredient -->
                  <div class="col-md-4 col-sm-12 mb-3">
                    <v-select
                      :items="ingredientOptions"
                      label="Ingredient"
                      density="compact"
                      variant="outlined"
                      item-title="name"
                      item-value="id"
                      clearable
                      hide-details
                      v-model="item.ingredientId"
                      @update:modelValue="value => handleChangeIngredient(index, value)"
                      :rules="[v => !!v || 'Ingredient is required']"
                    />
                    <ErrorMessage :name="`supplyOrderItems.${index}.ingredientId`" class="error-feedback text-warning" />
                  </div>
                  <!-- Price -->
                  <div class="col-md-4 col-sm-12 mb-3">
                    <v-text-field
                      type="number"
                      label="Price"
                      density="compact"
                      variant="outlined"
                      v-model="item.price"
                      :rules="[
                        v => v != null || 'Price is required',
                        v => v >= 0 || 'Price must be non-negative',
                        v => v <= 999999999.99 || 'Price cannot exceed 999,999,999.99',
                      ]"
                    />
                    <ErrorMessage :name="`supplyOrderItems.${index}.price`" class="error-feedback text-warning" />
                  </div>
                  <!-- Quantity -->
                  <div class="col-md-4 col-sm-12 mb-3">
                    <v-text-field
                      type="number"
                      label="Quantity"
                      density="compact"
                      variant="outlined"
                      v-model="item.quantity"
                      :rules="[
                        v => v != null || 'Quantity is required',
                        v => v >= 0 || 'Quantity must be non-negative',
                      ]"
                    />
                    <ErrorMessage :name="`supplyOrderItems.${index}.quantity`" class="error-feedback text-warning" />
                  </div>
                  <!-- Discount -->
                  <div class="col-md-4 col-sm-12 mb-3">
                    <v-text-field
                      type="number"
                      label="Discount (%)"
                      density="compact"
                      variant="outlined"
                      v-model="item.discount"
                      :rules="[
                        v => v == null || v >= 0 || 'Discount must be non-negative',
                        v => v == null || v <= 100 || 'Discount cannot exceed 100%',
                      ]"
                    />
                    <ErrorMessage :name="`supplyOrderItems.${index}.discount`" class="error-feedback text-warning" />
                  </div>
                  <!-- Unit Value -->
                  <div class="col-md-4 col-sm-12 mb-3">
                    <v-text-field
                      type="number"
                      label="Unit Value"
                      density="compact"
                      variant="outlined"
                      v-model="item.unitValue"
                      :rules="[
                        v => v != null || 'Unit value is required',
                        v => v >= 0 || 'Unit value must be non-negative',
                      ]"
                    />
                    <ErrorMessage :name="`supplyOrderItems.${index}.unitValue`" class="error-feedback text-warning" />
                  </div>
                  <!-- Unit -->
                  <div class="col-md-4 col-sm-12 mb-3">
                    <v-select
                      :items="measurementUnitOptions"
                      label="Unit"
                      density="compact"
                      variant="outlined"
                      item-title="label"
                      item-value="value"
                      clearable
                      hide-details
                      v-model="item.unit"
                      :rules="[v => !!v || 'Unit is required']"
                      :readonly="true"
                    />
                    <ErrorMessage :name="`supplyOrderItems.${index}.unit`" class="error-feedback text-warning" />
                  </div>
                  <!-- Description -->
                  <div class="col-md-6 col-sm-12 mb-3">
                    <v-textarea
                      label="Description"
                      row-height="20"
                      rows="2"
                      density="compact"
                      variant="outlined"
                      auto-grow
                      v-model="item.description"
                      :rules="[v => !v || v.length <= 2000 || 'Description cannot exceed 2000 characters']"
                    ></v-textarea>
                    <ErrorMessage :name="`supplyOrderItems.${index}.description`" class="error-feedback text-warning" />
                  </div>
                  <!-- Expiration Date -->
                  <div class="col-md-6 col-sm-12 mb-3">
                    <v-date-input
                    clearable 
                      label="Expiration Date" 
                      variant="solo" 
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      density="compact"
                      v-model="item.expirationDate"
                    ></v-date-input>
                    <ErrorMessage :name="`supplyOrderItems.${index}.expirationDate`" class="error-feedback text-warning" />
                  </div>

                  <!-- Remove Item Button -->
                  <div class="col-12 d-flex justify-end">
                    <button 
                      @click.prevent="removeItem(index)" 
                      class="btn btn-danger btn-sm"
                      :disabled="localSupplyOrder.supplyOrderItems.length === 1"
                      title="Remove Item"
                    >
                      <i class="fa-solid fa-minus"></i> Remove Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { SupplyOrderStatus } from '@/enums/supplyOrder.enum.js';
import { MeasurementUnit } from '@/enums/measurementUnit.enum.js';
import { PaymentMethod, PaymentStatus } from '@/enums/payment.enum.js'
import supplierService from '@/services/admin/supplier.service.js'
import ingredientService from '@/services/admin/ingredient.service.js'
import { readonly } from "vue";

export default {
  name: "SupplyOrderForm",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: {
    supplyOrder: {
      type: Object,
      default: () => ({
        status: '',
        expectedDeliveryDate: null,
        paymentStatus: '',
        paymentMethod: '',
        description: '',
        supplierId: null,
        supplyOrderItems: [],
      })
    },
    pageTitle: {
      type: String,
      default: 'Create Supply Order'
    }
  },
  data() {
    const supplyOrderSchema = yup.object().shape({
      // status: yup
      //   .string()
      //   .required('Supply order status is required'),
      // expectedDeliveryDate: yup
      //   .date()
      //   .nullable(),
      // paymentStatus: yup
      //   .string(),
      // paymentMethod: yup
      //   .string(),
      // description: yup
      //   .string()
      //   .max(2000, "Description cannot exceed 2000 characters."),
      // supplierId: yup
      //   .number()
      //   .required('Supplier ID is required'),
      // supplyOrderItems: yup
      //   .array()
      //   .of(
      //     yup.object().shape({
      //       ingredientId: yup
      //         .number()
      //         .required('Ingredient ID is mandatory'),
      //       description: yup
      //         .string()
      //         .max(2000, "Description cannot exceed 2000 characters."),
      //       price: yup
      //         .number()
      //         .required('Price is mandatory')
      //         .min(0, 'Price must be non-negative')
      //         .max(999999999.99, 'Price cannot exceed 999,999,999.99'),
      //       quantity: yup
      //         .number()
      //         .required('Quantity is mandatory')
      //         .min(0, 'Quantity must be non-negative'),
      //       discount: yup
      //         .number()
      //         .min(0, 'Discount must be non-negative')
      //         .max(100, 'Discount cannot exceed 100%'),
      //       expirationDate: yup
      //         .date()
      //         .nullable(),
      //       unit: yup
      //         .string()
      //         .required('Unit is mandatory'),
      //       unitValue: yup
      //         .number()
      //         .required('Unit value is mandatory')
      //         .min(0, 'Unit value must be non-negative'),
      //     })
      //   )
      //   .min(1, 'Supply order items must contain at least one value')
      //   .required('Supply order items cannot be empty'),
    });

    return {
      localSupplyOrder: { 
        ...this.supplyOrder,
        supplyOrderItems: this.supplyOrder.supplyOrderItems.length > 0 ? 
          this.supplyOrder.supplyOrderItems.map(item => ({ ...item })) : 
          [{ 
            ingredientId: null,
            description: '',
            price: null,
            quantity: null,
            discount: null,
            expirationDate: null,
            unit: '',
            unitValue: null,
          }],
      },
      supplyOrderSchema,
      measurementUnitOptions: MeasurementUnit.toArray(),
      paymentStatusOptions: PaymentStatus.toArray(),
      paymentMethodOptions: PaymentMethod.toArray(),
      statusOptions: SupplyOrderStatus.toArray(),
      supplierOptions: [], 
      ingredientOptions: [], 
      submitButtonText: this.pageTitle.includes('Modify') ? 'Update Supply Order' : 'Publish Supply Order',
    };
  },
  methods: {
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
     * Handles the form submission.
     */
    handleSubmit() {
      console.log(this.localSupplyOrder)
      this.$emit("submit:supplyOrder", this.localSupplyOrder);
    },

    /**
     * Adds a new supply order item.
     */
    addItem() {
      this.localSupplyOrder.supplyOrderItems.push({ 
        ingredientId: null,
        description: '',
        price: null,
        quantity: null,
        discount: null,
        expirationDate: null,
        unit: '',
        unitValue: null,
      });
    },

    /**
     * Removes a supply order item at a specific index.
     * @param {Number} index - The index of the item to remove.
     */
    removeItem(index) {
      if (this.localSupplyOrder.supplyOrderItems.length > 1) {
        this.localSupplyOrder.supplyOrderItems.splice(index, 1);
      }
    },
    handleChangeIngredient(index, value) {
      const result = this.ingredientOptions.find(item => item.id === value);
      this.localSupplyOrder.supplyOrderItems[index].unit = result.defaultUnit
    },
  },
  mounted() {
    this.fetchSuppliers();
    this.fetchIngredients();
  },
};
</script>

<style scoped lang="scss">
</style>
