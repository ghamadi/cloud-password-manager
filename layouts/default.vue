<template>
  <v-app class="default-layout">
    <nav-drawer></nav-drawer>

    <v-app-bar id="default-app-bar" app clipped-right outlined elevation="1">
      <div :class="titleClass" style="width: 100%">
        <div class="d-flex align-center">
          <v-btn
            v-show="!drawer"
            plain
            class="mr-2 ml-2 mt-1"
            icon
            @click="drawer = !drawer"
          >
            <v-icon color="secondary">mdi-menu</v-icon>
          </v-btn>

          <span v-if="!drawer" class="primary--text"> CPass </span>
        </div>

        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              x-large
              text
              outlined
              :ripple="false"
              color="primary lighten-1"
              class="mr-5 regular-font"
              min-width="250px"
              v-on="on"
            >
              <v-icon size="35" left dark> mdi-account-circle </v-icon>
              <span class="ml-2 text-lowercase">
                {{ currentUser && currentUser.email }}
              </span>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item dense link @click.native.stop="logout">
              <v-list-item-action>
                <v-icon color="primary lighten-2">mdi-logout</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <span class="bright-red--text">Logout</span>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main class="grey lighten-3" @click.native.stop="itemDrawer = false">
      <v-container>
        <nuxt />
      </v-container>

      <alert-dialog></alert-dialog>
      <pass-gen-dialog></pass-gen-dialog>
      <sharing-dialog></sharing-dialog>

      <item-form-drawer></item-form-drawer>
      <loader />
      <snackbar />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import NavDrawer from '~/components/ui/nav/NavDrawer'
import ItemFormDrawer from '~/components/items/ItemFormDrawer'
import PassGenDialog from '~/components/dialogs/PassGenDialog'
import SharingDialog from '~/components/dialogs/SharingDialog'

export default {
  components: {
    NavDrawer,
    ItemFormDrawer,
    PassGenDialog,
    SharingDialog,
  },
  async fetch() {
    await this.fetchItems()
    // await this.fetchSharedItems()
  },

  computed: {
    ...mapGetters({
      leftDrawer: 'nav/leftDrawer',
      rightDrawer: 'nav/rightDrawer',
      itemFormDirty: 'items/dirty',
      sharedItems: 'shared_items/sharedItemsMap',
      currentUser: 'auth/currentUser',
    }),
    drawer: {
      get() {
        return this.leftDrawer
      },
      set(value) {
        this.setDrawer(value)
      },
    },
    title() {
      return 'CPass'
    },
    titleClass() {
      const fixedClasses =
        'white--text d-flex align-center justify-space-between'
      const varClass = 'logo'
      return `${varClass} ${fixedClasses}`
    },
    itemDrawer: {
      get() {
        return this.rightDrawer
      },
      set(value) {
        if (!value && this.itemFormDirty) {
          alert('save first')
        } else {
          this.setRightDrawer(value)
        }
      },
    },
  },

  methods: {
    ...mapActions({
      fetchItems: 'items/fetchItems',
      fetchSharedItems: 'shared_items/fetchSharedItems',
      logout: 'auth/logout',
    }),
    ...mapMutations({
      setDrawer: 'nav/SET_LEFT_DRAWER',
      setRightDrawer: 'nav/SET_RIGHT_DRAWER',
    }),
  },
}
</script>
<style lang="scss">
html {
  overflow-y: auto;
}

.default-layout {
  font-size: 14pt;

  #default-app-bar {
    background-color: white;
  }
  .logo,
  .title {
    font-size: 1.8em;
    font-weight: 400;
  }
  .logo {
    font-family: 'Megrim', cursive;
  }
}
</style>
