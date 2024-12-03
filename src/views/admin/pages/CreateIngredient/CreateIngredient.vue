<template>
  <div class="create-ingredient" v-if="checkPermission('INGREDIENT_CREATE')">
    <IngredientForm
      :ingredient="ingredient"
      @submit:ingredient="createIngredient"
      pageTitle="Add Ingredient"
    />
  </div>
  <div class="create-ingredient" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import IngredientForm from '@/components/admin/IngredientForm/IngredientForm.vue';
import IngredientService from '@/services/admin/ingredient.service.js';
import Swal from 'sweetalert2';
import loadingDialogHelper from '@/helpers/admin/dialogs/loading.helper';
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue';
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper';

export default {
  name: "CreateIngredient",
  components: {
    IngredientForm,
    Unauthorized,
  },
  data() {
    return {
      ingredient: {
        name: '',
        description: '',
        storageInstructions: '',
        defaultUnit: null,
      },
    };
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName);
    },
    async createIngredient(data) {
      try {
        console.log('Creating ingredient with data:', data);
        loadingDialogHelper("Creating ingredient...");

        await IngredientService.create(data);

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Ingredient created successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "Ingredients" });
        });
      } catch (error) {
        console.error("Error creating ingredient:", error);
        Swal.close();

        let errorMessage = 'Failed to create ingredient.';
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
