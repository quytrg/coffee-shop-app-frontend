<template>
  <div class="supplier-form fluid-container mx-5">
    <h4 class="page-title mt-4 mb-0 d-flex align-items-center">
      <h4 class="gray-text">Management</h4>
      <h5 class="mx-1">/</h5> 
      <h4 class="primary-text">{{ pageTitle }}</h4>
    </h4>
    <Form @submit="handleSubmit" :validation-schema="supplierSchema">
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
        <!-- Supplier Information -->
        <div class="col-7">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Supplier Information</h5>
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  class="form-control"
                  placeholder="Enter supplier name"
                  v-model="localSupplier.name"
                />
                <ErrorMessage name="name" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="address" class="form-label">Address</label>
                <Field
                  id="address"
                  name="address"
                  type="text"
                  class="form-control"
                  placeholder="Enter address"
                  v-model="localSupplier.address"
                />
                <ErrorMessage name="address" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="phoneNumber" class="form-label">Phone Number</label>
                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  class="form-control"
                  placeholder="Enter phone number"
                  v-model="localSupplier.phoneNumber"
                />
                <ErrorMessage name="phoneNumber" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  class="form-control"
                  placeholder="Enter email"
                  v-model="localSupplier.email"
                />
                <ErrorMessage name="email" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  name="description" 
                  id="description"  
                  class="form-control tiny-editor"
                  v-model="localSupplier.description"
                ></textarea>
                <ErrorMessage name="description" class="error-feedback text-warning" />
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="col-5">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Additional Information</h5>
              <div class="mb-3">
                <label for="otherContactInfo" class="form-label">Other Contact Info</label>
                <Field
                  id="otherContactInfo"
                  name="otherContactInfo"
                  type="text"
                  class="form-control"
                  placeholder="Enter other contact info"
                  v-model="localSupplier.otherContactInfo"
                />
                <ErrorMessage name="otherContactInfo" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="taxCode" class="form-label">Tax Code</label>
                <Field
                  id="taxCode"
                  name="taxCode"
                  type="text"
                  class="form-control"
                  placeholder="Enter tax code"
                  v-model="localSupplier.taxCode"
                />
                <ErrorMessage name="taxCode" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="bankAccount" class="form-label">Bank Account</label>
                <Field
                  id="bankAccount"
                  name="bankAccount"
                  type="text"
                  class="form-control"
                  placeholder="Enter bank account"
                  v-model="localSupplier.bankAccount"
                />
                <ErrorMessage name="bankAccount" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="paymentTerms" class="form-label">Payment Terms</label>
                <Field
                  id="paymentTerms"
                  name="paymentTerms"
                  type="text"
                  class="form-control"
                  placeholder="Enter payment terms"
                  v-model="localSupplier.paymentTerms"
                />
                <ErrorMessage name="paymentTerms" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="rating" class="form-label">Rating</label>
                <Field
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.01"
                  class="form-control"
                  placeholder="Enter rating (0-10)"
                  v-model="localSupplier.rating"
                />
                <ErrorMessage name="rating" class="error-feedback text-warning" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { MeasurementUnit } from '@/enums/measurementUnit.enum.js';

export default {
  name: "SupplierForm",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:supplier"],
  props: {
    supplier: {
      type: Object,
      default: () => ({
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
      })
    },
    pageTitle: {
      type: String,
      default: 'Create Supplier'
    }
  },
  data() {
    const supplierSchema = yup.object().shape({
      name: yup
        .string()
        .required('Supplier name is required')
        .min(5, "Name length must be between 5 and 200 characters")
        .max(200, "Name length must be between 5 and 200 characters."),
      description: yup
        .string()
        .max(2000, "Description cannot exceed 2000 characters."),
      address: yup
        .string()
        .required('Address cannot be blank')
        .min(4, "Address length must be between 4 and 2000 characters")
        .max(2000, "Address length must be between 4 and 2000 characters."),
      phoneNumber: yup
        .string()
        .required('Phone number cannot be blank')
        .max(10, "Phone number cannot exceed 10 characters"),
      email: yup
        .string()
        .email('Must be a valid email')
        .max(100, "Length of email cannot exceed 100 characters"),
      otherContactInfo: yup
        .string()
        .max(100, "Length of other contact info cannot exceed 100 characters"),
      taxCode: yup
        .string()
        .max(100, "Length of tax code cannot exceed 100 characters"),
      bankAccount: yup
        .string()
        .max(100, "Length of bank account cannot exceed 100 characters"),
      paymentTerms: yup
        .string()
        .max(100, "Length of payment terms cannot exceed 100 characters"),
      rating: yup
        .number()
        .positive('Rating must be a non-negative value')
        .max(10, "Rating cannot exceed 10.00")
        .nullable(),
    });

    return {
      localSupplier: { 
        ...this.supplier,
      },
      supplierSchema,
      unitOptions: MeasurementUnit.toArray(),
      submitButtonText: this.pageTitle.includes('Modify') ? 'Update Supplier' : 'Publish Supplier',
    };
  },
  methods: {
    /**
     * Handles the form submission.
     */
    handleSubmit() {
      // Get content from TinyMCE editors
      this.localSupplier.description = tinymce.get("description").getContent();
      
      // Emit the form data to the parent component
      this.$emit("submit:supplier", this.localSupplier);
    },
  },
  mounted() {
    tinymce.init({
      selector: "textarea.tiny-editor",
    });
  },
  beforeUnmount() {
    // Destroy TinyMCE instances to prevent memory leaks
    tinymce.remove();
  }
};
</script>

<style scoped lang="scss">
</style>
