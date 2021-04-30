<template>
  <v-dialog v-model="dialog" persistent max-width="600" retain-focus>
    <dialog-base class="py-4">
      <v-form class="my-5">
        <v-text-field
          ref="password_input_field"
          v-model="password"
          color="info"
          loading
          class="password-field"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          outlined
          height="60px"
          @click:append="showPass = !showPass"
        >
          <template #progress>
            <v-progress-linear
              :value="passwordStrength.score"
              :color="passwordStrength.gaugeColor"
              background-opacity="0.2"
              :indeterminate="false"
              absolute
              height="8"
              rounded
              style="top: 51px"
            ></v-progress-linear>
          </template>

          <template #append>
            <div class="d-flex">
              <v-btn icon small class="mr-2" @click="copyPass">
                <v-icon color="info">mdi-content-copy</v-icon>
              </v-btn>

              <v-btn icon small @click="generatePass">
                <v-icon color="info">mdi-refresh</v-icon>
              </v-btn>
            </div>
          </template>
        </v-text-field>

        <v-slider
          v-model="passwordLength"
          class="align-center"
          :max="50"
          :min="0"
          hide-details
          color="primary lighten-1"
        >
          <template #append>
            <input
              v-model="passwordLength"
              class="length-input"
              hide-details
              single-line
              type="number"
              style="width: 60px"
            />
          </template>
        </v-slider>

        <v-chip-group
          v-model="selectedOptions"
          multiple
          mandatory
          column
          active-class="primary lighten-1"
        >
          <div
            :class="`${
              $vuetify.breakpoint.mobile
                ? 'chip-container'
                : 'chip-container-flex'
            } mt-5`"
          >
            <v-chip
              v-for="option in options"
              :key="option"
              filter
              :ripple="false"
            >
              {{ option }}
            </v-chip>
          </div>
        </v-chip-group>
      </v-form>
    </dialog-base>
  </v-dialog>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      showPass: false,
      options: {
        lower: 'Lowercase',
        upper: 'Uppercase',
        numbers: 'Numbers',
        symbols: 'Symbols',
      },
      selectedOptions: [0, 1, 2, 3],
      passwordLength: 10,
    }
  },
  computed: {
    ...mapGetters({
      passGenDialog: 'dialogs/passGenDialog',
      alertObject: 'dialogs/currentAlert',
      randomPass: 'pass/randomPass',
      passwordStrength: 'pass/passwordStrength',
    }),

    dialog: {
      get() {
        if (this.passGenDialog && !this.password) this.generatePass()
        return this.passGenDialog
      },
      set(value) {
        this.setDialog(value)
      },
    },

    password: {
      get() {
        return this.randomPass
      },
      set(value) {
        this.setRandomPass(value)
      },
    },
  },

  watch: {
    passwordLength() {
      this.generatePass()
    },
    selectedOptions() {
      this.generatePass()
    },
  },

  methods: {
    ...mapActions({ generateRandomPass: 'pass/generateRandomPass' }),
    ...mapMutations({
      setDialog: 'dialogs/SET_PASS_GEN_DIALOG',
      setRandomPass: 'pass/SET_RANDOM_PASS',
    }),

    generatePass() {
      const allowedChars = {}
      const options = Object.keys(this.options)

      this.selectedOptions.forEach((val) => {
        allowedChars[options[val]] = true
      })
      this.generateRandomPass({ length: this.passwordLength, allowedChars })
    },

    copyPass() {
      const txt = this.$refs.password_input_field.$el.querySelector('input')
      txt.select()
      document.execCommand('copy')
    },
  },
}
</script>
<style scoped>
.password-field >>> input {
  font-size: 1.4em;
  text-overflow: ellipsis;
}

.length-input {
  border: 2px solid #d12e2ec4;
  border-radius: 5px;
  text-align: center;
  height: 40px;
  padding: 5px;
}

.chip-container-flex {
  display: flex;
  justify-content: center;
  width: 100%;
}

.chip-container {
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  column-gap: 10px;
  row-gap: 5px;
}
</style>
