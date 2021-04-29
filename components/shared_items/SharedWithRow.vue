<template>
  <div
    class="row-container gray-bottom-border highlight-on-hover d-flex align-center justify-space-between"
    role="row"
    @mouseover="actions = true"
    @mouseout="actions = false"
  >
    <div :class="emailDivClass">{{ sharedWith }}</div>

    <div v-show="actions" class="row-buttons">
      <v-btn
        :ripple="false"
        light
        icon
        small
        class="semi-squared mr-1"
        @click="toggleInvitation(sharedWith)"
      >
        <v-icon v-if="!invitationCanceled">mdi-close-box</v-icon>
        <v-icon v-else>mdi-plus-box</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    sharedWith: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      actions: false,
      invitationCanceled: false,
    }
  },

  computed: {
    ...mapGetters({ dialog: 'dialogs/sharingDialog' }),
    emailDivClass() {
      return this.invitationCanceled ? 'text-decoration-line-through' : ''
    },
  },

  watch: {
    dialog(value) {
      if (!value) {
        this.invitationCanceled = false
      }
    },
  },

  methods: {
    ...mapMutations({
      removeEmail: 'shared_items/ADD_RECEPIENT_TO_REMOVE',
      addEmail: 'shared_items/TAKE_OUT_RECEPIENT_TO_REMOVE',
    }),

    toggleInvitation(email) {
      if (!this.invitationCanceled) this.removeEmail(email)
      else this.addEmail(email)
      this.invitationCanceled = !this.invitationCanceled
    },
  },
}
</script>
<style lang="scss">
.row-container {
  height: 40px;
  font-size: 0.85em;

  .row-header {
    width: 100%;
  }
}
</style>
