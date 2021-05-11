import SHA256 from 'crypto-js/sha256'
import SharedItem from '~/lib/models/shared_item'
import { decrypt as decryptECC } from '~/lib/security/ecc'
import {
  encrypt as encryptAES,
  decrypt as decryptAES,
} from '~/lib/security/aes'

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

    await db
      .collection('sharedItems')
      .where('sharedWith', '==', currentUser.email)
      .onSnapshot((snapshot) => {
        snapshot.forEach(async (doc) => {
          const data = doc.data()
          const publicKey = await getPK(db, data.sharedBy) // sender's public key
          const { vaultKey: secretKey } = rootState.auth.keyGen
          const { sharedWith, sharedBy, hashedID } = data
          const overview = {}
          let encryptedItem = null
          try {
            Object.assign(
              overview,
              decryptECC(
                Object.values(publicKey),
                Object.values(secretKey),
                data.encryptedOverview
              )
            )
            encryptedItem = data.encryptedItem
          } catch (e) {
            Object.assign(
              overview,
              decryptAES(secretKey, data.aesEncryptedOverview)
            )
            encryptedItem = data.aesEncryptedItem
          }

          commit('ADD_SHARED_WITH_ME_OVERVIEW', {
            overview,
            sharedBy,
            sharedWith,
          })

          commit('ADD_SHARED_WITH_ME_ITEM', {
            encryptedItem,
            sharedBy,
            sharedWith,
            publicKey,
            hashedID,
          })
        })
      })

    commit('SET_LOADING', false, { root: true })
  },

  decryptSharedWithMeItem({ rootState, state }, index) {
    const data = state.sharedWithMeItems[index]
    const { encryptedItem, sharedWith, sharedBy, publicKey } = data
    const { vaultKey: secretKey } = rootState.auth.keyGen
    if (data) {
      const { vaultKey } = rootState.auth.keyGen
      const decrypted = {}

      try {
        Object.assign(
          decrypted,
          decryptECC(
            Object.values(publicKey),
            Object.values(vaultKey),
            encryptedItem
          )
        )
      } catch (e) {
        Object.assign(decrypted, decryptAES(secretKey, encryptedItem))
      }
      return new SharedItem(decrypted, { sharedWith, sharedBy })
    }
    return null
  },

  async reEncryptSharedWithMeItems({ rootState, commit }, oldVK) {
    const db = this.$fire.firestore

    const snapshot = await db
      .collection('sharedItems')
      .where('sharedWith', '==', rootState.auth.currentUser.email)
      .get()

    const sharedWithMeBatch = db.batch()
    const docs = snapshot.docs.map((doc) => ({
      data: doc.data(),
      ref: doc.ref,
    }))

    for (const doc of docs) {
      const data = doc.data
      const publicKey = await getPK(db, data.sharedBy) // sender's public key
      const { vaultKey: secretKey } = rootState.auth.keyGen

      const decryptedOverview = decryptECC(
        publicKey,
        oldVK,
        data.encryptedOverview
      )
      const decryptedItem = decryptECC(publicKey, oldVK, data.encryptedItem)

      const aesEncryptedOverview = encryptAES(secretKey, decryptedOverview)
      const aesEncryptedItem = encryptAES(secretKey, decryptedItem)

      sharedWithMeBatch.update(doc.ref, {
        aesEncryptedItem,
        aesEncryptedOverview,
      })
    }

    await sharedWithMeBatch.commit()
  },

  async deleteSharedWithMeItem({ state, commit }, index) {
    commit('SET_LOADING', true, { root: true })
    const itemData = state.sharedWithMeItems[index]
    const docID = SHA256(
      itemData.sharedBy + itemData.sharedWith + itemData.hashedID
    ).toString()
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
