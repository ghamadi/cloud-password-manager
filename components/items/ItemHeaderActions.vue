<template>
  <v-menu offset-y nudge-left="70" close-on-content-click>
    <template #activator="{ on, attrs }">
      <div>
        <v-btn
          icon
          small
          :ripple="false"
          class="semi-squared"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon color="secondary lighten-3">mdi-dots-horizontal</v-icon>
        </v-btn>
      </div>
    </template>
    <v-list>
      <v-btn color="primary" text small width="100%" @click="deleteAndClose">
        <v-icon left small>mdi-delete-outline</v-icon>
        <span class="text-capitalize font-weight-light">Delete</span>
      </v-btn>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters({ currentItem: 'items/currentItem' }),
  },
  methods: {
    ...mapActions({ deleteItem: 'items/deleteItem' }),
    ...mapMutations({ setRightDrawer: 'nav/SET_RIGHT_DRAWER' }),
    async deleteAndClose() {
      await this.deleteItem(this.currentItem)
      this.setRightDrawer(false)
    },
  },
}
</script>

<style lang="scss" scoped></style>
