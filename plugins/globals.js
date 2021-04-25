import Vue from 'vue'
import rules from '@/lib/input_rules'
import models from '@/lib/models/models'
import { categoryIDs, categories } from '~/lib/item_categories'

const utils = { rules, models, categoryIDs, categories }

const components = {
  LinkButton: () => import('~/components/ui/LinkButton.vue'),
  AlertDialog: () => import('~/components/dialogs/AlertDialog.vue'),
  ItemFab: () => import('~/components/items/ItemFab.vue'),
}

Object.entries(components).forEach(([name, component]) =>
  Vue.component(name, component)
)

Object.entries(utils).forEach(([name, util]) => {
  Vue.prototype[`$${name}`] = util
})
