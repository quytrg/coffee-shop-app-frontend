<template>
  <div class="select">
    <v-select
      :items="items"
      :label="label"
      chips
      multiple
      density="compact"
      variant="outlined"
      item-title="name"
      item-value="id"
      clearable
      hide-details
      v-model="internalValue" 
    />
  </div>
</template>

<script>
export default {
  props: {
    selectedValue: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: 'Select'
    }
  },
  emits: ['update:selectedValue'],
  data() {
    return {
      internalValue: this.selectedValue, // Giá trị nội bộ để binding
    };
  },
  watch: {
    internalValue(newVal) {
      this.$emit('update:selectedValue', newVal); // Phát sự kiện khi giá trị thay đổi
    },
    selectedValue(newVal) {
      this.internalValue = newVal; // Đồng bộ hóa khi `selectedValue` từ cha thay đổi
    }
  }
};
</script>

<style lang="scss" scoped>
.select {
  min-width: 200px;
}
</style>
