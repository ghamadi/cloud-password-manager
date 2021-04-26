<template>
  <v-dialog v-model="dialog" persistent max-width="500" retain-focus>
    <dialog-base>
      <slot> {{ alertObject.message }}</slot>
    </dialog-base>
  </v-dialog>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      alertDialog: 'dialogs/alertDialog',
      alertObject: 'dialogs/currentAlert',
    }),

    dialog: {
      get() {
        return this.alertDialog
      },
      set(value) {
        this.setDialog(value)
      },
    },
  },

  methods: {
    ...mapMutations({ setDialog: 'dialogs/SET_ALERT_DIALOG' }),
  },
}
</script>
