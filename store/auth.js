import User from '~/lib/models/user'
import KeyGen from '~/lib/security/key_gen'

const state = () => ({
  currentUser: null,
  keyGen: null,
})
const getters = {
  currentUser(state) {
    return state.currentUser
  },

  keyGen(state) {
    return state.keyGen
  },
}
const actions = {
  async register({ dispatch, commit }, { displayName, email, password }) {
    const keyGen = new KeyGen(email, password)
    commit('SET_LOADING', true, { root: true })

    const credentials = await this.$fire.auth.createUserWithEmailAndPassword(
      email,
      keyGen.authKey
    )
    const user = credentials.user
    await user.updateProfile({ displayName })
    await user.sendEmailVerification()
    await this.$fire.firestore
      .collection('users')
      .doc(user.uid)
      .set({ name: displayName, email, uid: user.uid })

    await this.$fire.firestore
      .collection('publicKeys')
      .add({ email, publicKey: keyGen.publicKey.toString() })

    dispatch('logout')

    commit('SET_LOADING', false, { root: true })
  },

  async login({ commit }, { email, password }) {
    const keyGen = new KeyGen(email, password)
    commit('SET_LOADING', true, { root: true })
    const userCred = await this.$fire.auth.signInWithEmailAndPassword(
      email,
      keyGen.authKey
    )
    commit('SET_CURRENT_USER', { authUser: userCred.user })
    commit('SET_KEY_GEN', keyGen)
    return userCred
  },

  async logout({ dispatch }) {
    await this.$fire.auth.signOut()
    dispatch('clearState', null, { root: true })
  },

  async sendVerificationEmail({ commit }) {
    commit('SET_LOADING', true, { root: true })
    const response = await this.$fire.auth.currentUser.sendEmailVerification()
    commit('SET_LOADING', false, { root: true })
    return response
  },
}
const mutations = {
  SET_CURRENT_USER(state, payload) {
    const authUser = (payload && payload.authUser) || null
    if (authUser) {
      const {
        uid,
        displayName: name,
        email,
        emailVerified: verified,
      } = authUser
      state.currentUser = new User({ uid, name, email, verified })
    } else {
      state.currentUser = null
    }
  },

  SET_KEY_GEN(state, gen) {
    state.keyGen = gen
  },
}
export default { state, getters, actions, mutations }
