export const MeasurementUnit = Object.freeze({
  // Enum values
  GRAM: 'GRAM',
  KILOGRAM: 'KILOGRAM',
  MILLILITER: 'MILLILITER',
  LITER: 'LITER',

  // Display labels
  labels: {
    GRAM: 'Gram',
    KILOGRAM: 'Kilogram',
    MILLILITER: 'Milliliter',
    LITER: 'Liter',
  },

  // UI configurations
  configs: {
      GRAM: {
          color: 'teal',
      },
      KILOGRAM: {
          color: 'teal',
      },
      MILLILITER: {
          color: 'cyan',
      },
      LITER: {
          color: 'cyan',
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
