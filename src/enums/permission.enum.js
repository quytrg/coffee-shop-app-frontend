export const PermissionSortField = Object.freeze({
  // Enum values
  NAME: 'NAME',

  // Display labels
  labels: {
    NAME: 'Category Name',
  },

  // UI configurations
  configs: {
    NAME: {
        color: 'blue',
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
