import { useAuthStore } from '@/stores/admin/auth.store'

export class PermissionHelper {
  /**
   * Get the current account from the auth store
   * @returns {Object} - The current account object
   */
  static getCurrentAccount() {
    const authStore = useAuthStore()
    return authStore.currentAccount
  }

  /**
   * Check if the current user has the specified permission
   * @param {String} permissionName - The name of the permission to check
   * @returns {Boolean} - Whether the current user has the specified permission
   */
  static hasPermission(permissionName) {
    const account = this.getCurrentAccount()
    if (!account?.data?.permissions) {
      return false;
    }
    
    return account.data.permissions.some(permission => permission.name === permissionName);
  }

  /**
   * Check if the current user has all of the specified permissions
   * @param {String[]} permissionNames - Array of permission names to check
   * @returns {Boolean} - Whether the current user has all specified permissions
   */
  static hasAllPermissions(permissionNames) {
    return permissionNames.every(permission => this.hasPermission(permission));
  }

  /**
   * Check if the current user has any of the specified permissions
   * @param {String[]} permissionNames - Array of permission names to check
   * @returns {Boolean} - Whether the current user has any of the specified permissions
   */
  static hasAnyPermission(permissionNames) {
    return permissionNames.some(permission => this.hasPermission(permission));
  }
}
