<template>
  <div class="modify-stock-batch fluid-container mx-5" v-if="checkPermission('STOCK_BATCH_EDIT')">
    <StockBatchForm
      v-if="stockBatch"
      :stockBatch="stockBatch"
      @submit:stockBatch="updateStockBatch"
      pageTitle="Modify Stock Batch"
    />
  </div>
  <div class="modify-stock-batch" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import StockBatchForm from '@/components/admin/StockBatchForm/StockBatchForm.vue';
import stockBatchService from '@/services/admin/stockBatch.service.js';
import Swal from 'sweetalert2';
import loadingDialogHelper from '@/helpers/admin/dialogs/loading.helper.js';
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue';
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper.js';

export default {
  name: "ModifyStockBatch",
  components: {
    StockBatchForm,
    Unauthorized,
  },
  props: {
  },
  data() {
    return {
      stockBatch: null,
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
     * Fetches the stock batch details based on the ID from route params.
     */
    async fetchStockBatch() {
      const stockBatchId = this.$route.params.id;
      if (!stockBatchId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Stock Batch ID is missing.',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "StockBatches" });
        });
        return;
      }

      try {
        loadingDialogHelper("Loading Stock Batch Details...");
        const response = await stockBatchService.getOne(stockBatchId);
        Swal.close();

        this.stockBatch = {
          id: response.data.id,
          ingredientId: response.data.ingredientId,
          ingredientName: response.data.ingredientName,
          numberOfItems: response.data.numberOfItems,
          pricePerItem: response.data.pricePerItem,
          unitValue: response.data.unitValue,
          defaultUnit: response.data.defaultUnit,
          subtotal: response.data.subtotal,
          initialQuantity: response.data.initialQuantity,
          remainingQuantity: response.data.remainingQuantity,
          supplyOrderId: response.data.supplyOrderId,
          supplyOrderCode: response.data.supplyOrderCode,
          supplyOrderDescription: response.data.supplyOrderDescription,
          receivedDate: response.data.receivedDate,
          expirationDate: response.data.expirationDate,
          supplierId: response.data.supplierId,
          supplierName: response.data.supplierName,
        };
      } catch (error) {
        console.error("Error fetching stock batch:", error);
        Swal.close();

        let errorMessage = 'Failed to load stock batch details.';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "StockBatches" });
        });
      }
    },

    /**
     * Handles the update of the stock batch.
     * @param {Object} data - The updated stock batch data from the form.
     */
    async updateStockBatch(data) {
      try {
        loadingDialogHelper("Updating stock batch...");

        await stockBatchService.update(data.id, data);

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Stock batch updated successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "StockBatches" });
        });
      } catch (error) {
        console.error("Error updating stock batch:", error);
        Swal.close();

        let errorMessage = 'Failed to update stock batch.';
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
    this.fetchStockBatch();
  },
};
</script>

<style scoped lang="scss">
</style>
