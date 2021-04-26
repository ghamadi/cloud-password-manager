import { generatePassword, scorePassword } from '~/lib/password_generator'

const state = () => ({
  randomPass: '',
})
const getters = {
  randomPass(state) {
    return state.randomPass
  },

  passwordStrength(state) {
    return scorePassword(state.randomPass)
  },
}
const actions = {
  generateRandomPass({ commit }, { length, allowedChars }) {
    const pass = generatePassword(length, allowedChars)
    commit('SET_RANDOM_PASS', pass)
  },
}
const mutations = {
  SET_RANDOM_PASS(state, value) {
    state.randomPass = value
  },
}
export default { state, getters, actions, mutations }
