<template>
  <v-speed-dial
    v-model="fab"
    bottom
    fixed
    right
    direction="top"
    :open-on-hover="!$vuetify.breakpoint.mobile"
    transition="slide-y-reverse-transition"
    class="mr-10 mb-8"
  >
    <template #activator>
      <v-fab-transition>
        <v-btn
          v-show="!rightDrawer"
          :color="`${fab ? 'secondary' : 'primary'}`"
          dark
          fab
        >
          <v-icon v-if="!fab"> mdi-plus </v-icon>
          <v-icon v-else> mdi-close </v-icon>
        </v-btn>
      </v-fab-transition>
    </template>

    <v-btn
      v-for="(category, index) in categories"
      :key="index"
      dark
      fab
      small
      class="expand-on-hover"
      color="primary"
      @click.stop="addItem(category.categoryID, category.fields)"
    >
      <v-tooltip
        left
        :nudge-left="11"
        :value="tooltips"
        :activator="`.fab-icon${index}`"
        :disabled="!tooltips"
        :open-on-hover="false"
      >
        <span> {{ category.label }} </span>
      </v-tooltip>

      <v-icon :class="`fab-icon${index}`">
        {{ category.icon }}
      </v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { categories } from '~/lib/item_categories'

export default {
  data() {
    return {
      fab: false,
      tooltips: false,
      categories,
    }
  },

  computed: {
    ...mapGetters({
      rightDrawer: 'nav/rightDrawer',
      currentProgram: 'program/currentProgram',
      currentUser: 'auth/currentUser',
    }),
  },

  watch: {
    fab(val) {
      this.tooltips = false
      val &&
        setTimeout(() => {
          this.tooltips = true
        }, 250)
    },
  },

  methods: {
    ...mapMutations({
      setOpenedItem: 'items/SET_OPENED_ITEM',
      setCurrentItem: 'items/SET_CURRENT_ITEM',
      setRightDrawer: 'nav/SET_RIGHT_DRAWER',
    }),

    addItem(categoryID, fields) {
      this.fab = false
      this.setOpenedItem({ id: 0, categoryID, fields })
      this.setCurrentItem({ id: 0, categoryID, fields })
      this.setRightDrawer(true)
    },
  },
}
</script>
<style lang="scss">
.v-btn.expand-on-hover {
  transform: scale(1.1);
  &:hover {
    transform: scale(1.3);
  }
}
</style>
