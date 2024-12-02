<template>
  <div class="modify-role" v-if="checkPermission('ROLE_EDIT')">
    <RoleForm
      v-if="role"
      :role="role"
      @submit:role="updateRole"
      pageTitle="Modify Role"
    />
  </div>
  <div class="modify-role" v-else>
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
  name: "ModifyRole",
  components: {
    RoleForm,
    Unauthorized,
  },
  data() {
    return {
      role: null, 
    };
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName);
    },
    async getRole() {
      try {
        const roleId = this.$route.params.id;
        const response = await RoleService.getById(roleId);
        this.role = response.data;
      } catch (error) {
        console.error("Error fetching role:", error);
        Swal.fire('Error', 'Unable to fetch role details.', 'error');
        this.$router.push({ name: "Roles" });
      }
    },

    async updateRole(data) {
      try {
        console.log('Updating role with data:', data);
        loadingDialogHelper("Updating role...");
        await RoleService.update(data.id, data);
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Role updated successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "Roles" });
        });
      } catch (error) {
        console.error("Error updating role:", error);
        Swal.close();
        let errorMessage = 'Failed to update role.';
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
    this.getRole();
  },
};
</script>

<style scoped lang="scss">
</style>
