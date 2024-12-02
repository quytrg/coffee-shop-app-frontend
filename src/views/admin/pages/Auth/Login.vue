<template>
  <div class="container py-5">
    <div class="row justify-content-center align-items-center">
      <div class="authentication position-relative col-12 col-md-7 col-sm-10">
        <div class="authentication-wrapper">
          <v-form fast-fail validate-on="submit lazy" @submit.prevent="handleSubmit">
            <div>
              <v-card
                class="mx-auto pa-12 pb-8"
                elevation="8"
                max-width="448"
                rounded="lg"
              >
                <div class="d-flex justify-content-center align-items-center mb-7 mx-3">
                  <img 
                    src="/favicon.png" 
                    alt="logo"
                    style="
                      width: 48px;
                      aspect-ratio: 1/1;
                      object-fit: cover;
                    "
                  >
                  <v-card-title class="text-h4 text-grey-darken-2 ps-2">
                    24 Insight
                  </v-card-title>
                </div>
                <v-text-field
                  v-model="phoneNumber"
                  label="Phone Number"
                  placeholder="4134121822"
                  prepend-inner-icon="mdi-phone-dial-outline"
                  variant="outlined"
                  color="brown-lighten-1"
                  :rules="phoneNumberRules"
                ></v-text-field>

                <div
                  class="d-flex align-center justify-end"
                >
                  <a
                    class="text-decoration-none text-brown-lighten-1 text-subtitle-1"
                    href="#"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Forgot password?
                  </a>
                </div>

                <v-text-field
                  v-model="password"
                  :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'" 
                  :type="visible ? 'text' : 'password'"
                  label="Password"
                  placeholder="..............."
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  color="brown-lighten-1"
                  @click:append-inner="visible = !visible"
                  :rules="passwordRules"
                ></v-text-field>

                <v-card class="mb-8 mt-3" color="surface-variant" variant="tonal">
                  <v-card-text class="text-medium-emphasis text-caption">
                    Warning: After 3 consecutive failed login attempts, you account
                    will be temporarily locked for three hours. If you must login
                    now, you can also click "Forgot login password?" below to reset
                    the login password.
                  </v-card-text>
                </v-card>

                <v-btn block class="mb-5" color="brown-lighten-1" size="large" variant="elevated" :loading="loading" type="submit">
                  Log In
                </v-btn>
              </v-card>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/admin/auth.service";
import { mapActions } from 'pinia'
import { useAuthStore } from '@/stores/admin/auth.store'

export default {
  name: "AdminLogin",
  components: {
  },
  props: {},
  data: (vm) => {
    return {
      phoneNumber: '1101262112',
      phoneNumberRules: [
        value => {
          if (value) return true
          return 'Phone number is requred.'
        },
        value => {
          if (/^[0-9\-\+]{9,15}$/.test(value)) return true
          return 'Phone number must be valid.'
        },
        value => vm.login(value)
      ],
      password: 'password123',
      passwordRules: [
        value => {
          if (value) return true
          return 'Password is requred.'
        },
      ],
      visible: false,
      loading: false,
    };
  },
  methods: {
    async handleSubmit(event) {
      this.loading = true
      await event
      this.loading = false
    },
    async login() {
      try {
        this.loginStart()
        
        await AuthService.login({
          phoneNumber: this.phoneNumber,
          password: this.password
        })

        const response = await AuthService.getAuth()
        
        this.loginSuccess(response)
        this.$router.push({ name: 'Dashboard' })
        return true 
        
      } catch (err) {
        this.loginFailed()

        if (err.response && err.response.status === 403) {
          return "Account is locked"
        }
        return "Wrong phone number or password"
      }
    },
    ...mapActions(useAuthStore, ['loginStart', 'loginSuccess', 'loginFailed']),
  },
  computed: {
  }
};
</script>

<style scoped lang="scss">
  .container {
    height: 100vh;
    .row {
      height: 100%;
    }
  }

  
  .authentication-wrapper:before {
    width: 238px;
    height: 233px;
    content: " ";
    position: absolute;
    top: -85px;
    left: 10px;
    background-image: url('/login-background-before.svg');
  }

  .authentication-wrapper:after {
    width: 180px;
    height: 180px;
    content: " ";
    position: absolute;
    z-index: -1;
    bottom: -70px;
    right: 30px;
    background-image: url('/login-background-after.svg');
  }

</style>
