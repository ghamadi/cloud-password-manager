<template>
  <v-btn
    dark
    fab
    fixed
    bottom
    right
    color="primary"
    class="share-item-fab mr-10 mb-8"
    @click.stop="openSharingDialog"
  >
    <v-tooltip top activator=".share-item-fab">
      <span> Add shared items </span>
    </v-tooltip>

    <v-icon> mdi-plus </v-icon>
  </v-btn>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations({
      setCurrentAlert: 'dialogs/SET_CURRENT_ALERT',
      setSharingDialog: 'dialogs/SET_SHARING_DIALOG',
      setSharingMode: 'shared_items/SET_SHARING_MODE',
    }),
    openSharingDialog() {
      const okHandler = () => this.$root.$emit('submitSharingForm')

      const cancelHandler = () => {
        this.setSharingDialog(false)
      }

      const ok = new this.$models.OkButton(okHandler)
      const cancel = new this.$models.CancelButton(cancelHandler)
      const alert = new this.$models.AlertObject({
        actions: [ok, cancel],
      })

      this.setSharingMode(this.$sharingMode.ManyToMany)
      this.setCurrentAlert(alert)
      this.setSharingDialog(true)
    },
  },
}
</script>

<style lang="scss" scoped></style>
