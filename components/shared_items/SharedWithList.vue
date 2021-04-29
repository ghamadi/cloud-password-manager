<template>
  <div class="shared-with-list-container">
    <div class="shared-with-list-header gray-bottom-border">
      <h4 class="mb-2">Exisiting Shares:</h4>
    </div>

    <shared-with-row
      v-for="email in recepients"
      :key="email"
      :shared-with="email"
    ></shared-with-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SharedWithRow from '~/components/shared_items/SharedWithRow'

export default {
  components: {
    SharedWithRow,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      emailsToRemove: [],
    }
  },

  computed: {
    ...mapGetters({
      sharedItemsMap: 'shared_items/sharedItemsMap',
      sharingDialiog: 'dialogs/sharingDialog',
    }),
    recepients() {
      const mapEntry = this.sharedItemsMap[this.item.id]
      const original = mapEntry ? mapEntry.recepientEmails : []
      return original.filter((email) => !this.emailsToRemove.includes(email))
    },
  },

  watch: {
    sharingDialiog(value) {
      if (!value) {
        this.emailsToRemove = []
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
