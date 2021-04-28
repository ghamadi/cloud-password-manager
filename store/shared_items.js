import SHA256 from 'crypto-js/sha256'
import {
  encrypt as encryptECC,
  // decrypt as decryptECC,
} from '~/lib/security/ecc'

import {
  encrypt as encryptAES,
  decrypt as decryptAES,
} from '~/lib/security/aes'
import { randomSalt, hmac512 } from '~/lib/security/hmac'

import SharedItem from '~/lib/models/shared_item'

const state = () => ({
  sharedItemsMap: {},
  itemsToShare: [],
  recepientEmails: [],
  recepientsToRemove: [],
})
const getters = {
  sharedItemsMap(state) {
    return state.sharedItemsMap
  },

  itemsToShare(state) {
    return state.itemsToShare
  },

  recepientEmails(state) {
    return state.recepientEmails
  },

  recepientsToRemove(state) {
    return state.recepientsToRemove
  },
}
const actions = {
  async fetchSharedItems({ rootState, commit }) {
    commit('SET_LOADING', true, { root: true })

    // get all shared items and build sharedItemsMap
    const db = this.$fire.firestore
    const currentUser = rootState.auth.currentUser
    const secretKey = Object.values(rootState.auth.keyGen.vaultKey)

    const snapshot = await db
      .collection('sharedItems')
      .where('sharedBy', '==', currentUser.email)
      .get()

    const map = {}
    snapshot.forEach((doc) => {
      const data = doc.data()
      const { itemID: originalID, salt } = decryptAES(
        secretKey,
        data.encryptedID
      )

      const computedHMAC = hmac512(originalID, salt, secretKey)
      const valid = computedHMAC === data.hmac

      const overview = rootState.items.itemsList.find(
        (item) => item.id === originalID
      )
      if (!map[originalID]) {
        map[originalID] = { ...overview, valid, recepientEmails: new Set([]) }
      }

      map[originalID].recepientEmails.add(data.sharedWith)
    })

    commit('SET_SHARED_ITEMS_MAP', map)
    commit('SET_LOADING', false, { root: true })
  },

  async addSharedItems({ state, rootState, commit }) {
    commit('SET_LOADING', true, { root: true })

    const db = this.$fire.firestore
    const currentUser = rootState.auth.currentUser
    const secretKey = Object.values(rootState.auth.keyGen.vaultKey)

    const sharedItemsBatch = db.batch()

    for (const itemID of state.itemsToShare) {
      for (const email of state.recepientEmails) {
        const si = new SharedItem(itemID, {
          sharedBy: currentUser.email,
          sharedWith: email,
        })
        const docID = SHA256(si.sharedBy + si.sharedWith + itemID).toString()
        const docRef = db.collection('sharedItems').doc(docID)

        const publicKey = await getPK(db, si.sharedWith)
        const docData = signAndEncryptECC(publicKey, secretKey, si)
        const { sharedBy, sharedWith } = si
        const { encryptedID, hmac } = signAndEncryptAES(secretKey, itemID)
        Object.assign(docData, {
          sharedBy,
          sharedWith,
          encryptedID,
          hmac,
        })
        sharedItemsBatch.set(docRef, docData)
      }

      const itemOverview = rootState.items.itemsList.find(
        (item) => item.id === itemID
      )
      delete itemOverview.hmac

      const { encryptedItem } = rootState.items.encryptedItemsMap[itemID]

      commit('ADD_SHARED_ITEM_TO_MAP', {
        itemOverview,
        encryptedItem,
        recepientEmails: state.recepientEmails,
      })
    }
    await sharedItemsBatch.commit()
    commit('SET_LOADING', false, { root: true })
  },

  decryptSharedItem() {},

  async updateSharedItem() {},

  async deleteSharedItem() {},
}
const mutations = {
  ADD_SHARED_ITEM_TO_MAP(
    state,
    { itemOverview, encryptedItem, recepientEmails }
  ) {
    /**
     * sharedItemsMap links itemID to:
     *      decrypted overview,
     *      encrypted details,
     *      set of recepients
     */

    const map = state.sharedItemsMap
    const id = itemOverview.id

    if (!map[id]) map[id] = { recepientEmails: new Set([]) }

    Object.assign(map[id], { ...itemOverview, encryptedItem })

    for (const email of recepientEmails) {
      map[id].recepientEmails.add(email)
    }
  },

  SET_SHARED_ITEMS_MAP(state, map) {
    state.sharedItemsMap = { ...map }
  },

  SET_ENCRYPTED_SHARED_ITEMS_MAP(state, itemsMap = {}) {},

  SET_ITEMS_TO_SHARE(state, itemsList = []) {
    state.itemsToShare = [...itemsList]
  },

  SET_RECEPIENT_EMAILS(state, emailsList = []) {
    state.recepientEmails = [...emailsList]
  },
}
export default { state, getters, actions, mutations }

function signAndEncryptECC(publicKey, secretKey, item) {
  const encryptedItem = encryptECC(publicKey, secretKey, item.toOverviewJson())
  const encryptedOverview = encryptECC(publicKey, secretKey, item.toJson())

  return { encryptedItem, encryptedOverview }
}

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

function signAndEncryptAES(key, itemID) {
  const { record, hmac } = signWithHMAC(key, itemID)

  const encryptedID = encryptAES(key, record)

  return { encryptedID, hmac }
}

function signWithHMAC(key, itemID) {
  const record = { itemID }
  const salt = randomSalt()
  record.salt = salt
  const hmac = hmac512(itemID, salt, key)
  return { record, hmac }
}
