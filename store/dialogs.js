import { AlertObject } from '~/lib/models/alert_data'

const state = () => ({
  alertDialog: false,
  passGenDialog: false,
  currentAlert: {},
})

const getters = {
  alertDialog(state) {
    return state.alertDialog
  },

  passGenDialog(state) {
    return state.passGenDialog
  },

  currentAlert(state) {
    return state.currentAlert
  },
}

const actions = {}

const mutations = {
  SET_ALERT_DIALOG(state, value) {
    state.alertDialog = value
  },

  SET_PASS_GEN_DIALOG(state, value) {
    state.passGenDialog = value
  },

  SET_CURRENT_ALERT(state, obj) {
    if (!obj) state.currentAlert = {}
    else state.currentAlert = new AlertObject(obj)
  },
}

export default { state, getters, actions, mutations }
