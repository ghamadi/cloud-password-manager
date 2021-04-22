const state = () => ({
  loading: false,
})
const getters = {
  loading(state) {
    return state.loading
  },
}
const actions = {
  clearState({ commit }) {
    commit('auth/SET_CURRENT_USER', null)
    commit('auth/SET_KEY_GEN', null)
    commit('SET_LOADING', false)
    this.$router.push('/auth')
  },
}
const mutations = {
  SET_LOADING(state, value) {
    state.loading = value
  },
}
export default { state, getters, actions, mutations }
