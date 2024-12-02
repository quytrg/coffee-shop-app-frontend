<template>
  <div class="header-wrapper fluid-container">
    <div class="d-flex justify-content-end p-2">
      <v-menu
        min-width="200px"
        rounded
      >
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-menu-down"
            size="small"
            variant="text"
            v-bind="props"
          ></v-btn>
          <v-btn
            icon
            v-bind="props"
            size="small"
          >
            <v-avatar>
              <v-img
                alt="John"
                :src="currentAccount?.data?.images[0].url ? currentAccount.data.images[0].url: '/avatar.jpg'"
              ></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-card class="mt-1">
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar>
                <v-img
                  alt=""
                  :src="currentAccount?.data?.images[0].url ? currentAccount.data.images[0].url: '/avatar.jpg'"
                ></v-img>
              </v-avatar>
              <h4 class="mt-1">{{ currentAccount?.data.fullName }}</h4>
              <p class="text-caption mt-1">
                {{ currentAccount?.data.phoneNumber }}
              </p>
              <p class="text-caption mt-1">
                {{ currentAccount?.data.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                variant="text"
                rounded
              >
                Edit Account
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn
                variant="text"
                rounded
                @click="handleLogout"
              >
                Log out
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/admin/auth.store'
import authService from '@/services/admin/auth.service.js'

export default {
  name: "Header",
  props: {
    tilte: {
      type: String,
      default: "Dashboard",
    },
  },
  data() {
    return {
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
  },
};
</script>

<style scoped lang="scss">
  @import '@/assets/styles/variable.scss';
  .header-wrapper {
    background-color: #D7CCC8;
    h4 {
      color: $white;
      text-transform: capitalize;
    }

    a:visited {
      color: $white;
    }
  }
</style>
