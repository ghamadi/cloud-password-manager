<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <dialog-base>
      <v-form ref="password_change_form">
        <v-text-field
          v-model="currentPass"
          label="Current password"
          color="info"
          outlined
          validate-on-blur
          :type="showCurrentPass ? 'text' : 'password'"
          :rules="[$rules.required, $rules.min(10)]"
          :append-icon="showCurrentPass ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showCurrentPass = !showCurrentPass"
        ></v-text-field>

        <v-text-field
          v-model="newPass"
          label="New password"
          color="info"
          outlined
          validate-on-blur
          :type="showNewPass ? 'text' : 'password'"
          :rules="[$rules.required]"
          :append-icon="showNewPass ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showNewPass = !showNewPass"
        ></v-text-field>

        <v-text-field
          v-model="repeatedPass"
          label="Verify password"
          color="info"
          outlined
          validate-on-blur
          :type="showVerifiedPass ? 'text' : 'password'"
          :rules="[$rules.required, matchingPass]"
          :append-icon="showVerifiedPass ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showVerifiedPass = !showVerifiedPass"
        ></v-text-field>
      </v-form>
    </dialog-base>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import KeyGen from '~/lib/security/key_gen'

export default {
  data() {
    return {
      currentPass: null,
      newPass: null,
      repeatedPass: null,
      showCurrentPass: false,
      showNewPass: false,
      showVerifiedPass: false,
    }
  },

  computed: {
    ...mapGetters({
      passwordDialog: 'dialogs/passwordDialog',
      alertObject: 'dialogs/currentAlert',
      keyGen: 'auth/keyGen',
    }),

    matchingPass() {
      return this.repeatedPass === this.newPass || "Passwords don't match"
    },

    dialog: {
      get() {
        return this.passwordDialog
      },
      set(value) {
        const form = this.$refs.password_change_form
        if (form) form.reset()
        this.setPasswordDialog(value)
      },
    },
  },

  created() {
    this.$root.$on('submitChangePassForm', this.submitForm)
    this.$root.$on('closeChangePassForm', () => {
      const form = this.$refs.password_change_form
      if (form) form.reset()
      this.showCurrentPass = false
      this.showNewPass = false
      this.showVerifiedPass = false
    })
  },

  methods: {
    ...mapActions({
      reEncryptVault: 'items/reEncryptVault',
      reEnryptSharedItems: 'shared_items/reEnryptSharedItems',
      reEncryptSharedWithMe: 'shared_with_me/reEncryptSharedWithMeItems',
      updatePublicKey: 'auth/updatePublicKey',
    }),
    ...mapMutations({
      setPasswordDialog: 'dialogs/SET_PASSWORD_DIALOG',
      setLoading: 'SET_LOADING',
      setKeyGen: 'auth/SET_KEY_GEN',
      setSnackbarObject: 'SET_SNACKBAR_OBJECT',
      setSnackbar: 'SET_SNACKBAR',
    }),

    submitForm() {
      if (this.$refs.password_change_form.validate()) {
        this.setLoading(true)
        const user = firebase.auth().currentUser
        const keyGen = new KeyGen(user.email, this.currentPass)

        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          keyGen.authKey
        )

        user
          .reauthenticateWithCredential(credential)
          .then(async () => {
            const oldKeyGen = new KeyGen(user.email, this.currentPass)
            const newKeyGen = new KeyGen(user.email, this.newPass)

            await user.updatePassword(newKeyGen.authKey)
            this.setKeyGen(newKeyGen)
            await this.updatePublicKey(newKeyGen.publicKey.toString())
            await this.reEnryptSharedItems(oldKeyGen.vaultKey)
            await this.reEncryptSharedWithMe(oldKeyGen.vaultKey)
            await this.reEncryptVault(oldKeyGen.vaultKey)

            this.$refs.password_change_form.reset()
            this.dialog = false
          })
          .catch((e) => {
            if (e.code === 'auth/wrong-password') {
              this.setSnackbarObject({
                message: 'Incorrect password. Please try again.',
                top: true,
                timeout: 4000,
              })
            } else {
              this.setSnackbarObject({
                message: e.message,
                top: true,
                timeout: 4000,
              })
            }
            this.setSnackbar(true)
          })
          .finally(() => this.setLoading(false))
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
