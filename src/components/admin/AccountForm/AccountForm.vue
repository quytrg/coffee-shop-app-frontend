<template>
  <div class="account-form fluid-container mx-5">
    <h4 class="page-title mt-4 mb-0 d-flex align-items-center">
      <h4 class="gray-text">Management</h4>
      <h5 class="mx-1">/</h5> 
      <h4 class="primary-text">{{ pageTitle }}</h4>
    </h4>
    <Form @submit="handleSubmit" :validation-schema="accountSchema">
      <div class="row">
        <div class="mb-3 d-flex justify-content-end">
          <button
            type="submit"
            class="btn btn-main"
          >
            {{ pageTitle.includes('Add') ? 'Create Account' : 'Update Account' }}
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-7">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Account Information</h5>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="fullName" class="form-label">Full Name (*)</label>
                  <Field
                    id="fullName"
                    name="fullName"
                    type="text"
                    class="form-control"
                    placeholder="Enter full name"
                    v-model="localAccount.fullName"
                  />
                  <ErrorMessage name="fullName" class="error-feedback text-warning" />
                </div>
                <div class="col-md-6">
                  <label for="phoneNumber" class="form-label">Phone Number (*)</label>
                  <Field
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    class="form-control"
                    placeholder="Enter phone number"
                    v-model="localAccount.phoneNumber"
                  />
                  <ErrorMessage name="phoneNumber" class="error-feedback text-warning" />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="email" class="form-label">Email (*)</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    class="form-control"
                    placeholder="Enter email"
                    v-model="localAccount.email"
                  />
                  <ErrorMessage name="email" class="error-feedback text-warning" />
                </div>
                <div class="col-md-6">
                  <label for="address" class="form-label">Address</label>
                  <Field
                    id="address"
                    name="address"
                    type="text"
                    class="form-control"
                    placeholder="Enter address"
                    v-model="localAccount.address"
                  />
                  <ErrorMessage name="address" class="error-feedback text-warning" />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="password" class="form-label">Password (*)</label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    class="form-control"
                    placeholder="Enter password"
                    v-model="localAccount.password"
                  />
                  <ErrorMessage name="password" class="error-feedback text-warning" />
                </div>
                <div class="col-md-6">
                  <label for="retypePassword" class="form-label">Retype Password (*)</label>
                  <Field
                    id="retypePassword"
                    name="retypePassword"
                    type="password"
                    class="form-control"
                    placeholder="Retype password"
                    v-model="localAccount.retypePassword"
                  />
                  <ErrorMessage name="retypePassword" class="error-feedback text-warning" />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="sex" class="form-label">Sex</label>
                  <v-select
                    :items="sexOptions"
                    label="Select Sex"
                    density="compact"
                    variant="outlined"
                    item-title="label"
                    item-value="value"
                    clearable
                    hide-details
                    v-model="localAccount.sex"
                  />
                  <ErrorMessage name="sex" class="error-feedback text-warning" />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="dateOfBirth" class="form-label">Date of Birth</label>
                  <v-date-input
                    clearable 
                    label="Date of birth" 
                    variant="solo" 
                    prepend-icon=""
                    prepend-inner-icon="$calendar"
                    :max="new Date()"
                    density="compact"
                    v-model="localAccount.dateOfBirth"
                    @update:model-value="handleDateChange"
                  >
                  </v-date-input>
                  <ErrorMessage name="dateOfBirth" class="error-feedback text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-5">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Organize</h5>
              <div class="mb-3">
                <label for="roleId" class="form-label">Role</label>
                <v-select
                  id="roleId"
                  :items="roles"
                  label="Select Role"
                  density="compact"
                  variant="outlined"
                  item-title="name"
                  item-value="id"
                  clearable
                  hide-details
                  v-model="localAccount.roleId"
                />
                <ErrorMessage name="roleId" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <v-select
                  :items="statusOptions"
                  label="Select Status"
                  density="compact"
                  variant="outlined"
                  item-title="label"
                  item-value="value"
                  clearable
                  hide-details
                  v-model="localAccount.status"
                />
                <ErrorMessage name="status" class="error-feedback text-warning" />
              </div>
            </div>
          </div>
          <!-- Media Section -->
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Media</h5>
              <div class="mb-3">
                <ImageUploadify v-model:images="localAccount.images" fname="file"/>
                <ErrorMessage name="images" class="error-feedback text-warning" />
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
import ImageUploadify from '@/components/admin/ImageUploadify/ImageUploadify.vue';
import { AccountStatus } from '@/enums/account.enum.js';
import { RoleStatus } from '@/enums/role.enum.js';
import roleService from '@/services/admin/role.service';

