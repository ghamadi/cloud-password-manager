import Vue from 'vue'
import rules from '@/lib/input_rules'
import models from '@/lib/models/models'

const utils = { rules, models }

const components = {
  LinkButton: () => import('~/components/ui/LinkButton.vue'),
  AlertDialog: () => import('~/components/dialogs/AlertDialog.vue'),
}

Object.entries(components).forEach(([name, component]) =>
  Vue.component(name, component)
)

Object.entries(utils).forEach(([name, util]) => {
  Vue.prototype[`$${name}`] = util
})
