<template>
  <div class="ingredient-form fluid-container mx-5">
    <h4 class="page-title mt-4 mb-0 d-flex align-items-center">
      <h4 class="gray-text">Management</h4>
      <h5 class="mx-1">/</h5> 
      <h4 class="primary-text">{{ pageTitle }}</h4>
    </h4>
    <Form @submit="handleSubmit" :validation-schema="ingredientSchema">
      <div class="row">
        <div class="mb-3 d-flex justify-content-end">
          <button
            type="submit"
            class="btn btn-main"
          >
            {{ submitButtonText }}
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-7">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Ingredient Information</h5>
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  class="form-control"
                  placeholder="Enter ingredient name"
                  v-model="localIngredient.name"
                />
                <ErrorMessage name="name" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="storageInstructions" class="form-label">Storage Instructions</label>
                <textarea
                  name="storageInstructions" 
                  id="storageInstructions"  
                  class="form-control tiny-editor"
                  v-model="localIngredient.storageInstructions"
                >
                </textarea>
                <ErrorMessage name="storageInstructions" class="error-feedback text-warning" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-5">
          <div class="card mb-3 px-2">
            <div class="card-body">
              <h5 class="card-title">Organize</h5>
              <div class="mb-3">
                <label for="defaultUnit" class="form-label">Default Unit</label>
                <v-select
                  :items="unitOptions"
                  label="Select Default Unit"
                  density="compact"
                  variant="outlined"
                  item-title="label"
                  item-value="value"
                  clearable
                  hide-details
                  v-model="localIngredient.defaultUnit" 
                  :rules="[value => !!value || 'Be required']"
                />
                <ErrorMessage name="defaultUnit" class="error-feedback text-warning" />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  name="description" 
                  id="description"  
                  class="form-control tiny-editor"
                  v-model="localIngredient.description"
                >
                </textarea>
                <ErrorMessage name="description" class="error-feedback text-warning" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { MeasurementUnit } from '@/enums/measurementUnit.enum.js'; 

export default {
  name: "IngredientForm",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:ingredient"],
  props: {
    ingredient: {
      type: Object,
      default: () => ({
        name: '',
        description: '',
        storageInstructions: '',
        defaultUnit: null,
      })
    },
    pageTitle: {
      type: String,
      default: 'Create Ingredient'
    }
  },
  data() {
    const ingredientSchema = yup.object().shape({
      name: yup
        .string()
        .required('Ingredient name is required')
        .min(2, "Name must be at least 2 characters")
        .max(500, "Name can have a maximum of 500 characters."),
      description: yup
        .string()
        .max(2000, "Description cannot exceed 2000 characters."),
      storageInstructions: yup
        .string()
        .max(2000, "Storage instructions cannot exceed 2000 characters."),
    });

    return {
      localIngredient: { 
        ...this.ingredient,
      },
      ingredientSchema,
      unitOptions: MeasurementUnit.toArray(),
      submitButtonText: this.pageTitle.includes('Modify') ? 'Update Ingredient' : 'Publish Ingredient',
    }
  },
  methods: {
    handleSubmit() {
      // Get content from TinyMCE editors
      this.localIngredient.description = tinymce.get("description").getContent();
      this.localIngredient.storageInstructions = tinymce.get("storageInstructions").getContent();

      this.$emit("submit:ingredient", this.localIngredient);
    },
  },
  mounted() {
    tinymce.init({
      selector: "textarea.tiny-editor",
    });
  },
  beforeUnmount() {
    // Destroy TinyMCE instances to prevent memory leaks
    tinymce.remove();
  }
}
</script>

<style scoped lang="scss">
</style>
