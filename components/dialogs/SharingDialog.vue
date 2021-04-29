<template>
  <v-dialog v-model="dialog" persistent max-width="800" retain-focus>
    <dialog-base class="px-2 pb-2">
      <v-form ref="sharing_form">
        <v-row style="height: 400px" justify="start">
          <v-col cols="5">
            <h4 class="mb-3 gray-bottom-border pb-2">
              Recepient Email Addresses:
            </h4>
            <v-combobox
              v-model="emails"
              :filter="filter"
              hide-selected
              dense
              multiple
              small-chips
              outlined
              :rules="[$rules.emailsList]"
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
          <v-col cols="auto">
            <v-divider vertical></v-divider>
          </v-col>
          <v-col cols="6">
            <div
              v-if="sharingMode == $sharingMode.ManyToMany"
              class="mb-3 gray-bottom-border"
            >
              <h4 class="mb-2">Items to share:</h4>
            </div>
            <v-autocomplete
              v-if="sharingMode == $sharingMode.ManyToMany"
              v-model="itemsToShare"
              :filter="filter"
              :items="items"
              item-value="id"
              item-text="title"
              hide-selected
              multiple
              small-chips
              dense
              return-object
              outlined
              validate-on-blur
              :rules="[$rules.required]"
              color="info"
              auto
              :menu-props="{ offsetY: true }"
              deletable-chips
            >
            </v-autocomplete>

            <shared-with-list
              v-else
              :item="{ ...itemsToShare[0] }"
            ></shared-with-list>
          </v-col>
        </v-row>
      </v-form>
    </dialog-base>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import SharedWithList from '~/components/shared_items/SharedWithList'
export default {
  components: {
    SharedWithList,
  },
  computed: {
    ...mapGetters({
      items: 'items/itemsList',
      sharingDialog: 'dialogs/sharingDialog',
      itemsToShareList: 'shared_items/itemsToShare',
      recepientEmails: 'shared_items/recepientEmails',
      sharedItemsMap: 'shared_items/sharedItemsMap',
      sharingMode: 'shared_items/sharingMode',
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
        return Object.values(this.recepientEmails)
      },
      set(value) {
        this.setRecepientEmails(value)
      },
    },
  },

  watch: {
    dialog(value) {
      if (!value) {
        this.$refs.sharing_form.reset()
        this.setItemsToShareList([])
      }
    },
  },

  created() {
    this.$root.$on('submitSharingForm', this.submitForm)
  },

  methods: {
    ...mapActions({
      addSharedItems: 'shared_items/addSharedItems',
      deleteSharedItems: 'shared_items/deleteSharedItems',
    }),
    ...mapMutations({
      setSharingDialog: 'dialogs/SET_SHARING_DIALOG',
      setItemsToShareList: 'shared_items/SET_ITEMS_TO_SHARE',
      setRecepientEmails: 'shared_items/SET_RECEPIENT_EMAILS',
      setLoading: 'SET_LOADING',
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

    async submitForm() {
      try {
        if (this.$refs.sharing_form.validate()) {
          await this.deleteSharedItems()
          await this.addSharedItems()
          this.setSharingDialog(false)
        }
      } catch (error) {
        console.log('error', error)
      } finally {
        this.setLoading(false)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
