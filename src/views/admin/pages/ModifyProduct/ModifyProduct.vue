<template>
  <div class="modify-product" v-if="checkPermission('PRODUCT_EDIT')">
    <ProductForm 
      v-if="product"
      :product="product"
      @submit:product="updateProduct"
      pageTitle="Modify Product"
    />
  </div>
  <div class="modify-product" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import ProductForm from '@/components/admin/ProductForm/ProductForm.vue';
import ProductService from '@/services/admin/product.service.js';
import Swal from 'sweetalert2';
import loadingDialogHelper from '@/helpers/admin/dialogs/loading.helper';
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue';
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper';

export default {
  name: "ModifyProduct",
  components: {
    ProductForm,
    Unauthorized,
  },
  data() {
    return {
      product: null,
    };
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName);
    },

    async getProduct() {
      try {
        const response = await ProductService.getProductById(this.$route.params.id);
        this.product = response.data;
      } catch (error) {
        console.error("Error fetching product:", error);
        Swal.fire('Error', 'Unable to fetch product details.', 'error');
        this.$router.push({ name: "ProductsAdmin" });
      }
    },

    async updateProduct(data) {
      try {
        console.log('Updating product with data:', data);
        loadingDialogHelper();
        await ProductService.update(data.id, data);
        Swal.close();
        Swal.fire('Success', 'Product updated successfully.', 'success');
        this.$router.push({ name: "ProductsAdmin" });
      } catch (error) {
        console.error("Error updating product:", error);
        Swal.close();
        Swal.fire('Error', 'Failed to update product.', 'error');
      }
    }
  },
  created() {
    this.getProduct();
  },
};
</script>

<style scoped lang="scss">
</style>
