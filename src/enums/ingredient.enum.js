export const IngredientSortField = Object.freeze({
  // Enum values
  NAME: 'NAME',
  CREATED_AT: 'CREATED_AT',
  UPDATED_AT: 'UPDATED_AT',

  // Display labels
  labels: {
    NAME: 'Product Name',
    CREATED_AT: 'Date Created',
    UPDATED_AT: 'Last Modified',
  },

  // UI configurations
  configs: {
    NAME: {
        color: 'blue',
    },
    CREATED_AT: {
      color: 'gray',
    },
    UPDATED_AT: {
      color: 'gray',
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