export const SupplyOrderStatus = Object.freeze({
  // Enum values
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
  // Display labels
  labels: {
    PENDING: 'Peding',
    CONFIRMED: 'Confirmed',
    SHIPPING: 'Shipping',
    DELIVERED: 'Delivered',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    RETURNED: 'Returned',
  },

  // UI configurations
  configs: {
      PENDING: {
          color: 'blue',
      },
      CONFIRMED: {
          color: 'cyan',
      },
      SHIPPING: {
          color: 'teal',
      },
      DELIVERED: {
          color: 'orange',
      },
      COMPLETED: {
          color: 'green',
      },
      CANCELLED: {
          color: 'deep-orange',
      },
      RETURNED: {
          color: 'red',
      }
      
  },

  // Helper methods
  getLabel(status) {
      return this.labels[status] || status;
  },

  getConfig(status) {
      return this.configs[status] || {};
  },

  toArray() {
      return Array.from(Object.keys(this)
          .filter(key => typeof this[key] === 'string')
          .map(key => ({
            label: this.labels[key],
            value: this[key]
          })));
  }
});

export const SupplyOrderSortField = Object.freeze({
  // Enum values
  ORDER_CODE: 'ORDER_CODE',
  CREATED_AT: 'CREATED_AT',
  UPDATED_AT: 'UPDATED_AT',
  TOTAL_AMOUNT: 'TOTAL_AMOUNT',
  EXPECTED_DELIVERY_DATE: 'EXPECTED_DELIVERY_DATE',
  ACTUAL_DELIVERY_DATE: 'ACTUAL_DELIVERY_DATE',

  // Display labels
  labels: {
    ORDER_CODE: 'Order Code',
    CREATED_AT: 'Date Created',
    UPDATED_AT: 'Last Modified',
    TOTAL_AMOUNT: 'Total Amount',
    EXPECTED_DELIVERY_DATE: 'Expected Delivery Date',
    ACTUAL_DELIVERY_DATE: 'Actual Delivery Date'
  },

  // UI configurations
  configs: {
    ORDER_CODE: {
        color: 'blue',
    },
    CREATED_AT: {
      color: 'gray',
    },
    UPDATED_AT: {
      color: 'gray',
    },
    TOTAL_AMOUNT: {
      color: 'indigo',
    },
    EXPECTED_DELIVERY_DATE: {
      color: 'deep-purple',
    },
    ACTUAL_DELIVERY_DATE: {
      color: 'purple',
    }
  },

  // Helper methods
  getLabel(status) {
      return this.labels[status] || status;
  },

  getConfig(status) {
      return this.configs[status] || {};
  },

  toArray() {
      return Array.from(Object.keys(this)
          .filter(key => typeof this[key] === 'string')
          .map(key => ({
            label: this.labels[key],
            value: this[key]
          })));
  }
});


