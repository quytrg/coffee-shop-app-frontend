<template>
  <div class="create-supply-order fluid-container mx-5" v-if="checkPermission('SUPPLY_ORDER_CREATE')">
    <SupplyOrderForm
      :supplyOrder="supplyOrder"
      @submit:supplyOrder="createSupplyOrder"
      pageTitle="Add Supply Order"
    />
  </div>
  <div class="create-supply-order" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import SupplyOrderForm from '@/components/admin/SupplyOrderForm/SupplyOrderForm.vue';
import supplyOrderService from '@/services/admin/supplyOrder.service.js';
import Swal from 'sweetalert2';
import loadingDialogHelper from '@/helpers/admin/dialogs/loading.helper.js';
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue';
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper.js';

export default {
  name: "CreateSupplyOrder",
  components: {
    SupplyOrderForm,
    Unauthorized,
  },
  data() {
    return {
      supplyOrder: {
        status: '',
        expectedDeliveryDate: null,
        paymentStatus: '',
        paymentMethod: '',
        description: '',
        supplierId: null,
        supplyOrderItems: [],
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
     * Handles the creation of a new supply order.
     * @param {Object} data - The supply order data submitted from the form.
     */
    async createSupplyOrder(data) {
      try {
        console.log('Creating supply order with data:', data);
        loadingDialogHelper("Creating supply order...");

        await supplyOrderService.create(data);

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Supply order created successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "SupplyOrders" });
        });
      } catch (error) {
        console.error("Error creating supply order:", error);
        Swal.close();

        let errorMessage = 'Failed to create supply order.';
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
