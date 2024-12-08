<template>
  <v-app style="background-color: #F8F7FA">
    <!-- Fixed Cart Sidebar -->
    <CartSidebar
      v-model:visible="cartVisible"
      :cart-items="cart"
      :customerName="customerName"
      @remove-from-cart="removeFromCart"
      @create-order="createOrder"
      @update-note="updateNote"
      @update-quantity="updateQuantity"
      @update-customer-name="updateCustomerName"
      @update-received-amount="updateReceivedAmount"
    />

    <v-container fluid>
      <!-- Toolbar with Title and Search -->
      <v-toolbar color="transparent" flat>
        <v-toolbar-title class="mt-n3 ms-2 title">Choose Category</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          label="Search category or menu..."
          class="mt-5"
          color="brown"
          density="compact"
          variant="outlined"
          filled
          append-icon="mdi-magnify"
          dense
          solo
          flat
          background-color="grey lighten-4"
          v-model="searchQuery"
        ></v-text-field>
      </v-toolbar>

      <!-- Horizontal Category List -->
      <CategoryList
        :categories="categories"
        @select-category="selectCategory"
        :selected-category="selectedCategory"
      />

      <!-- Product Menu Toolbar -->
      <v-toolbar color="#F8F7FA" flat>
        <v-toolbar-title class="ms-2 title">Menu</v-toolbar-title>
        <v-spacer></v-spacer>
        <span>{{ filteredProducts.length }} Products Found</span>
      </v-toolbar>

      <!-- Product Grid -->
      <v-row dense>
        <v-col
          v-for="product in filteredProducts"
          :key="product.id"
          cols="12"
          sm="4"
          md="4"
        >
          <ProductCard
            :product="product"
            @add-to-cart="addToCart"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import CategoryList from '@/components/admin/POS/CategoryList.vue'
import ProductCard from '@/components/admin/POS/ProductCard.vue'
import CartSidebar from '@/components/admin/POS/CartSidebar.vue'
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue'
import productService from '@/services/admin/product.service.js'
import categoryService from '@/services/admin/category.service.js'
import orderService from '@/services/admin/order.service.js'
import confirmDialogHelper from '@/helpers/admin/dialogs/confirm.helper.js'
import successDialogHelper from '@/helpers/admin/dialogs/success.helper.js'
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper.js'
import Swal from 'sweetalert2';

export default {
  name: "ProductSelection",
  components: {
    CategoryList,
    ProductCard,
    CartSidebar,
    Unauthorized,
  },
  data() {
    return {
      categories: [],
      selectedCategory: null,
      products: [],
      searchQuery: '',
      cart: [],
      alert: false,
      cartVisible: false,
      customerName: '',
      receivedAmount: null
    }
  },
  computed: {
    /**
     * Filters products based on selected category and search query.
     */
    filteredProducts() {
      let filtered = this.products
      if (this.selectedCategory) {
        filtered = filtered.filter(p => p.categoryId === this.selectedCategory.id)
      }
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        )
      }
      return filtered
    }
  },
  methods: {
    /**
     * Checks if the user has the required permission.
     * @param {String} permissionName - The name of the permission to check.
     * @returns {Boolean}
     */
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName);
    },

    /**
     * Fetches the list of categories from the API.
     */
    async fetchCategories() {
      try {
        const response = await categoryService.getAll({ params: { size: 100, status: 'active' } })
        console.log(response)
        this.categories = response.data.content
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    },

    /**
     * Fetches the list of products from the API.
     */
    async fetchProducts() {
      try {
        const response = await productService.get({ params: { size: 1000, status: 'active' } })
        this.products = response.data.content
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    },

    /**
     * Selects a category and filters products accordingly.
     * @param {Object} category - The selected category.
     */
    selectCategory(category) {
      if (this.selectedCategory && this.selectedCategory.id === category.id) {
        this.selectedCategory = null
      } else {
        this.selectedCategory = category
      }
    },

    /**
     * Adds a product to the cart or increases its quantity if already in the cart.
     * @param {Object} product - The product to add.
     */
    addToCart(product) {
      const existing = this.cart.find(item => item.product.id === product.id && item.variant === product.variant)
      if (existing) {
        existing.quantity += 1
      } else {
        console.log(product)
        this.cart.push({ product, quantity: 1, variant: product.variant, description: '' })
      }
      this.cartVisible = true
    },

    /**
     * Removes a product from the cart.
     * @param {Number} productId - The ID of the product to remove.
     */
    removeFromCart(productVariantId) {
      this.cart = this.cart.filter(item => item.variant.id !== productVariantId)
    },

    /**
     * Updates the note for a specific cart item.
     * @param {Number} productId - The ID of the product.
     * @param {String} note - The note to add.
     */
    updateNote(productVariantId, note) {
      const item = this.cart.find(item => item.variant.id === productVariantId)
      if (item) {
        item.description = note
      }
    },

    updateQuantity(productVariantId, quantity) {
      const item = this.cart.find(item => item.variant.id === productVariantId)
      if (item) {
        item.quantity = quantity
      }
    },

    updateCustomerName(customerName) {
      this.customerName = customerName
    },

    updateReceivedAmount(amount) {
      this.receivedAmount = amount
    },

    /**
     * Creates an order from the cart after confirmation.
     */
    async createOrder() {
      if (this.cart.length === 0) {
        this.alert = true
        setTimeout(() => { this.alert = false }, 2000)
        return
      }

      try {
        const orderItems = this.cart.map(item => ({
          productVariantId: item.variant.id,
          quantity: item.quantity,
          description: item.description,
        }))

        const order = {
          customerName: this.customerName,
          receivedAmount: this.receivedAmount,
          orderItems: orderItems
        }

        const confirmResult = await confirmDialogHelper("Confirm", "Are you sure you want to create this order?", "Yes, create")
        if (confirmResult.isConfirmed) {
          await orderService.create(order)
          this.cart = []
          this.cartVisible = false
          successDialogHelper("Success", "Order created successfully!")
        }
      } catch (error) {
        console.error("Error creating order:", error)
        Swal.close();

        let errorMessage = 'Failed to create order.';
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
    this.fetchCategories()
    this.fetchProducts()
  }
}
</script>

<style scoped lang="scss">

.title {
  color: #532313;
  font-size: 22px;
}

.product-selection-title {
  font-weight: bold;
}

.alert {
  top: 1rem;
  right: 1rem;
}

.cursor-pointer {
  cursor: pointer;
}

.borderme {
  border: 2px solid #704232 !important;
}

.borderout {
  border: 1px solid #BCAAA4 !important;
}

@media (max-width: 767.98px) {
  .d-flex:not(.product-selection-title, .card-header) {
    flex-direction: column !important;
    align-items: stretch !important;
  }
}

.space {
  gap: 16px;
}
</style>
