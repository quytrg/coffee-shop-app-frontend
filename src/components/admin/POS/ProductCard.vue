<template>
  <v-card class="mx-auto" max-width="450" outlined v-if="variants.length"> 
    <v-row dense class="mt-2 ms-2">
      <v-col
        cols="12"
        md="5"
        sm="6"
      >
        <div class="thumbnail">
          <img
          :src="product.imageUrls[0] ? product.imageUrls[0] : '/default-coffee-image.png'"
          height="150"
          class="product-image"
        ></img>
        </div>
      </v-col>
      <v-col
        cols="12"
        md="7"
        sm="6"
      >
        <v-card-title class="pb-1 mt-2">{{ product.name }}</v-card-title>
        <h5 class="p-3 pt-0 mt-5">Price: {{ formatCurrency(selectedVariant?.price) }}</h5>
      </v-col>
    </v-row>
    
    
    <v-card-text class="pb-0">
      <v-container class="pt-0">
        <v-row>
          <v-col         
            align-item="start"              
          >
            <div class="size-label">Size</div>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col    
            v-for="(item, index) in variants"                   
            cols="12"
            md="4"
            sm="6"
            class="d-flex justify-center"
          >
            <v-btn
              size="small"
              :key="item.id"
              :class="[
                'size-button',
                item.status === 'ACTIVE' ? 'active' : 'inactive',
                selectedVariant && selectedVariant.id === item.id ? 'selected' : '' 
              ]"
              :disabled="item.status !== 'ACTIVE'"
              @click="selectVariant(item)"
            >
              {{ item.size }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    
    <v-card-actions>
      <v-btn
        variant="elevated"
        color="#936f6f"
        @click="addToCart"
        :disabled="!selectedVariant"
        block
      >
        <v-icon start>mdi-cart-plus</v-icon>
        Add To Order
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import productService from '@/services/admin/product.service.js'
export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      selectedVariant: null,
      variants: [],
    }
  },
  methods: {
    addToCart() {
      if (this.selectedVariant) {
        const productWithVariant = { 
          ...this.product, 
          variant: this.selectedVariant 
        }
        this.$emit('add-to-cart', productWithVariant)
        this.selectedVariant = this.variants[0]
      }
    },
    async getAllVariants() {
      try {
        const filter = {
          params: {
            size: 50,
          }
        }
        const result = await productService.getAllVariants(this.product.id, filter)
        this.variants = result.data.content
        console.log(this.variants)
        if (this.variants.length) {
          this.selectedVariant = this.variants[0]
        }
      }
      catch(err) {
        console.log(err)
      }
    },
    selectVariant(value) {
      this.selectedVariant = value
    },
    /**
     * Formats a number as currency.
     * @param {Number} amount - The amount to format.
     * @returns {String}
    */
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    },
  },
  mounted() {
    this.getAllVariants()
  },
}
</script>

<style scoped>
.thumbnail {
  width: 120px;
  height: 120px;
  position: relative;
  overflow: hidden;
  float: left;
  background-color: #F8F7FA;
  border-radius: 5px;
  border-color: #F8F7FA !important;
  box-shadow: 0 0 !important;

  img {
    height: 80px !important;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: auto;
  }
}

.product-image {
  border-radius: 8px; 
  object-fit: cover;
}


.size-label {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.size-button {
  margin: 8px;
  height: 48px !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: none;
  font-weight: bold;
  font-size: 18px;
}

.size-button.active {
  border: 2px solid #7d6969;
  background-color: #ffffff;
}

.size-button.selected {
  border: 2px solid #745f5f;
  background-color: #F6EFEF;
}

.size-button.inactive {
  color: #bdbdbd;
  background-color: #f8f8f8;
}
</style>
