<template>
  <v-row class="category-list overflow-x-auto pa-2 my-3">
    <v-col 
      v-for="category in categories" 
      :key="category.id"
      cols="auto"
      class="pa-1"
    >
      <v-card
        :color="isSelected(category) ? '#F6EFEF' : 'white'"
        :class="isSelected(category) ? 'border-primary' : 'border-default'"
        class="d-flex align-center rounded-lg cursor-pointer"
        elevation="1"
        height="140"
        width="130"
        @click="selectCategory(category)"
      >
        <v-card-text class="d-flex flex-column justify-end align-center text-center thumbnail h-100 pb-2">
          <img
            :src="category.imageUrls[0] ? category.imageUrls[0] : '/default-coffee-image.png'"
            :error-src="'/default-coffee-image.png'"
            max-height="100"
            max-width="100"
            cover
            class="mb-4"
          ></img>
          
          <v-card-title 
            class="text-body-2 pa-0"
            :class="isSelected(category) ? 'text-brown' : 'text-black'"
          >
            {{ category.name }}
          </v-card-title>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "CategoryList",
  props: {
    categories: {
      type: Array,
      required: true
    },
    selectedCategory: {
      type: Object,
      default: null
    }
  },
  methods: {
    selectCategory(category) {
      console.log(category)
      this.$emit('select-category', category)
    },
    isSelected(category) {
      return this.selectedCategory && this.selectedCategory.id === category.id
    }
  }
}
</script>

<style scoped>

.thumbnail {
  width: 140px;
  height: 140px;
  position: relative;
  overflow: hidden;
  float: left;
  background-color: white;
  box-shadow: 0 0 !important;

  img {
    height: 80px;
    left: 50%;
    position: absolute;
    top: 45%;
    transform: translate(-50%, -50%);
    width: auto;
  }
}

.category-list {
  display: flex;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #ccc #f5f5f5;
}

.border-primary {
  border: 2px solid #704232 !important;
}

.border-default {
  border: 1px solid #BCAAA4 !important;
}

.cursor-pointer {
  cursor: pointer;
  transition: all 0.3s ease;
}

.cursor-pointer:hover {
  transform: scale(1.05);
}

/* Custom scrollbar for webkit browsers */
.category-list::-webkit-scrollbar {
  height: 8px;
}

.category-list::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}

.category-list::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}
</style>
