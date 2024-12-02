export const ProductStatus = Object.freeze({
  // Enum values
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',

  // Display labels
  labels: {
      ACTIVE: 'Active',
      INACTIVE: 'Inactive',
      OUT_OF_STOCK: 'Out of stock',
  },

  // UI configurations
  configs: {
      ACTIVE: {
          color: 'green',
      },
      INACTIVE: {
          color: 'red',
      },
      OUT_OF_STOCK: {
        color: 'orange',
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


export const ProductSortField = Object.freeze({
  // Enum values
  NAME: 'NAME',
  POSITION: 'POSITION',
  CREATED_AT: 'CREATED_AT',
  UPDATED_AT: 'UPDATED_AT',

  // Display labels
  labels: {
    NAME: 'Product Name',
    POSITION: 'Display Order',
    CREATED_AT: 'Date Created',
    UPDATED_AT: 'Last Modified',
  },

  // UI configurations
  configs: {
    NAME: {
        color: 'blue',
    },
    POSITION: {
        color: 'purple',
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

export const ProductSize = Object.freeze({
  // Enum values
  S: 'S',
  M: 'M',
  L: 'L',

  // Display labels
  labels: {
    S: 'Small',
    M: 'Medium',
    L: 'Large',
  },

  // UI configurations
  configs: {
      S: {
          color: 'teal',
      },
      M: {
          color: 'cyan',
      },
      L: {
        color: 'pink',
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
