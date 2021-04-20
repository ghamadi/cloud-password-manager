const state = () => ({
  currentUser: null,
})
const getters = {
  currentUser(state) {
    return state.currentUser
  },
}
const actions = {
  async register({ dispatch }, { displayName, email, password }) {
    const credentials = await this.$fire.auth.createUserWithEmailAndPassword(
      email,
      password
    )
    const user = credentials.user
    await user.updateProfile({ displayName })
    await user.sendEmailVerification()
    await this.$fire.firestore
      .collection('users')
      .doc(user.uid)
      .set({ name: displayName, email, uid: user.uid })
    dispatch('logout')
  },

  async login({ commit }, { email, password }) {
    const userCred = await this.$fire.auth.signInWithEmailAndPassword(
      email,
      password
    )
    commit('SET_CURRENT_USER', { authUser: userCred.user })
    return userCred
  },

  async logout({ dispatch }) {
    await this.$fire.auth.signOut()
    dispatch('clearState', null, { root: true })
  },

  async sendVerificationEmail(ctx) {
    const response = await this.$fire.auth.currentUser.sendEmailVerification()
    return response
  },
}
const mutations = {
  SET_CURRENT_USER(state, payload) {
    const authUser = (payload && payload.authUser) || {}
    if (authUser) {
      const { uid, displayName, email, emailVerified } = authUser
      state.currentUser = { uid, displayName, email, emailVerified }
    } else {
      state.currentUser = null
    }
  },
}
export default { state, getters, actions, mutations }
