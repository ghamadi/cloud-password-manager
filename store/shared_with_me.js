import SHA256 from 'crypto-js/sha256'
import SharedItem from '~/lib/models/shared_item'
import { decrypt as decryptECC } from '~/lib/security/ecc'

const state = () => ({
  sharedWithMeItems: [],
  sharedWithMeOverviews: [],
})
const getters = {
  sharedWithMeItems(state) {
    return state.sharedWithMeItems
  },
  sharedWithMeOverviews(state) {
    return state.sharedWithMeOverviews
  },
}
const actions = {
  async fetchSharedWithMeItems({ state, rootState, commit }) {
    commit('SET_LOADING', true, { root: true })
    commit('RESET_SHARED_WITH_ME_LISTS')

    const db = this.$fire.firestore
    const currentUser = rootState.auth.currentUser
    const { vaultKey: secretKey } = rootState.auth.keyGen

    const snapshot = await db
      .collection('sharedItems')
      .where('sharedWith', '==', currentUser.email)
      .get()

    snapshot.forEach(async (doc) => {
      const data = doc.data()
      const publicKey = await getPK(db, data.sharedBy) // sender's public key

      const overview = decryptECC(
        Object.values(publicKey),
        Object.values(secretKey),
        data.encryptedOverview
      )

      const { sharedWith, sharedBy, hashedID } = data

      commit('ADD_SHARED_WITH_ME_OVERVIEW', { overview, sharedBy, sharedWith })
      commit('ADD_SHARED_WITH_ME_ITEM', {
        encryptedItem: data.encryptedItem,
        sharedBy,
        sharedWith,
        publicKey,
        hashedID,
      })
    })
    commit('SET_LOADING', false, { root: true })
  },

  decryptSharedWithMeItem({ rootState, state }, index) {
    const data = state.sharedWithMeItems[index]
    const { encryptedItem, sharedWith, sharedBy, publicKey } = data
    if (data) {
      const { vaultKey } = rootState.auth.keyGen
      const decrypted = decryptECC(
        Object.values(publicKey),
        Object.values(vaultKey),
        encryptedItem
      )
      return new SharedItem(decrypted, { sharedWith, sharedBy })
    }
    return null
  },

  async deleteSharedWithMeItem({ state, commit }, index) {
    commit('SET_LOADING', true, { root: true })
    const itemData = state.sharedWithMeItems[index]
    console.log('DATA', itemData)
    const docID = SHA256(
      itemData.sharedBy + itemData.sharedWith + itemData.hashedID
    ).toString()
    console.log('ID', docID)
    await this.$fire.firestore.collection('sharedItems').doc(docID).delete()

    commit('REMOVE_SHARED_WITH_ME_ITEM', itemData)
    commit('SET_LOADING', false, { root: true })
  },
}
const mutations = {
  ADD_SHARED_WITH_ME_OVERVIEW(state, { overview, sharedWith, sharedBy }) {
    state.sharedWithMeOverviews.push(
      new SharedItem(overview, { sharedWith, sharedBy })
    )
  },

  ADD_SHARED_WITH_ME_ITEM(
    state,
    { encryptedItem, sharedWith, sharedBy, publicKey, hashedID }
  ) {
    state.sharedWithMeItems.push({
      encryptedItem,
      sharedWith,
      sharedBy,
      publicKey,
      hashedID,
    })
  },

  RESET_SHARED_WITH_ME_LISTS(state) {
    state.sharedWithMeItems = []
    state.sharedWithMeOverviews = []
  },

  REMOVE_SHARED_WITH_ME_ITEM(state, item) {
    const deleteIndex = state.sharedWithMeItems.findIndex(
      (i) => i.id === item.id
    )
    state.sharedWithMeItems.splice(deleteIndex, 1)
    state.sharedWithMeOverviews.splice(deleteIndex, 1)
  },
}

export default { state, getters, actions, mutations }

async function getPK(db, email) {
  const keys = []

  const snapshot = await db
    .collection('publicKeys')
    .where('email', '==', email)
    .get()

  // this snapshot will ALWAYS have ONE document
  snapshot.forEach((doc) => keys.push(doc.data().publicKey.split(',')))

  return keys[0]
}
