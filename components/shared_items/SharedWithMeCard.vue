<template>
  <v-card
    flat
    min-width="150px"
    min-height="120px"
    max-width="250px"
    max-height="200px"
    color="white"
    elevation="1"
    @click.native.stop="openItem"
  >
    <div class="logo-container">
      <div class="logo-header d-flex justify-end">
        <v-menu offset-y close-on-content-click>
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              icon
              x-small
              class="mt-1 mr-3 action-btn"
              v-on="on"
            >
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item link dense @click="confirmDelete">
              <v-list-item-title class="py-0 d-flex align-center">
                <v-icon color="primary" size="22" left>
                  mdi-delete-outline
                </v-icon>
                <span
                  :class="`font-weight-light primary--text`"
                  style="font-size: 1.1em"
                >
                  Delete item
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="logo">
        <v-icon color="primary lighten-1" size="50">
          {{ cardIcon }}
        </v-icon>
      </div>
      <span class="item-title">
        {{ item.title }}
      </span>
    </div>
  </v-card>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import SharedItem from '~/lib/models/shared_item'
export default {
  props: {
    item: {
      type: Object,
      default: () => new SharedItem({}),
    },
    index: {
      type: Number,
      default: -1,
    },
  },

  computed: {
    ...mapGetters({ dirty: 'items/dirty' }),
    cardIcon() {
      const category = this.$categories.find(
        (c) => c.categoryID === this.item.categoryID
      )
      return category ? category.icon : ''
    },
  },

  methods: {
    ...mapActions({
      decryptSharedWithMeItem: 'shared_with_me/decryptSharedWithMeItem',
      deleteSharedWithMeItem: 'shared_with_me/deleteSharedWithMeItem',
    }),
    ...mapMutations({
      setOpenedItem: 'items/SET_OPENED_ITEM',
      setCurrentItem: 'items/SET_CURRENT_ITEM',
      setRightDrawer: 'nav/SET_RIGHT_DRAWER',
      setAlertDialog: 'dialogs/SET_ALERT_DIALOG',
      setCurrentAlert: 'dialogs/SET_CURRENT_ALERT',
      setLoading: 'SET_LOADING',
    }),

    async openItem() {
      if (!this.dirty) {
        const itemToOpen = await this.decryptSharedWithMeItem(this.index)
        this.setOpenedItem({ ...itemToOpen })
        this.setCurrentItem({ ...itemToOpen })
        this.setRightDrawer(true)
      }
    },

    confirmDelete() {
      const okHandler = async () => {
        try {
          await this.deleteSharedWithMeItem(this.index)
          this.setAlertDialog(false)
        } catch (error) {
          console.log(error)
        } finally {
          this.setLoading(false)
        }
      }

      const cancelHandler = () => {
        this.setAlertDialog(false)
      }

      const ok = new this.$models.OkButton(() => okHandler())
      const cancel = new this.$models.CancelButton(() => cancelHandler())
      const alert = new this.$models.AlertObject({
        title: 'Delete item',
        message: `Delete '${this.item.title}'?`,
        actions: [ok, cancel],
      })
      this.setCurrentAlert(alert)
      this.setAlertDialog(true)
    },
  },
}
</script>

<style lang="scss" scoped></style>
