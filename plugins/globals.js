import Vue from 'vue'
import rules from '@/lib/input_rules'
import models from '@/lib/models/models'
import { categoryIDs, categories } from '~/lib/item_categories'

const sharingMode = {
  ManyToMany: 0,
  OneToMany: 1,
}

const utils = { rules, models, categoryIDs, categories, sharingMode }

const components = {
  LinkButton: () => import('~/components/ui/LinkButton.vue'),
  DialogBase: () => import('~/components/dialogs/DialogBase.vue'),
  AlertDialog: () => import('~/components/dialogs/AlertDialog.vue'),
  ItemFab: () => import('~/components/items/ItemFab.vue'),
  NavLink: () => import('~/components/ui/nav/NavLink'),
  Loader: () => import('~/components/ui/Loader'),
  Snackbar: () => import('~/components/ui/Snackbar'),
}

Object.entries(components).forEach(([name, component]) =>
  Vue.component(name, component)
)

Object.entries(utils).forEach(([name, util]) => {
  Vue.prototype[`$${name}`] = util
})
