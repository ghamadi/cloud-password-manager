<template>
  <v-snackbar
    v-model="snackbar"
    :top="snackbarObject.top"
    :timeout="snackbarObject.timeout"
    :color="snackbarObject.color"
    :multi-line="snackbarObject.multiLine"
  >
    {{ snackbarObject.message }}
    <template #action="{ attrs }">
      <v-btn
        :color="snackbarObject.actionColor || 'warning'"
        icon
        small
        dark
        v-bind="attrs"
        @click="snackbar = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      showSnackbar: 'snackbar',
      snackbarObject: 'snackbarObject',
    }),
    snackbar: {
      get() {
        return this.showSnackbar
      },
      set(value) {
        this.setSnackbar(value)
      },
    },
  },

  methods: {
    ...mapMutations({ setSnackbar: 'SET_SNACKBAR' }),
  },
}
</script>

<style lang="scss" scoped></style>
