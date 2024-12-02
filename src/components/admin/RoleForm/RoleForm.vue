<template>
  <div class="role-form fluid-container mx-5">
    <h4 class="page-title mt-4 mb-0 d-flex align-items-center">
      <h4 class="gray-text">Management</h4>
      <h5 class="mx-1">/</h5> 
      <h4 class="primary-text">{{ pageTitle }}</h4>
    </h4>
    <Form @submit="handleSubmit" :validation-schema="roleSchema">
      <!-- Submit Button -->
      <div class="row">
        <div class="mb-3 d-flex justify-content-end">
          <button
            type="submit"
            class="btn btn-main"
          >
            {{ pageTitle.includes('Create') ? 'Create Role' : 'Update Role' }}
          </button>
        </div>
      </div>
      
      <!-- Role Information and Permissions -->
      <div class="row">
        <!-- Left Column: Role Information -->
        <div class="col-7">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Role Information</h5>
              
              <!-- Role Name and Status -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="name" class="form-label">Role Name (*)</label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    class="form-control"
                    placeholder="Enter role name"
                    v-model="localRole.name"
                  />
                  <ErrorMessage name="name" class="error-feedback text-warning" />
                </div>
                <div class="col-md-6">
                  <label for="status" class="form-label">Status (*)</label>
                  <v-select
                    :items="statusOptions"
                    label="Select Status"
                    density="compact"
                    variant="outlined"
                    item-title="label"
                    item-value="value"
                    clearable
                    hide-details
                    v-model="localRole.status"
                  />
                  <ErrorMessage name="status" class="error-feedback text-warning" />
                </div>
              </div>
              
              <!-- Description -->
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  name="description" 
                  id="description"  
                  class="form-control tiny-editor"
                  v-model="localRole.description"
                >
                </textarea>
                <ErrorMessage name="description" class="error-feedback text-warning" />
              </div>
            </div>
          </div>
          

        </div>
        
        <!-- Right Column: Organize -->
        <div class="col-5">
          <!-- Permissions Section -->
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Permissions</h5>
              <div class="mb-3">
                <v-select
                  :items="permissions"
                  label="Select Permissions"
                  density="compact"
                  variant="outlined"
                  item-title="name"
                  item-value="id"
                  multiple
                  chips
                  clearable
                  hide-details
                  v-model="localRole.permissionIds"
                />
                <ErrorMessage name="permissions" class="error-feedback text-warning" />
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
import permissionService from '@/services/admin/permission.service'; 
import { RoleStatus } from '@/enums/role.enum.js';

export default {
  name: "RoleForm",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:role"],
  props: {
    role: {
      type: Object,
      default: () => ({})
    },
    pageTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    const roleSchema = yup.object().shape({
      name: yup
        .string()
        .required('Role name is required')
        .min(3, "Role name must be at least 3 characters")
        .max(100, "Role name can have a maximum of 100 characters."),
      status: yup
        .string(),
      description: yup
        .string()
        .max(500, "Description can have a maximum of 500 characters."),
      permissions: yup
        .array()
        .of(yup.number().required())
        .min(1, "At least one permission is required")
    }).required();

    return {
      localRole: { 
        ...this.role,
        permissionIds: this.role.permissions ? this.role.permissions.map(p => p.id) : []
      },
      roleSchema,
      statusOptions: RoleStatus.toArray(),
      permissions: [],
    }
  },
  methods: {
    async getAllPermissions() {
      try {
        const response = await permissionService.getAll({
          params: {
            size: 100,
          }
        });
        this.permissions = response.data.content;
      } catch (error) {
        console.error("Error fetching permissions:", error);
        this.permissions = [];
      }
    },
    
    handleSubmit() {
      // get description from tiny-mce
      this.localRole.description = tinymce.get("description").getContent();

      console.log(this.localRole)
      if (this.localRole.permissionIds && Array.isArray(this.localRole.permissionIds)) {
        this.localRole.permissionIds = this.localRole.permissionIds.map(id => id);
      }
      console.log(this.localRole)
      this.$emit("submit:role", this.localRole);
    }
  },
  mounted() {
    this.getAllPermissions();
    tinymce.init({
      selector: "textarea.tiny-editor",
    });
  },
}
</script>

<style scoped lang="scss">
</style>
