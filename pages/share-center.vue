<template>
  <div>
    <h1>Share center</h1>
    <v-container class="gallery">
      <item-card
        v-for="item in sharedItems"
        :key="item.id"
        :item="item"
      ></item-card>
      <shared-item-fab></shared-item-fab>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ItemCard from '~/components/items/ItemCard'
import SharedItemFab from '~/components/shared_items/SharedItemFab'
export default {
  components: {
    ItemCard,
    SharedItemFab,
  },
  computed: {
    ...mapGetters({ sharedItemsMap: 'shared_items/sharedItemsMap' }),
    sharedItems() {
      return Object.values(this.sharedItemsMap)
    },
  },

  async mounted() {
    await this.fetchSharedItems()
  },

  methods: {
    ...mapActions({ fetchSharedItems: 'shared_items/fetchSharedItems' }),
  },
}
</script>

<style lang="scss" scoped></style>
