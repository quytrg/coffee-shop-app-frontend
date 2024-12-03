<template>
  <div class="create-supplier fluid-container mx-5" v-if="checkPermission('SUPPLIER_CREATE')">
    <SupplierForm
      :supplier="supplier"
      @submit:supplier="createSupplier"
      pageTitle="Add Supplier"
    />
  </div>
  <div class="create-supplier" v-else>
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
  name: "CreateSupplier",
  components: {
    SupplierForm,
    Unauthorized,
  },
  data() {
    return {
      supplier: {
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
      },
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
     * Handles the creation of a new supplier.
     * @param {Object} data - The supplier data submitted from the form.
     */
    async createSupplier(data) {
      try {
        console.log('Creating supplier with data:', data);
        loadingDialogHelper("Creating supplier...");

        await SupplierService.create(data);

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Supplier created successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "Suppliers" });
        });
      } catch (error) {
        console.error("Error creating supplier:", error);
        Swal.close();

        let errorMessage = 'Failed to create supplier.';
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
};
</script>

<style scoped lang="scss">
</style>
