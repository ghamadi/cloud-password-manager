<template>
  <div class="container-div mx-0">
    <!-- <h1>Share center</h1> -->
    <v-tabs
      v-model="tab"
      background-color="transparent"
      class="gray-bottom-border"
    >
      <v-tab href="#tab-1"> Shared with others </v-tab>
      <v-tab href="#tab-2"> Shared with me </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="grey mt-3 lighten-3">
      <v-tab-item value="tab-1">
        <div class="gallery mx-0 pl-0">
          <item-card
            v-for="item in sharedItems"
            :key="item.id"
            :item="item"
          ></item-card>
        </div>
      </v-tab-item>

      <v-tab-item value="tab-2">
        <div class="gallery pl-0 mx-0">
          <shared-with-me-card
            v-for="(item, index) in sharedWithMe"
            :key="item.id"
            :item="item"
            :index="index"
          ></shared-with-me-card>
        </div>
      </v-tab-item>
    </v-tabs-items>
    <shared-item-fab></shared-item-fab>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ItemCard from '~/components/items/ItemCard'
import SharedWithMeCard from '~/components/shared_items/SharedWithMeCard'
import SharedItemFab from '~/components/shared_items/SharedItemFab'
export default {
  components: {
    ItemCard,
    SharedItemFab,
    SharedWithMeCard,
  },
  data() {
    return {
      tab: null,
    }
  },
  computed: {
    ...mapGetters({
      sharedItemsMap: 'shared_items/sharedItemsMap',
      sharedWithMe: 'shared_with_me/sharedWithMeOverviews',
    }),
    sharedItems() {
      return Object.values(this.sharedItemsMap)
    },
  },

  async mounted() {
    await this.fetchSharedItems()
    await this.fetchSharedWithMeITems()
  },

  methods: {
    ...mapActions({
      fetchSharedItems: 'shared_items/fetchSharedItems',
      fetchSharedWithMeITems: 'shared_with_me/fetchSharedWithMeItems',
    }),
  },
}
</script>

<style lang="scss" scoped></style>
