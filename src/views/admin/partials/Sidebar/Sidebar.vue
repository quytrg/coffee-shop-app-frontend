<template>
  <VueSidebarMenuAkahon 
    :isUsedVueRouter="true"
    menuTitle="24Insight"
    menuIcon="bxs-coffee-togo"
    bgColor="#FFFFFF"
    secondaryColor="#D7CCC8"
    logoTitleColor="#6D4C41"
    iconsColor="#6D4C41"
    menuItemsTextColor="#6D4C41"
    searchInputTextColor="#6D4C41"
    menuFooterTextColor="#6D4C41"
    menuItemsHoverColor="#D7CCC8"
    :menuItems="menuItems"
    :profileName="currentAccount?.data.fullName"
    :profileRole="currentAccount?.data?.role.name"
    :profileImg="currentAccount?.data?.images[0].url"
    @button-exit-clicked="handleLogout"
  />
</template>

<script>
import VueSidebarMenuAkahon from "vue-sidebar-menu-akahon";
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/admin/auth.store'
import authService from '@/services/admin/auth.service.js'


export default {
  name: "Sidebar",
  components: { VueSidebarMenuAkahon },
  data() {
    return {
      menuItems: [
        { link: { name: 'Dashboard' }, name: 'Dashboard', tooltip: 'Dashboard', icon: 'bx bxs-dashboard' },
        { link: { name: 'ProductsAdmin' }, name: 'Products', tooltip: 'Products', icon: 'bxl-dropbox' },
        { link: { name: 'Categories' }, name: 'Categories', tooltip: 'Categories', icon: 'bx bx-collection' },
        { link: { name: 'Ingredients' }, name: 'Ingredients', tooltip: 'Ingredients', icon: 'bx bxs-shapes' },
        { link: { name: 'SupplyOrders' }, name: 'Supply Orders', tooltip: 'Supply Orders', icon: 'bx bx-basket' },
        { link: { name: 'Suppliers' }, name: 'Suppliers', tooltip: 'Suppliers', icon: 'bx bxs-store' },
        { link: { name: 'Accounts' }, name: 'Accounts', tooltip: 'Accounts', icon: 'bx-user' },
        { link: { name: 'Roles' }, name: 'Roles', tooltip: 'Roles', icon: 'bx bxs-user-account' },
        { link: { name: 'Permissions' }, name: 'Permissions', tooltip: 'Permissions', icon: 'bx bx-lock' },
        { link: { name: 'Orders' }, name: 'Orders', tooltip: 'Orders', icon: 'bx-cart-alt' },
        { link: { name: 'Dashboard' }, name: 'Setting', tooltip: 'Setting', icon: 'bx-cog' },
      ],
    }
  },
  methods: {
    async handleLogout() {
      await authService.logout()
      this.$router.push({ name: 'AdminLogin'})
      location.reload()
    }
  },
  computed: {
    ...mapState(useAuthStore, ['currentAccount'])
  }
};
</script>

<style scoped lang="scss">
</style>
