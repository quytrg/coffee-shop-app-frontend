<template>
  <div class="create-product" v-if="checkPermission('PRODUCT_CREATE')">
    <ProductForm 
      :product="product"
      @submit:product="createProduct"
      pageTitle="Add Product"
    />
  </div>
  <div class="create-product" v-else>
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
  name: "CreateProduct",
  components: {
    ProductForm,
    Unauthorized,
  },
  data() {
    return {
      product: {
      },
    };
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName);
    },

    async createProduct(data) {
      try {
        console.log('Creating product with data:', data);
        loadingDialogHelper("Creating product...");
        
        await ProductService.create(data);
        
        // Đóng dialog tải
        Swal.close();
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Product created successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "ProductsAdmin" });
        });
      } catch (error) {
        console.error("Error creating product:", error);
        Swal.close();
        
        let errorMessage = 'Failed to create product.';
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
