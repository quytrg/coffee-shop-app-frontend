<template>
  <div class="modify-ingredient" v-if="checkPermission('INGREDIENT_EDIT')">
    <IngredientForm
      v-if="ingredient"
      :ingredient="ingredient"
      @submit:ingredient="modifyIngredient"
      pageTitle="Modify Ingredient"
    />
  </div>
  <div class="modify-ingredient" v-else>
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
  name: "ModifyIngredient",
  components: {
    IngredientForm,
    Unauthorized,
  },
  data() {
    return {
      ingredient: null,
      isLoading: true,
    };
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName);
    },
    async fetchIngredient() {
      try {
        const id = this.$route.params.id;
        loadingDialogHelper("Fetching ingredient details...");

        const response = await IngredientService.getOne(id);
        this.ingredient = {
          ...response.data,
        };

        Swal.close();
        this.isLoading = false;
      } catch (error) {
        console.error("Error fetching ingredient details:", error);
        Swal.close();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch ingredient details.',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "Ingredients" });
        });
      }
    },
    async modifyIngredient(data) {
      try {
        console.log('Modifying ingredient with data:', data);
        loadingDialogHelper("Updating ingredient...");

        await IngredientService.update(data.id, data);

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Ingredient updated successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "Ingredients" });
        });
      } catch (error) {
        console.error("Error updating ingredient:", error);
        Swal.close();

        let errorMessage = 'Failed to update ingredient.';
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
    this.fetchIngredient();
  },
};
</script>

<style scoped lang="scss">
</style>
