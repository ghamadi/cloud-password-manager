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
              <v-list-item-title>
                <v-icon color="primary" class="mt-n1" small left>
                  mdi-delete-outline
                </v-icon>
                <span class="font-weight-medium primary--text">
                  Delete item
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="logo">
        <v-icon color="primary lighten-1" size="50">
          {{ $categories.find((c) => c.categoryID === item.categoryID).icon }}
        </v-icon>
      </div>
      <span class="item-title">
        {{ item.title }}
      </span>
    </div>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
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
      actions: [{ icon: 'mdi-delete', color: 'primary', label: 'delete' }],
    }
  },

  computed: {
    ...mapGetters({ dirty: 'items/dirty' }),
  },

  methods: {
    ...mapMutations({
      setOpenedItem: 'items/SET_OPENED_ITEM',
      setCurrentItem: 'items/SET_CURRENT_ITEM',
      setRightDrawer: 'nav/SET_RIGHT_DRAWER',
    }),
    openItem() {
      if (!this.dirty) {
        this.setOpenedItem({ ...this.item })
        this.setCurrentItem({ ...this.item })
        this.setRightDrawer(true)
      }
    },
    confirmDelete() {},
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
