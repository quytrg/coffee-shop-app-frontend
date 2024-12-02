<template>
  <div class="change-multi d-flex">
    <v-select
      :items="items"
      label="Change multiple"
      density="compact"
      variant="outlined"
      item-title="title"
      item-value="value"
      clearable
      hide-details
      v-model="selectedType"
      class="mb-2 mb-md-0"
    >
    </v-select>
    <button 
      type="submit" 
      class="btn btn-primary btn-main ms-1 " 
      @click="handleChangeMulti"
    >
      Apply
    </button>
  </div>
</template>

<script>
  export default {
    name: "ChangeMulti",
    data() {
      return {
        selectedType: null,
        items: [
          { title: 'Active', value: 'active' },
          { title: 'Inactive', value: 'inactive' },
          { title: 'Position', value: 'position' },
          { title: 'Delete', value: 'delete' },
        ]
      }
    },
    methods: {
      handleChangeMulti() {
        this.$emit('apply', this.selectedType)
      }
    }
  }
</script>

<style lang="scss" scoped>
.change-multi {
  min-width: 280px;
}
</style>
