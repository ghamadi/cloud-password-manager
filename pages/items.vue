<template>
  <v-container class="gallery">
    <item-card
      v-for="item in itemsToShow"
      :key="item.id"
      :item="item"
    ></item-card>
    <item-fab></item-fab>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ItemCard from '~/components/items/ItemCard'
export default {
  components: {
    ItemCard,
  },
  asyncData({ query, redirect }) {
    const queryPassed = query && Object.values(query).length
    if (queryPassed && !query.category && !query.tag) {
      redirect('/')
    }
  },
  computed: {
    ...mapGetters({ items: 'items/itemsList' }),
    itemsToShow() {
      const category = this.$route.query.category || ''
      const tag = this.$route.query.tag || ''
      return this.items.filter((item) => {
        const tagsIncluded = item.tags && item.tags.includes(tag.toLowerCase())
        const categoryMatch = item.categoryID === category.toLowerCase()

        return (
          (!tag && !category) ||
          (tag && category && tagsIncluded && categoryMatch) ||
          (tag && !category && tagsIncluded) ||
          (category && !tag && categoryMatch)
        )
      })
    },
  },
}
</script>

<style lang="scss">
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  justify-content: center;
  gap: 15px;
  max-width: 1300px;
  // background-color: green;
}

@media only screen and (max-width: 440px) {
  .gallery {
    grid-template-columns: 200px;
  }
}

@media only screen and (min-width: 440px) and (max-width: 880px) {
  .gallery {
    grid-template-columns: repeat(2, 200px);
  }
}

@media only screen and (min-width: 880px) and (max-width: 1320px) {
  .gallery {
    grid-template-columns: repeat(4, 200px);
  }
}
</style>
