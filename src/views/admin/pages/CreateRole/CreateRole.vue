<template>
  <div class="create-role" v-if="checkPermission('ROLE_CREATE')">
    <RoleForm
      :role="emptyRole"
      @submit:role="createRole"
      pageTitle="Create Role"
    />
  </div>
  <div class="create-role" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import RoleForm from '@/components/admin/RoleForm/RoleForm.vue';
import RoleService from '@/services/admin/role.service.js';
import Swal from 'sweetalert2';
import loadingDialogHelper from '@/helpers/admin/dialogs/loading.helper';
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue';
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper';

export default {
  name: "CreateRole",
  components: {
    RoleForm,
    Unauthorized,
  },
  data() {
    return {
      emptyRole: {
        name: '',
        status: '',
        description: '',
        permissionIds: [],
      },
    };
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName);
    },
    async createRole(data) {
      try {
        console.log('Creating role with data:', data);
        loadingDialogHelper("Creating role...");
        await RoleService.create(data);
        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Role created successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "Roles" });
        });
      } catch (error) {
        console.error("Error creating role:", error);
        Swal.close();
        let errorMessage = 'Failed to create role.';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonText: 'OK',
        });
      }
    }
  },
  created() {
  },
};
</script>

<style scoped lang="scss">
</style>
