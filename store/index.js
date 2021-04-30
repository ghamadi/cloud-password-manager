import SnackbarObject from '~/lib/models/snackbar'

const state = () => ({
  loading: false,
  snackbar: false,
  snackbarObject: {},
})
const getters = {
  loading(state) {
    return state.loading
  },
  snackbar(state) {
    return state.snackbar
  },
  snackbarObject(state) {
    return state.snackbarObject
  },
}
const actions = {
  clearState({ commit }) {
    commit('auth/SET_CURRENT_USER', null)
    commit('auth/SET_KEY_GEN', null)
    commit('SET_LOADING', false)
    this.$router.push('/auth')
  },

  displaySnackbar({ commit }, obj) {
    commit('SET_SNACKBAR_OBJECT', obj)
    commit('SET_SNACKBAR', true)
  },
}
const mutations = {
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_SNACKBAR(state, value) {
    state.snackbar = value
  },
  SET_SNACKBAR_OBJECT(state, value) {
    state.snackbarObject = new SnackbarObject({ ...value })
  },
}
export default { state, getters, actions, mutations }
