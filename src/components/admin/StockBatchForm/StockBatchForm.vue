<template>
  <div class="stock-batch-form fluid-container mx-5">
    <h4 class="page-title mt-4 mb-0 d-flex align-items-center">
      <h4 class="gray-text">Management</h4>
      <h5 class="mx-1">/</h5> 
      <h4 class="primary-text">{{ pageTitle }}</h4>
    </h4>
    <Form @submit="handleSubmit" :validation-schema="stockBatchSchema">
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
      <!-- Form Title -->
      <div class="card mb-3 px-2">
        <div class="card-body">
          <h5 class="card-title">Stock Batch Information</h5>
          <div class="row">
            <!-- Ingredient -->
            <div class="col-md-6 col-sm-12 mb-3">
              <v-select
                :items="ingredientOptions"
                label="Ingredient"
                density="compact"
                variant="outlined"
                item-title="name"
                item-value="id"
                clearable
                v-model="localStockBatch.ingredientId"
                :rules="[v => !!v || 'Ingredient is required']"
                :readonly="true"
              />
              <ErrorMessage :name="'ingredientId'" class="error-feedback text-warning" />
            </div>

            <!-- Supplier -->
            <div class="col-md-6 col-sm-12 mb-3">
              <v-select
                :items="supplierOptions"
                label="Supplier"
                density="compact"
                variant="outlined"
                item-title="name"
                item-value="id"
                clearable
                v-model="localStockBatch.supplierId"
                :rules="[v => !!v || 'Supplier is required']"
                :readonly="true"
              />
              <ErrorMessage :name="'supplierId'" class="error-feedback text-warning" />
            </div>

            <!-- Number of Items -->
            <div class="col-md-6 col-sm-12 mb-3">
              <v-text-field
                type="number"
                label="Number of Items"
                density="compact"
                variant="outlined"
                v-model="localStockBatch.numberOfItems"
                :rules="[
                  v => v != null || 'Number of items is required',
                  v => v > 0 || 'Number of items must be greater than zero',
                ]"
                :readonly="true"
              />
              <ErrorMessage :name="'numberOfItems'" class="error-feedback text-warning" />
            </div>

            <!-- Price Per Item -->
            <div class="col-md-6 col-sm-12 mb-3">
              <v-text-field
                type="number"
                label="Price Per Item ($)"
                density="compact"
                variant="outlined"
                v-model="localStockBatch.pricePerItem"
                :rules="[
                  v => v != null || 'Price per item is required',
                  v => v >= 0 || 'Price must be non-negative',
                ]"
                :readonly="true"
              />
              <ErrorMessage :name="'pricePerItem'" class="error-feedback text-warning" />
            </div>

            <!-- Unit Value -->
            <div class="col-md-6 col-sm-12 mb-3">
              <v-text-field
                type="number"
                label="Unit Value"
                density="compact"
                variant="outlined"
                v-model="localStockBatch.unitValue"
                :rules="[
                  v => v != null || 'Unit value is required',
                  v => v >= 0 || 'Unit value must be non-negative',
                ]"
                :readonly="true"
              />
              <ErrorMessage :name="'unitValue'" class="error-feedback text-warning" />
            </div>

            <!-- Default Unit -->
            <div class="col-md-6 col-sm-12 mb-3">
              <v-select
                :items="measurementUnitOptions"
                label="Default Unit"
                density="compact"
                variant="outlined"
                item-title="label"
                item-value="value"
                clearable
                v-model="localStockBatch.defaultUnit"
                :rules="[v => !!v || 'Default unit is required']"
                :readonly="true"
              />
              <ErrorMessage :name="'defaultUnit'" class="error-feedback text-warning" />
            </div>

            <!-- Initial Quantity -->
            <div class="col-md-6 col-sm-12 mb-3">
              <v-text-field
                type="number"
                label="Initial Quantity"
                density="compact"
                variant="outlined"
                v-model="localStockBatch.initialQuantity"
                :rules="[
                  v => v != null || 'Initial quantity is required',
                  v => v >= 0 || 'Initial quantity must be non-negative',
                ]"
                :readonly="true"
              />
              <ErrorMessage :name="'initialQuantity'" class="error-feedback text-warning" />
            </div>

            <!-- Remaining Quantity -->
            <div class="col-md-6 col-sm-12 mb-3">
              <v-text-field
                type="number"
                label="Remaining Quantity"
                density="compact"
                variant="outlined"
                v-model="localStockBatch.remainingQuantity"
                :rules="[
                  v => v != null || 'Remaining quantity is required',
                  v => v >= 0 || 'Remaining quantity must be non-negative',
                ]"
                base-color="success"
              />
              <ErrorMessage :name="'remainingQuantity'" class="error-feedback text-warning" />
            </div>

            

            <!-- Received Date -->
            <div class="col-md-6 col-sm-12 mb-3">
              <v-date-input
                clearable 
                label="Received Date" 
                variant="solo" 
                prepend-icon=""
                prepend-inner-icon="$calendar"
                density="compact"
                v-model="localStockBatch.receivedDate"
                :rules="[v => !!v || 'Received date is required']"
                :readonly="true"
              />
              <ErrorMessage :name="'receivedDate'" class="error-feedback text-warning" />
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
                v-model="localStockBatch.expirationDate"
                :rules="[v => (v !== null || v >= new Date(localStockBatch.receivedDate)) || 'Expiration date must be after received date']"
                base-color="success"
                @update:model-value="handleExpirationDateDateChange"
              />
              <ErrorMessage :name="'expirationDate'" class="error-feedback text-warning" />
            </div>
            <!-- Supply Order Code -->
            <div class="col-md-6 col-sm-12 mb-3">
              <v-text-field
                label="Supply Order Code"
                density="compact"
                variant="outlined"
                v-model="localStockBatch.supplyOrderCode"
                :rules="[v => !!v || 'Supply order code is required']"
                :readonly="true"
              />
              <ErrorMessage :name="'supplyOrderCode'" class="error-feedback text-warning" />
            </div>
            <!-- Description -->
            <div class="col-12 mb-3">
              <v-textarea
                label="Description"
                row-height="20"
                rows="2"
                density="compact"
                variant="outlined"
                auto-grow
                v-model="localStockBatch.description"
                :rules="[v => !v || v.length <= 2000 || 'Description cannot exceed 2000 characters']"
                :readonly="true"
              ></v-textarea>
              <ErrorMessage :name="'description'" class="error-feedback text-warning" />
            </div>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import supplierService from '@/services/admin/supplier.service.js';
