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
            <v-list-item
              v-for="(action, index) in actions"
              :key="index"
              link
              dense
              @click="action.handler"
            >
              <v-list-item-title class="py-0 d-flex align-center">
                <v-icon :color="action.color" size="22" left>
                  {{ action.icon }}
                </v-icon>
                <span
                  :class="`font-weight-light ${action.color}--text`"
                  style="font-size: 1.1em"
                >
                  {{ action.label }}
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
import Item from '~/lib/models/item'

export default {
  props: {
    item: {
      type: Object,
      default: () => new Item({}),
    },
  },

  data() {
    return {
      actions: [
        {
          icon: 'mdi-share-outline',
          color: 'info',
          label: 'Share item',
          handler: this.openSharingDialog,
        },
        {
          icon: 'mdi-delete-outline',
          color: 'primary',
          label: 'Delete item',
          handler: this.confirmDelete,
        },
      ],
    }
  },

  computed: {
    ...mapGetters({ dirty: 'items/dirty', items: 'items/itemsList' }),
    cardIcon() {
      const category = this.$categories.find(
        (c) => c.categoryID === this.item.categoryID
      )
      return category ? category.icon : ''
    },
  },

  methods: {
    ...mapActions({
      decryptItem: 'items/decryptItem',
      deleteItem: 'items/deleteItem',
      addSharedItems: 'shared_items/addSharedItems',
      deleteSharedItems: 'shared_items/deleteSharedItems',
    }),
    ...mapMutations({
      setOpenedItem: 'items/SET_OPENED_ITEM',
      setCurrentItem: 'items/SET_CURRENT_ITEM',
      setRightDrawer: 'nav/SET_RIGHT_DRAWER',
      setLoading: 'SET_LOADING',
      setAlertDialog: 'dialogs/SET_ALERT_DIALOG',
      setCurrentAlert: 'dialogs/SET_CURRENT_ALERT',
      setSharingDialog: 'dialogs/SET_SHARING_DIALOG',
      setSharingMode: 'shared_items/SET_SHARING_MODE',
      setItemsToShare: 'shared_items/SET_ITEMS_TO_SHARE',
    }),
    async openItem() {
      if (!this.dirty) {
        const itemToOpen = await this.decryptItem(this.item.id)
        this.setOpenedItem({ ...itemToOpen })
        this.setCurrentItem({ ...itemToOpen })
        this.setRightDrawer(true)
      }
    },
    confirmDelete() {
      const okHandler = async () => {
        try {
          this.setLoading(true)
          await this.deleteItem(this.item)
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

      this.setItemsToShare([this.item])
      this.setSharingMode(this.$sharingMode.OneToMany)
      this.setCurrentAlert(alert)
      this.setSharingDialog(true)
    },
  },
}
</script>

<style lang="scss">
.logo-container {
  display: flex;
  flex-direction: column;
  min-width: 150px;
  min-height: 100px;
  max-width: 250px;
  max-height: 200px;

  .action-btn {
    visibility: initial;
  }

  &:hover {
    cursor: pointer;
    .action-btn {
      visibility: visible;
    }
  }

  .item-title {
    font-size: 0.7em;
    text-align: center;
    font-weight: 600;
    margin-top: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
