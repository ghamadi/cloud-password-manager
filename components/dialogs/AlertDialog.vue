<template>
  <v-dialog v-model="dialog" persistent max-width="500" retain-focus>
    <v-card>
      <v-card-title style="font-size: 1em">
        {{ alertObject.title }}
      </v-card-title>
      <v-card-text class="pb-0 font-weight-light">
        <slot> {{ alertObject.message }}</slot>
      </v-card-text>
      <v-card-actions v-if="alertObject.actions">
        <v-row style="width: 100%" class="py-0 my-0">
          <v-col
            v-for="(action, index) in alertObject.actions"
            :key="index"
            :cols="12 / (alertObject.actions && alertObject.actions.length)"
          >
            <v-btn
              width="100%"
              :color="action.color"
              :class="action.class || ''"
              :text="action.style.text"
              :outlined="action.style.outlined"
              :depressed="action.style.depressed"
              :dark="action.style.dark"
              @click="action.handler"
            >
              {{ action.label }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
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
