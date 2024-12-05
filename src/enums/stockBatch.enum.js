export const StockBatchSortField = Object.freeze({
  // Enum values
  ID: 'ID',
  INGREDIENT_NAME: 'INGREDIENT_NAME',
  REMAINING_QUANTITY: 'REMAINING_QUANTITY',
  RECEIVED_DATE: 'RECEIVED_DATE',
  EXPIRATION_DATE: 'EXPIRATION_DATE',
  SUPPLIER_NAME: 'SUPPLIER_NAME',
  CREATED_AT: 'CREATED_AT',
  UPDATED_AT: 'UPDATED_AT',

  // Display labels
  labels: {
    ID: 'Id',
    INGREDIENT_NAME: 'Ingredient Name',
    REMAINING_QUANTITY: 'Remaining Quantity',
    RECEIVED_DATE: 'Received Date',
    EXPIRATION_DATE: 'Expiration Date',
    SUPPLIER_NAME: 'Supplier Name',
    CREATED_AT: 'Created At',
    UPDATED_AT: 'Updated At',
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


