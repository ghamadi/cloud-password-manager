<template>
  <v-dialog v-model="dialog" persistent max-width="800" retain-focus>
    <dialog-base class="px-2 pb-2">
      <v-form>
        <v-row style="height: 400px">
          <v-col cols="6">
            <v-combobox
              v-model="emails"
              :filter="filter"
              hide-selected
              label="Recepient Email Addresses"
              multiple
              small-chips
              outlined
              :rules="[$rules.nonEmptyList, $rules.emailsList]"
              autofocus
              color="info"
              class="mb-5"
              deletable-chips
              item-color="primary"
            >
              <template #selection="data">
                <v-chip
                  :key="JSON.stringify(data.item)"
                  v-bind="data.attrs"
                  small
                  pill
                  color="primary lighten-1"
                  close-icon="mdi-close-circle"
                  close
                  @click:close="data.parent.selectItem(data.item)"
                >
                  {{ data.item }}
                </v-chip>
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="6">
            <v-autocomplete
              v-model="itemsToShare"
              :filter="filter"
              :items="items"
              item-value="id"
              item-text="title"
              hide-selected
              label="Items to share"
              multiple
              small-chips
              outlined
              validate-on-blur
              :rules="[$rules.required]"
              color="info"
              auto
              :menu-props="{ offsetY: true }"
              deletable-chips
            >
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-form>
    </dialog-base>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      items: 'items/itemsList',
      sharingDialog: 'dialogs/sharingDialog',
      itemsToShareList: 'shared_items/itemsToShare',
      recepientEmails: 'shared_items/recepientEmails',
      sharedItemsMap: 'shared_items/sharedItemsMap',
    }),

    dialog: {
      get() {
        return this.sharingDialog
      },
      set(value) {
        this.setSharingDialog(value)
      },
    },

    itemsToShare: {
      get() {
        return this.itemsToShareList
      },
      set(value) {
        this.setItemsToShareList(value)
      },
    },

    emails: {
      get() {
        return this.recepientEmails
      },
      set(value) {
        this.setRecepientEmails(value)
      },
    },
  },

  methods: {
    ...mapMutations({
      setSharingDialog: 'dialogs/SET_SHARING_DIALOG',
      setItemsToShareList: 'shared_items/SET_ITEMS_TO_SHARE',
      setRecepientEmails: 'shared_items/SET_RECEPIENT_EMAILS',
    }),
    filter(item, queryText, itemText) {
      if (item.header) return false

      const hasValue = (val) => (val != null ? val : '')

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return text
        .toString()
        .toLowerCase()
        .includes(query.toString().toLowerCase())
    },
  },
}
</script>

<style lang="scss" scoped></style>
