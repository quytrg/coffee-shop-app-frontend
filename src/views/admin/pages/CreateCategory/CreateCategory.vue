<template>
  <div class="create-category" v-if="checkPermission('CATEGORY_CREATE')">
    <CategoryForm
      :category="category"
      @submit:category="createCategory"
      pageTitle="Add Category"
    />
  </div>
  <div class="create-category" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import CategoryForm from '@/components/admin/CategoryForm/CategoryForm.vue';
import CategoryService from '@/services/admin/category.service.js';
import Swal from 'sweetalert2';
import loadingDialogHelper from '@/helpers/admin/dialogs/loading.helper';
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue';
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper';

export default {
  name: "CreateCategory",
  components: {
    CategoryForm,
    Unauthorized,
  },
  data() {
    return {
      category: {
        name: '',
        description: '',
      },
    };
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName);
    },

    async createCategory(data) {
      try {
        console.log('Creating category with data:', data);
        loadingDialogHelper("Creating category...");

        await CategoryService.create(data);

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Category created successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "Categories" });
        });
      } catch (error) {
        console.error("Error creating category:", error);
        Swal.close();

        let errorMessage = 'Failed to create category.';
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
