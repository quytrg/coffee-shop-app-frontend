export const OrderStatus = Object.freeze({
  // Enum values
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  // Display labels
  labels: {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  },

  // UI configurations
  configs: {
      PENDING: {
          color: 'blue',
      },
      COMPLETED: {
          color: 'green',
      },
      CANCELLED: {
          color: 'deep-orange',
      },
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

export const OrderSortField = Object.freeze({
  // Enum values
  CUSTOMER_NAME: 'CUSTOMER_NAME',
  ORDER_CODE: 'ORDER_CODE',
  CREATED_AT: 'CREATED_AT',
  UPDATED_AT: 'UPDATED_AT',
  STATUS: 'STATUS',
  TOTAL_AMOUNT: 'TOTAL_AMOUNT',
  RECEIVED_AMOUNT: 'RECEIVED_AMOUNT',
  RETURN_AMOUNT: 'RETURN_AMOUNT',

  // Display labels
  labels: {
    CUSTOMER_NAME: 'Customer Name',
    ORDER_CODE: 'Order Code',
    CREATED_AT: 'Date Created',
    UPDATED_AT: 'Last Modified',
    STATUS: 'Status',
    TOTAL_AMOUNT: 'Total Amount',
    RECEIVED_AMOUNT: 'Received Amount',
    RETURN_AMOUNT: 'Return Amount'
  },

  // UI configurations
  configs: {
    
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


