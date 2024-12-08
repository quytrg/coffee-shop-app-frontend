<template>
  <v-navigation-drawer
    v-model="localVisible"
    location="right"
    temporary
    :width="400"
    class="cart-sidebar"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center mb-0">
        <span>Your Order</span>
        <v-btn 
          icon="mdi-close" 
          variant="text" 
          @click="closeCart"
        ></v-btn>
      </v-card-title>

      <v-divider class="mt-0"></v-divider>

      <v-card-text>
        <h5>Customer Name:</h5>
        <v-text-field
          label="Enter Name..."
          density="compact"
          variant="outlined"
          v-model="localCustomerName"
          @update:model-value="updateCustomerName"
        />
        <v-list v-if="cartItems.length > 0">
          <v-list-item 
            v-for="(item, index) in cartItems" 
            :key="`${item.product.id}-${item.size}-${index}`"
            class="mb-2"
          >
            <v-row no-gutters>
              <v-col cols="9">
                <div class="d-flex flex-column order-item">
                  <h5>
                    {{ item.product.name }} ({{ item.variant.size }})
                  </h5>
                  
                  <div class="d-flex align-center">
                    <v-btn 
                      icon 
                      density="compact" 
                      @click="decreaseQuantity(item)"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <span class="mx-3 my-2">{{ item.quantity }}</span>
                    <v-btn 
                      icon 
                      density="compact" 
                      @click="increaseQuantity(item)"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </div>

                  <div class="mt-1 price">
                    Price: {{ formatCurrency(item.variant.price * item.quantity) }}
                  </div>

                  <v-textarea
                    v-model="item.description"
                    label="Special instructions"
                    placeholder="e.g., Extra ice, no sugar"
                    auto-grow
                    rows="1"
                    density="compact"
                    variant="outlined"
                    class="mt-2"
                    @update:model-value="updateItemNote(item, $event)"
                  ></v-textarea>
                </div>
              </v-col>

              <v-col cols="3" class="d-flex justify-end align-start">
                <v-btn
                  icon
                  color="error"
                  @click="removeFromCart(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>

        <v-alert 
          v-else 
          type="info" 
          border="start"
          variant="tonal"
          density="compact"
          class="text-center"
        >
          Your cart is empty
        </v-alert>
      </v-card-text>

      <v-divider class="mt-0"></v-divider>

      <v-card-actions class="pa-4">
        <v-row dense>
          <v-col
            cols="12" md="6" sm="12"
          >
            <div class="d-flex justify-space-between total">
              <span class="me-1">Total: {{ calculateTotal() }}</span>
            </div>
          </v-col>
          <v-col cols="12" md="6" sm="12"></v-col>
          <v-col class="mt-3" cols="12" md="6" sm="12">
            <h5>Received Amount:</h5>
            <v-text-field
              type="number"
              label="Enter Received Amount..."
              density="compact"
              variant="outlined"
              v-model="localReceivedAmount"
              hide-details
              @update:model-value="updateReceivedAmount"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12"></v-col>
          <v-col
            cols="12" md="6" sm="12"
            class="mt-2"
          >
            <div class="d-flex justify-space-between total">
              <span class="me-1">Return Amount: {{ calculateReturnAmount() }}</span>
            </div>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-btn
              color="primary"
              block
              :disabled="cartItems.length === 0"
              class="mt-3"
              variant="flat"
              @click="createOrder"
            >
              Place Order
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'CartSidebar',
  props: {
    cartItems: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    customerName: {
      type: String,
      default: ''
    },
    receivedAmount: {
      type: Number,
      default: ''
    },
  },
  emits: [
    'update:visible', 
    'remove-from-cart', 
    'create-order', 
    'update-note',
    'update-quantity',
    'update-customer-name',
    'update-received-amount'
  ],
  data() {
    return {
      localVisible: this.visible,
      localCustomerName: this.customerName,
      localReceivedAmount: this.receivedAmount,
      totalAmount: 0
    }
  },
  watch: {
    visible(newValue) {
      this.localVisible = newValue
    },
    localVisible(newValue) {
      this.$emit('update:visible', newValue)
    },
    // localReceivedAmount() {
    //   console.log('asdfadsf')
    //   this.calculateReturnAmount()
    // }
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
    },
    closeCart() {
      this.localVisible = false
    },
    removeFromCart(item) {
      this.$emit('remove-from-cart', item.variant.id)
    },
    createOrder() {
      this.$emit('create-order')
      this.closeCart()
    },
    updateItemNote(item, note) {
      this.$emit('update-note', item.variant.id, note)
    },
    increaseQuantity(item) {
      this.$emit('update-quantity', item.variant.id, item.quantity + 1)
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        this.$emit('update-quantity', item.variant.id, item.quantity - 1)
      } else {
        this.removeFromCart(item)
      }
    },
    calculateTotal() {
      const total = this.cartItems.reduce((sum, item) => 
        sum + (item.variant.price * item.quantity), 0)
      this.totalAmount = total
      return this.formatCurrency(total)
    },
    calculateReturnAmount() {
      if (this.receivedAmount !== null && this.receivedAmount - this.totalAmount >= 0) {
        return this.formatCurrency(this.receivedAmount - this.totalAmount)
      }
    },
    updateCustomerName(customerName) {
      this.$emit('update-customer-name', customerName)
    },
    updateReceivedAmount(amount) {
      this.$emit('update-received-amount', amount)
    }
  }
}
</script>

<style scoped lang="scss">
.cart-sidebar {
  background-color: #f5f5f5;
}

.order-item {
  h5 {
    font-weight: 500;
  }

  span {
    font-size: 20px;
    font-weight: 500;
  }

  .price {
    font-size: 20px;
    font-weight: 400;
  }
}

.total {
  font-size: 20px;
  font-weight: 400;
}
</style>
