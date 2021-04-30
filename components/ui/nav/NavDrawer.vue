<template>
  <v-navigation-drawer
    id="main-navigation-drawer"
    v-model="drawer"
    color="secondary"
    class="font-weight-light"
    :width="drawerWidth"
    app
    dark
  >
    <v-list-item
      two-line
      class="logo d-flex justify-space-between align-center px-5 elevation-1"
    >
      <v-list-item-title>
        <div class="d-flex justify-start font-weight-medium">
          <span class="primary--text logo logo-letter mr-1 font-weight-black">
            C
          </span>
          <span class="white--text logo">Pass</span>
        </div>
      </v-list-item-title>
      <v-list-item-action>
        <v-btn
          small
          color="primary-text lighten-2"
          icon
          @click="drawer = !drawer"
        >
          <v-icon color="primary lighten-1">mdi-menu</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>

    <v-divider class="primary"></v-divider>

    <v-list dark>
      <nav-link
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        :title="item.title"
        :icon="item.icon"
      ></nav-link>
    </v-list>

    <v-divider class="my-5"></v-divider>

    <nav-filters-section></nav-filters-section>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import NavFiltersSection from '~/components/ui/nav/NavFiltersSection'
export default {
  components: {
    NavFiltersSection,
  },
  data() {
    return {
      miniVariant: true,
      items: [
        {
          icon: 'mdi-home-variant',
          title: 'Home',
          to: '/',
        },
        {
          icon: 'mdi-view-dashboard',
          title: 'All items',
          to: { name: 'items' },
        },
        {
          icon: 'mdi-folder-key-network',
          title: 'Share center',
          to: { name: 'share-center' },
        },
      ],
    }
  },

  computed: {
    ...mapGetters({ leftDrawer: 'nav/leftDrawer' }),
    drawer: {
      get() {
        return this.leftDrawer
      },
      set(value) {
        this.setDrawer(value)
      },
    },

    drawerWidth() {
      if (screen.width <= 400) return '100%'
      return '300px'
      // switch (this.$vuetify.breakpoint.name) {
      //   case 'xs':
      //     return '100%'
      // }
      // return '300px'
    },
  },

  methods: {
    ...mapMutations({ setDrawer: 'nav/SET_LEFT_DRAWER' }),
  },
}
</script>
<style lang="scss" scoped>
.list-item:not(.active-list-item),
.v-list-group.active-list-item {
  &:hover {
    background-color: #22313b;
  }

  *,
  .v-icon {
    font-weight: 300;
    color: #88959e !important;
  }
}

.active-list-item {
  color: white !important;
  font-weight: 300;
}

.light-gray-text {
  color: #88959e !important;
}

.logo-letter {
  margin-right: 1px;
}

.logo {
  font-size: 1.6em;
}

#main-navigation-drawer {
  width: 300px;
}

@media only screen and (max-width: 400px) {
  #main-navigation-drawer {
    width: 100%;
  }
}
</style>
