import { AlertObject } from '~/lib/models/alert_data'

const state = () => ({
  planPopupForm: false,
  programPopupForm: false,
  alertDialog: false,
  currentAlert: {},
})

const getters = {
  planPopupForm(state) {
    return state.planPopupForm
  },

  programPopupForm(state) {
    return state.programPopupForm
  },

  alertDialog(state) {
    return state.alertDialog
  },

  currentAlert(state) {
    return state.currentAlert
  },
}

const actions = {}

const mutations = {
  SET_PLAN_POPUP_FORM(state, value) {
    state.planPopupForm = value
  },

  SET_PROGRAM_POPUP_FORM(state, value) {
    state.programPopupForm = value
  },

  SET_ALERT_DIALOG(state, value) {
    state.alertDialog = value
  },

  SET_CURRENT_ALERT(state, obj) {
    if (!obj) state.currentAlert = {}
    else state.currentAlert = new AlertObject(obj)
  },
}

export default { state, getters, actions, mutations }
