const state = () => ({
  leftDrawer: false,
  rightDrawer: false,
})
const getters = {
  leftDrawer(state) {
    return state.leftDrawer
  },
  rightDrawer(state) {
    return state.rightDrawer
  },
}
const actions = {}
const mutations = {
  SET_LEFT_DRAWER(state, leftDrawer) {
    state.leftDrawer = leftDrawer
  },
  SET_RIGHT_DRAWER(state, rightDrawer) {
    state.rightDrawer = rightDrawer
  },
}
export default { state, getters, actions, mutations }
