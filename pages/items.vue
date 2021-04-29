<template>
  <v-container class="gallery">
    <item-card v-for="item in items" :key="item.id" :item="item"></item-card>
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
  computed: {
    ...mapGetters({ items: 'items/itemsList' }),
  },
}
</script>

<style lang="scss">
.gallery {
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  justify-content: center;
  overflow: auto;
  max-width: 1320px;
  gap: 20px;
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