import ingredientService from '@/services/admin/ingredient.service.js';
import { MeasurementUnit } from '@/enums/measurementUnit.enum.js';

export default {
  name: "StockBatchForm",
  components: {
    Form,
    ErrorMessage,
  },
  props: {
    stockBatch: {
      type: Object,
      default: () => ({
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
        description: '',
      })
    },
    pageTitle: {
      type: String,
      default: 'Modify Stock Batch'
    }
  },
  data() {
    const stockBatchSchema = yup.object().shape({
      // id: yup.number().required(),
      // ingredientId: yup.number().required('Ingredient is required'),
      // supplierId: yup.number().required('Supplier is required'),
      // numberOfItems: yup
      //   .number()
      //   .required('Number of items is required')
      //   .min(1, 'Number of items must be at least 1'),
      // pricePerItem: yup
      //   .number()
      //   .required('Price per item is required')
      //   .min(0, 'Price must be non-negative'),
      // unitValue: yup
      //   .number()
      //   .required('Unit value is required')
      //   .min(0, 'Unit value must be non-negative'),
      // defaultUnit: yup
      //   .string()
      //   .required('Default unit is required'),
      // initialQuantity: yup
      //   .number()
      //   .required('Initial quantity is required')
      //   .min(0, 'Initial quantity must be non-negative'),
      // remainingQuantity: yup
      //   .number()
      //   .required('Remaining quantity is required')
      //   .min(0, 'Remaining quantity must be non-negative'),
      // supplyOrderCode: yup
      //   .string()
      //   .required('Supply order code is required'),
      // receivedDate: yup
      //   .date()
      //   .required('Received date is required'),
      // expirationDate: yup
      //   .date()
      //   .nullable()
      //   .min(
      //     yup.ref('receivedDate'),
      //     'Expiration date must be after received date'
      //   ),
      // description: yup
      //   .string()
      //   .max(2000, "Description cannot exceed 2000 characters."),
    });

    return {
      localStockBatch: { 
        ...this.stockBatch,
        expirationDate: this.stockBatch.expirationDate ? new Date(this.stockBatch.expirationDate) : null,
      },
      stockBatchSchema,
      measurementUnitOptions: MeasurementUnit.toArray(),
      supplierOptions: [], 
      ingredientOptions: [], 
      submitButtonText: this.pageTitle.includes('Modify') ? 'Update Stock Batch' : 'Create Stock Batch',
    };
  },
  methods: {
    /**
     * Fetches suppliers to populate the supplier dropdown.
     */
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

    /**
     * Fetches ingredients to populate the ingredient dropdown.
     */
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
     * Handles form submission.
     */
    handleSubmit() {
      // preprocess expirationDate
      const offset = this.localStockBatch.expirationDate.getTimezoneOffset();
      this.localStockBatch.expirationDate = new Date(this.localStockBatch.expirationDate.getTime() - (offset * 60000)).toISOString().slice(0, 19);
      
      this.$emit("submit:stockBatch", this.localStockBatch);
    },

    handleExpirationDateDateChange(newDate) {
      console.log(newDate)
      this.localStockBatch.expirationDate = newDate
    }
  },
  mounted() {
    this.fetchSuppliers();
    this.fetchIngredients();
  },
};
</script>

<style scoped lang="scss">
@media (max-width: 767.98px) {
  .v-row {
    flex-direction: column;
  }
}
</style>
