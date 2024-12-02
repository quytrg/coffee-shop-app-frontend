<template>
  <div class="modify-category" v-if="checkPermission('CATEGORY_EDIT')">
    <CategoryForm 
      v-if="category"
      :category="category"
      @submit:category="updateCategory"
      pageTitle="Modify Category"
    />
  </div>
  <div class="modify-category" v-else>
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
  name: "ModifyCategory",
  components: {
    CategoryForm,
    Unauthorized,
  },
  data() {
    return {
      category: null,
    };
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName);
    },
    async getCategory() {
      try {
        const response = await CategoryService.getOne(this.$route.params.id);
        this.category = response.data;
      } catch (error) {
        console.error("Error fetching category:", error);
        Swal.fire('Error', 'Unable to fetch category details.', 'error');
        this.$router.push({ name: "Categories" });
      }
    },
    async updateCategory(data) {
      try {
        console.log(data);
        loadingDialogHelper();
        await CategoryService.update(data.id, data);
        Swal.close();
        Swal.fire('Success', 'Category updated successfully.', 'success');
        this.$router.push({ name: "Categories" });
      }
      catch(err) {
        console.error("Error updating category:", err);
        Swal.close();
        Swal.fire('Error', 'Failed to update category.', 'error');
      }
    }
  },
  created() {
    this.getCategory();
  },
};
</script>

<style scoped lang="scss">
</style>
