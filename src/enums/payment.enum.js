export const PaymentMethod = Object.freeze({
  // Enum values
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CREDIT: 'CREDIT',
  E_WALLET: 'E_WALLET',
  // Display labels
  labels: {
    CASH: 'Cash',
    BANK_TRANSFER: 'Bank Transfer',
    CREDIT: 'Credit',
    E_WALLET: 'e-Wallet',
  },

  // UI configurations
  configs: {
      CASH: {
          color: 'green',
      },
      BANK_TRANSFER: {
          color: 'light-green',
      },
      CREDIT: {
          color: 'lime',
      },
      E_WALLET: {
          color: 'yellow',
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


export const PaymentStatus = Object.freeze({
  // Enum values
  UNPAID: 'UNPAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'UPDATPAIDED_AT',
  OVERDUE: 'OVERDUE',
  REFUNDED: 'REFUNDED',

  // Display labels
  labels: {
    UNPAID: 'Unpaid',
    PARTIALLY_PAID: 'Partially Paid',
    PAID: 'Paid',
    OVERDUE: 'Overdue',
    REFUNDED: 'Refunded',
  },

  // UI configurations
  configs: {
    UNPAID: {
        color: 'blue',
    },
    PARTIALLY_PAID: {
      color: 'indigo',
    },
    PAID: {
      color: 'deep-purple',
    },
    OVERDUE: {
      color: 'purple',
    },
    REFUNDED: {
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
