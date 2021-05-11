import SHA256 from 'crypto-js/sha256'
import SharedItem from '~/lib/models/shared_item'
import { randomSalt, hmac512 } from '~/lib/security/hmac'
import { encrypt as encryptECC } from '~/lib/security/ecc'
import {
  encrypt as encryptAES,
  decrypt as decryptAES,
} from '~/lib/security/aes'

const state = () => ({
  sharedItemsMap: {},
  itemsToShare: [],
  recepientEmails: [],
  recepientsToRemove: [],
  sharingMode: null,
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

  sharingMode(state) {
    return state.sharingMode
  },
}
const actions = {
  fetchSharedItems({ rootState, commit }) {
    // get all shared items and build sharedItemsMap
    const db = this.$fire.firestore
    const currentUser = rootState.auth.currentUser
    // const secretKey = Object.values(rootState.auth.keyGen.vaultKey)
    const secretKey = rootState.auth.keyGen.vaultKey
    db.collection('sharedItems')
      .where('sharedBy', '==', currentUser.email)
      .onSnapshot((snapshot) => {
        commit('SET_LOADING', true, { root: true })
        commit('SET_SHARED_ITEMS_MAP', {})
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
            map[originalID] = { ...overview, valid, recepientEmails: [] }
          }

          map[originalID].recepientEmails.push(data.sharedWith)
        })

        commit('SET_SHARED_ITEMS_MAP', map)
        commit('SET_LOADING', false, { root: true })
      })
  },

  async addSharedItems({ state, rootState, dispatch, commit }) {
    commit('SET_LOADING', true, { root: true })

    const db = this.$fire.firestore
    const currentUser = rootState.auth.currentUser
    const secretKey = Object.values(rootState.auth.keyGen.vaultKey)

    const sharedItemsBatch = db.batch()

    for (const item of state.itemsToShare) {
      for (let email of state.recepientEmails) {
        email = email.toLowerCase()

        if (email === currentUser.email.toLowerCase()) continue

        const fullItem = await dispatch('items/decryptItem', item.id, {
          root: true,
        })

        const si = new SharedItem(fullItem, {
          sharedBy: currentUser.email,
          sharedWith: email,
        })

        const hashedID = SHA256(item.id).toString()
        const docID = SHA256(si.sharedBy + si.sharedWith + hashedID).toString()
        const docRef = db.collection('sharedItems').doc(docID)
        const publicKey = await getPK(db, si.sharedWith)
        const docData = signAndEncryptECC(publicKey, secretKey, si)
        const { sharedBy, sharedWith } = si
        const { encryptedID, hmac } = signAndEncryptAES(secretKey, item.id)

        Object.assign(docData, {
          sharedBy,
          sharedWith,
          encryptedID,
          hashedID,
          hmac,
        })

        sharedItemsBatch.set(docRef, docData)
      }
    }

    await sharedItemsBatch.commit()
    await dispatch('fetchSharedItems')
    commit('SET_ITEMS_TO_SHARE', [])
    commit('SET_LOADING', false, { root: true })
  },

  async updateSharedItem({ rootState, commit }, item) {
    commit('SET_LOADING', true, { root: true })

    const db = this.$fire.firestore
    const currentUser = rootState.auth.currentUser
    const secretKey = Object.values(rootState.auth.keyGen.vaultKey)
    const hashedID = SHA256(item.id).toString()

    const sharedItemsBatch = db.batch()
    const snapshot = await db
      .collection('sharedItems')
      .where('sharedBy', '==', currentUser.email)
      .where('hashedID', '==', hashedID)
      .get()

    const docs = snapshot.docs.map((doc) => ({
      data: doc.data(),
      ref: doc.ref,
    }))

    for (const itemDoc of docs) {
      const data = itemDoc.data
      const { encryptedItem } = rootState.items.encryptedItemsMap[item.id]
      const decryptedItem = decryptAES(secretKey, encryptedItem)

      const si = new SharedItem(decryptedItem, {
        sharedBy: data.sharedBy,
        sharedWith: data.sharedWith,
      })

      const publicKey = await getPK(db, si.sharedWith)
      const docData = signAndEncryptECC(publicKey, secretKey, si)
      const { encryptedID, hmac } = signAndEncryptAES(secretKey, item.id)
      docData.encryptedID = encryptedID
      docData.hmac = hmac
      docData.hashedID = hashedID
      docData.sharedBy = si.sharedBy
      docData.sharedWith = si.sharedWith
      sharedItemsBatch.set(itemDoc.ref, docData)
    }
    await sharedItemsBatch.commit()
  },

  async revokeItemInvitations({ state, rootState, commit }, item) {
    commit('SET_LOADING', true, { root: true })

    const db = this.$fire.firestore
    const currentUser = rootState.auth.currentUser

    const hashedID = SHA256(item.id).toString()

    const sharedItemsBatch = db.batch()
    const snapshot = await db
      .collection('sharedItems')
      .where('sharedBy', '==', currentUser.email)
      .where('hashedID', '==', hashedID)
      .get()

    snapshot.forEach((doc) => sharedItemsBatch.delete(doc.ref))

    await sharedItemsBatch.commit()
  },

  async reEnryptSharedItems({ rootState, dispatch, commit }, oldVK) {
    const newVK = Object.values(rootState.auth.keyGen.vaultKey)
    const db = this.$fire.firestore

    const sharedItemsSnapshot = await db
      .collection('sharedItems')
      .where('sharedBy', '==', rootState.auth.currentUser.email)
      .get()

    const sharedItemsBatch = db.batch()
    const docs = sharedItemsSnapshot.docs.map((doc) => ({
      data: doc.data(),
      ref: doc.ref,
    }))

    for (const itemDoc of docs) {
      const data = itemDoc.data
      const { itemID } = decryptAES(oldVK, data.encryptedID)
      const { encryptedItem } = rootState.items.encryptedItemsMap[itemID]
      const decryptedItem = decryptAES(oldVK, encryptedItem)

      const si = new SharedItem(decryptedItem, {
        sharedBy: data.sharedBy,
        sharedWith: data.sharedWith,
      })

      const publicKey = await getPK(db, si.sharedWith)
      const encryptions = signAndEncryptECC(publicKey, newVK, si)
      const { encryptedID, hmac } = signAndEncryptAES(newVK, itemID)
      encryptions.encryptedID = encryptedID
      encryptions.hmac = hmac
      sharedItemsBatch.update(itemDoc.ref, encryptions)
    }
    await sharedItemsBatch.commit()
  },

  async deleteSharedItems({ state, rootState, dispatch, commit }) {
    commit('SET_LOADING', true, { root: true })

    const db = this.$fire.firestore
    const currentUser = rootState.auth.currentUser

    const sharedItemsBatch = db.batch()
    for (const item of state.itemsToShare) {
      for (const email of state.recepientsToRemove) {
        const si = new SharedItem(item, {
          sharedBy: currentUser.email,
          sharedWith: email,
        })
        const hashedID = SHA256(item.id).toString()
        const docID = SHA256(si.sharedBy + si.sharedWith + hashedID).toString()
        const docRef = db.collection('sharedItems').doc(docID)

        sharedItemsBatch.delete(docRef)
      }
    }
    await sharedItemsBatch.commit()
    await dispatch('fetchSharedItems')
    commit('SET_RECEPIENTS_TO_REMOVE', [])
    commit('SET_LOADING', false, { root: true })
  },
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

    if (!map[id]) map[id] = { recepientEmails: [] }

    Object.assign(map[id], { ...itemOverview, encryptedItem })

    for (const email of recepientEmails) {
      map[id].recepientEmails.push(email)
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

  SET_RECEPIENTS_TO_REMOVE(state, emailsList = []) {
    state.recepientsToRemove = [...emailsList]
  },

  ADD_RECEPIENT_TO_REMOVE(state, email) {
    state.recepientsToRemove.push(email)
  },

  TAKE_OUT_RECEPIENT_TO_REMOVE(state, email) {
    const arr = state.recepientsToRemove
    const deleteIndex = arr.findIndex((e) => e === email)
    arr.splice(deleteIndex, 1)
  },

  SET_SHARING_MODE(state, mode) {
    state.sharingMode = mode
  },
}
export default { state, getters, actions, mutations }

function signAndEncryptECC(publicKey, secretKey, item) {
  const encryptedItem = encryptECC(publicKey, secretKey, item.toJson())
  const encryptedOverview = encryptECC(
    publicKey,
    secretKey,
    item.toOverviewJson()
  )

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