export default {
  name: "AccountForm",
  components: {
    Form,
    Field,
    ErrorMessage,
    ImageUploadify
  },
  emits: ["submit:account"],
  props: {
    account: {
      type: Object,
      default: () => ({})
    },
    pageTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    // Base schema without password fields
    const baseSchema = {
      fullName: yup
        .string()
        .required('Full name is required')
        .min(3, "Full name must be at least 3 characters")
        .max(200, "Full name can have a maximum of 200 characters."),
      phoneNumber: yup
        .string()
        .required('Phone number is required')
        .matches(/^\d{9,10}$/, "Phone number must be 9 to 10 digits"),
      email: yup
        .string()
        .required('Email is required')
        .email("Must be a valid email")
        .min(5, "Email must be at least 5 characters")
        .max(100, "Email can have a maximum of 100 characters."),
      address: yup
        .string()
        .max(200, "Address can have a maximum of 200 characters."),
      sex: yup
        .boolean(),
      dateOfBirth: yup
        .date()
        .nullable(),
      images: yup
        .array()
        .of(yup.object().required())
        .min(1, "At least one image is required")
    };

    // Add password fields only for create mode
    if (this.pageTitle.includes('Add')) {
      baseSchema.password = yup
        .string()
        .required('Password is required')
        .min(4, "Password must be at least 4 characters")
        .max(50, "Password can have a maximum of 50 characters.");
      
      baseSchema.retypePassword = yup
        .string()
        .required('Retype password is required')
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .min(4, "Retype password must be at least 4 characters")
        .max(50, "Retype password can have a maximum of 50 characters.");
    } else {
      // For update mode, make password fields optional
      baseSchema.password = yup
        .string()
        .min(4, "Password must be at least 4 characters")
        .max(50, "Password can have a maximum of 50 characters.")
        .nullable();
      
      baseSchema.retypePassword = yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .min(4, "Retype password must be at least 4 characters")
        .max(50, "Retype password can have a maximum of 50 characters.")
        .nullable()
        .when('password', {
          is: (password) => password && password.length > 0,
          then: (schema) => schema.required('Retype password is required when password is provided'),
          otherwise: (schema) => schema.nullable()
        });
    }

    const accountSchema = yup.object().shape(baseSchema).required();

    return {
      localAccount: { 
        ...this.account,
        roleId: this.account.role ? this.account.role.id : this.account.roleId,
        dateOfBirth: this.account.dateOfBirth ? new Date(this.account.dateOfBirth) : null,
      },
      accountSchema,
      statusOptions: AccountStatus.toArray(),
      sexOptions: [
        { label: 'Male', value: true },
        { label: 'Female', value: false },
      ],
      roles: [],
    }
  },
  methods: {
    async getAllRoles() {
      try {
        const response = await roleService.getAll({
          params: {
            size: 50,
            status: RoleStatus.ACTIVE
          }
        });
        this.roles = response.data.content;
      } catch (error) {
        console.error("Error fetching roles:", error);
        this.roles = [];
      }
    },
    handleSubmit() {
      // Map images to imageIds
      this.localAccount.imageIds = this.localAccount.images.map(image => image.id);
      // delete this.localAccount.images;

      this.$emit("submit:account", this.localAccount);
    },
    handleDateChange(newDate) {
      console.log(newDate)
      this.localAccount.dateOfBirth = newDate
    }
  },
  mounted() {
    this.getAllRoles();
  },
}
</script>

<style scoped lang="scss">
</style>
