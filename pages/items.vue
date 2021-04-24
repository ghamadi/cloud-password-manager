<template>
  <div>
    <h1>Items page</h1>
    <h3>Shows one of the following views:</h3>
    <ul class="ml-6">
      <li>All Items</li>
      <li>Items in one category</li>
      <li>Items with given label</li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  async mounted() {
    await this.fetchItems()
  },
  methods: {
    ...mapActions({ fetchItems: 'items/fetchItems' }),
  },
}
</script>

<style lang="scss" scoped></style>
