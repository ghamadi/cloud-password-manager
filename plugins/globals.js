import Vue from 'vue'
import rules from '@/lib/input_rules'

const utils = { rules }

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
