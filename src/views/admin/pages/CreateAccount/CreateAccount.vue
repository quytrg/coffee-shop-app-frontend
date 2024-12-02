<template>
  <div class="create-account" v-if="checkPermission('USER_CREATE')">
    <AccountForm
      :account="account"
      @submit:account="createAccount"
      pageTitle="Add Account"
    />
  </div>
  <div class="create-account" v-else>
    <Unauthorized />
  </div>
</template>

<script>
import AccountForm from '@/components/admin/AccountForm/AccountForm.vue';
import AccountService from '@/services/admin/account.service.js';
import Swal from 'sweetalert2';
import loadingDialogHelper from '@/helpers/admin/dialogs/loading.helper';
import Unauthorized from '@/components/admin/Unauthorized/Unauthorized.vue';
import { PermissionHelper } from '@/helpers/admin/auth/permission.helper';

export default {
  name: "CreateAccount",
  components: {
    AccountForm,
    Unauthorized,
  },
  data() {
    return {
      account: {
      },
    };
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName);
    },
    async createAccount(data) {
      try {
        console.log('Creating account with data:', data);
        loadingDialogHelper("Creating account...");

        await AccountService.create(data);

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Account created successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "Accounts" });
        });
      } catch (error) {
        console.error("Error creating account:", error);
        Swal.close();

        let errorMessage = 'Failed to create account.';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonText: 'OK',
        });
      }
    }
  },
  created() {
  },
};
</script>

<style scoped lang="scss">
</style>
