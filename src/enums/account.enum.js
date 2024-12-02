export const AccountStatus = Object.freeze({
  // Enum values
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',

  // Display labels
  labels: {
      ACTIVE: 'Active',
      INACTIVE: 'Inactive',
  },

  // UI configurations
  configs: {
      ACTIVE: {
          color: 'green',
      },
      INACTIVE: {
          color: 'red',
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


export const AccountSortField = Object.freeze({
  // Enum values
  FULL_NAME: 'FULL_NAME',
  CREATED_AT: 'CREATED_AT',
  UPDATED_AT: 'UPDATED_AT',

  // Display labels
  labels: {
    FULL_NAME: 'Full Name',
    CREATED_AT: 'Date Created',
    UPDATED_AT: 'Last Modified',
  },

  // UI configurations
  configs: {
    FULL_NAME: {
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
