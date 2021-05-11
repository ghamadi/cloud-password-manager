<template>
  <v-container class="auth-page">
    <v-row class="form-container" justify="center" align="center">
      <v-card :flat="mobileScreen" width="100%" max-width="600px">
        <div
          :class="`text-${mobileScreen ? 'center' : 'right'} mr-3 mb-5 mt-2`"
        >
          <link-button @click.native="toggleRegistration">
            {{ registration ? 'Existing User? Sign in' : 'New? Sign up here' }}
          </link-button>
        </div>
        <v-card-title class="logo font-weight-black primary--text">
          CPass
        </v-card-title>
        <v-card-text>
          <v-form
            ref="auth_form"
            :disabled="loading"
            @submit.prevent="submitForm"
          >
            <p
              v-if="badCredentials || unverifiedUser"
              class="info--text text-center mt-9 mb-5 d-flex align-center justify-center"
            >
              <span>{{ badCredentials || unverifiedUser }}</span>
              <link-button
                v-if="unverifiedUser"
                underline
                letter-case="lowercase"
                class="font-italic"
                @click.native="resend(currentUser.id)"
              >
                resend email
              </link-button>
            </p>
            <v-expand-transition>
              <div v-show="registration">
                <v-text-field
                  v-model="fullName"
                  validate-on-blur
                  :rules="registration ? [$rules.required] : []"
                  color="info"
                  label="Name"
                ></v-text-field>
              </div>
            </v-expand-transition>
            <v-text-field
              v-model="email"
              validate-on-blur
              :rules="[$rules.required, $rules.email]"
              color="info"
              label="Email"
            ></v-text-field>
            <v-text-field
              v-model="password"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              validate-on-blur
              :rules="[$rules.required, $rules.min(10)]"
              color="info"
              label="Password"
              @click:append="showPass = !showPass"
            ></v-text-field>

            <div
              v-if="!mobileScreen"
              style="width: 100%"
              class="d-flex justify-space-between align-center mt-4"
            >
              <v-btn
                type="submit"
                color="primary"
                rounded
                x-large
                :width="registration ? '100%' : '60%'"
                class="slow-expansion"
              >
                {{ registration ? 'Create Account' : 'Sign in' }}
              </v-btn>
              <link-button v-show="showResetBtn"> Reset password </link-button>
            </div>

            <div v-else style="width: 100%" class="d-flex flex-column mt-4">
              <v-btn
                type="submit"
                color="primary"
                rounded
                x-large
                class="slow-expansion"
              >
                {{ registration ? 'Create Account' : 'Sign in' }}
              </v-btn>
              <link-button v-show="showResetBtn" class="mt-md-0 mt-5">
                Reset password
              </link-button>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  layout: 'auth',
  data() {
    return {
      badCredentials: null,
      unverifiedUser: null,
      registration: false,
      showResetBtn: true,
      fullName: null,
      email: null,
      password: '',
      showPass: false,
      loading: false,
    }
  },

  computed: {
    ...mapGetters({ currentUser: 'auth/currentUser' }),
    mobileScreen() {
      return !this.$vuetify.breakpoint.smAndUp
    },
  },

  watch: {
    registration(newValue, oldValue) {
      const x = this.$vuetify.breakpoint.smAndUp ? 200 : 0
      setTimeout(
        () => {
          this.showResetBtn = oldValue
        },
        newValue ? 0 : x
      )
    },
  },

  methods: {
    ...mapActions({
      register: 'auth/register',
      login: 'auth/login',
      resendEmail: 'auth/sendVerificationEmail',
    }),

    toggleRegistration() {
      this.$refs.auth_form.resetValidation()
      this.registration = !this.registration
    },

    async submitForm() {
      this.badCredentials = null
      this.unverifiedUser = null
      if (this.$refs.auth_form.validate()) {
        const data = {
          displayName: this.fullName,
          email: this.email,
          password: this.password,
        }
        if (this.registration) this.register(data)
        else {
          try {
            this.loading = true
            const response = await this.login(data)
            if (!response.user.emailVerified) {
              this.unverifiedUser = 'Please verify your email first.'
            } else {
              this.$router.replace('/')
            }
          } catch (error) {
            if (error.code.match(/(user-not-found)|(wrong-password)/i)) {
              this.badCredentials =
                'Incorrect email or password. Please try again.'
            } else {
              this.badCredentials = error.message
            }
          } finally {
            this.loading = false
          }
        }
        if (this.registration) {
          this.$refs.auth_form.reset()
          this.registration = false
        }
      }
    },

    async resend(userID) {
      this.loading = true
      this.unverifiedUser = false
      this.badCredentials = false
      try {
        await this.resendEmail()
      } catch (error) {
        this.badCredentials = error.message
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss">
.auth-page {
  .form-container {
    height: 80vh;

    .logo {
      font-size: 3em;
    }
  }

  .slow-expansion {
    transition: width 300ms;
  }
}
</style>
