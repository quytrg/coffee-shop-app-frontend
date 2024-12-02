<template>
  <div class="modify-account" v-if="checkPermission('USER_EDIT')">
    <AccountForm
      v-if="account"
      :account="account"
      @submit:account="updateAccount"
      pageTitle="Modify Account"
    />
  </div>
  <div class="modify-account" v-else>
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
  name: "ModifyAccount",
  components: {
    AccountForm,
    Unauthorized,
  },
  data() {
    return {
      account: null,
    };
  },
  methods: {
    checkPermission(permissionName) {
      return PermissionHelper.hasPermission(permissionName);
    },

    async getAccount() {
      try {
        const response = await AccountService.getOne(this.$route.params.id);
        console.log(response)
        this.account = response.data;
      } catch (error) {
        console.error("Error fetching account:", error);
        Swal.fire('Error', 'Unable to fetch account details.', 'error');
        this.$router.push({ name: "Accounts" });
      }
    },
    async updateAccount(data) {
      try {
        console.log('Updating account with data:', data);
        loadingDialogHelper("Updating account...");

        await AccountService.update(data.id, data);

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Account updated successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push({ name: "Accounts" });
        });
      } catch (error) {
        console.error("Error updating account:", error);
        Swal.close();

        let errorMessage = 'Failed to update account.';
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
    this.getAccount();
  },
};
</script>

<style scoped lang="scss">
</style>
