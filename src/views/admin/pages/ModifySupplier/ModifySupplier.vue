<template>
  <div class="modify-supplier fluid-container mx-5" v-if="checkPermission('SUPPLIER_EDIT')">
    <SupplierForm
      v-if="supplier"
      :supplier="supplier"
      @submit:supplier="modifySupplier"
      pageTitle="Modify Supplier"
    />
  </div>
  <div class="modify-supplier" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import SupplierForm from '@/components/admin/SupplierForm/SupplierForm.vue';
import SupplierService from '@/services/admin/supplier.service.js';
import Swal from 'sweetalert2';
import loadingDialogHelper from '@/helpers/admin/dialogs/loading.helper.js';
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue';
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper.js';

export default {
  name: "ModifySupplier",
  components: {
    SupplierForm,
    Unauthorized,
  },
  data() {
    return {
      supplier: null,
      isLoading: true,
    };
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
     * Fetches the supplier details based on the ID from the route params.
     */
    async fetchSupplier() {
      try {
        const id = this.$route.params.id;
        loadingDialogHelper("Fetching supplier details...");

        const response = await SupplierService.getOne(id);
        this.supplier = {
          ...response.data,
        };
        console.log(this.supplier)

        Swal.close();
        this.isLoading = false;
      } catch (error) {
        console.error("Error fetching supplier details:", error);
        Swal.close();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch supplier details.',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "Suppliers" });
        });
      }
    },

    /**
     * Handles the modification of an existing supplier.
     * @param {Object} data - The supplier data submitted from the form.
     */
    async modifySupplier(data) {
      try {
        console.log('Modifying supplier with data:', data);
        loadingDialogHelper("Updating supplier...");

        await SupplierService.update(data.id, data);

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Supplier updated successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "Suppliers" });
        });
      } catch (error) {
        console.error("Error updating supplier:", error);
        Swal.close();

        let errorMessage = 'Failed to update supplier.';
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
  mounted() {
    this.fetchSupplier();
  },
};
</script>

<style scoped lang="scss">
</style>
