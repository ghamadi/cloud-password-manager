<template>
  <div>
    <h1>Share center</h1>
    <v-container class="gallery">
      <item-card
        v-for="item in sharedItems"
        :key="item.id"
        :item="item"
      ></item-card>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ItemCard from '~/components/items/ItemCard'
export default {
  components: {
    ItemCard,
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
