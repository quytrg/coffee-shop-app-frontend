<template>
  <div class="modify-supply-order fluid-container mx-5" v-if="checkPermission('SUPPLY_ORDER_EDIT')">
    <SupplyOrderForm
      v-if="supplyOrder"
      :supplyOrder="supplyOrder"
      @submit:supplyOrder="updateSupplyOrder"
      pageTitle="Modify Supply Order"
    />
  </div>
  <div class="modify-supply-order" v-else>
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
  name: "ModifySupplyOrder",
  components: {
    SupplyOrderForm,
    Unauthorized,
  },
  data() {
    return {
      supplyOrder: null
    }
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
     * Fetches the supply order details based on the ID from route params.
     */
    async fetchSupplyOrder() {
      const supplyOrderId = this.$route.params.id;
      if (!supplyOrderId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Supply Order ID is missing.',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "SupplyOrders" });
        });
        return;
      }

      try {
        loadingDialogHelper("Loading Supply Order Details...");
        const response = await supplyOrderService.getOne(supplyOrderId);
        Swal.close();

        this.supplyOrder = {
          id: response.data.id,
          status: response.data.status,
          expectedDeliveryDate: response.data.expectedDeliveryDate,
          actualDeliveryDate: response.data.actualDeliveryDate,
          paymentStatus: response.data.paymentStatus,
          paymentMethod: response.data.paymentMethod,
          description: response.data.description,
          supplierId: response.data.supplier.id,
          supplyOrderItems: response.data.supplyOrderItems.map(item => ({
            ingredientId: item.ingredientId,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            discount: item.discount,
            expirationDate: item.expirationDate,
            unit: item.defaultUnit,
            unitValue: item.unitValue,
          })),
        };
      } catch (error) {
        console.error("Error fetching supply order:", error);
        Swal.close();

        let errorMessage = 'Failed to load supply order details.';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "SupplyOrders" });
        });
      }
    },

    /**
     * Handles the update of the supply order.
     * @param {Object} data - The updated supply order data from the form.
     */
    async updateSupplyOrder(data) {
      try {
        loadingDialogHelper("Updating supply order...");

        await supplyOrderService.update(data.id, data);

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Supply order updated successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "SupplyOrders" });
        });
      } catch (error) {
        console.error("Error updating supply order:", error);
        Swal.close();

        let errorMessage = 'Failed to update supply order.';
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
    this.fetchSupplyOrder();
  },
};
</script>

<style scoped lang="scss">
</style>
