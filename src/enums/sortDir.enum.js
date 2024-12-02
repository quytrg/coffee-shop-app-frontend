export const SortDirection = Object.freeze({
  // Enum values
  ASC: 'ASC',
  DESC: 'DESC',

  // Display labels
  labels: {
    ASC: 'Ascending', 
    DESC: 'Descending',
  },

  // UI configurations
  configs: {
    ASC: {
      icon: '↑',
      ariaLabel: 'Sort ascending',
    },
    DESC: {
      icon: '↓', 
      ariaLabel: 'Sort descending',
    },
  },

  // Helper methods
  getLabel(direction) {
    return this.labels[direction] || direction;
  },

  getConfig(direction) {
    return this.configs[direction] || {};
  },

  toggle(currentDirection) {
    return currentDirection === this.ASC ? this.DESC : this.ASC;
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
