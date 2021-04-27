import { categoryIDs } from '~/lib/item_categories'
import Field from '~/lib/models/field'
import Item from '~/lib/models/item'
import { encrypt, decrypt } from '~/lib/security/aes'
import { hmac512, randomSalt } from '~/lib/security/hmac'

const state = () => ({
  openedItem: null,
  currentItem: new Item({ id: 0, categoryID: categoryIDs.password }),
  itemsList: [],
  encryptedItemsMap: {},
})

const getters = {
  openedItem(state) {
    return state.openedItem
  },
  currentItem(state) {
    return state.currentItem
  },
  itemsList(state) {
    return state.itemsList
  },
  encryptedItems(state) {
    return state.encryptedItems
  },
  dirty(state) {
    return (
      state.openedItem &&
      state.currentItem.equals &&
      !state.currentItem.equals(state.openedItem)
    )
  },
}
const actions = {
  async addItem({ rootState, commit }, item) {
    const { userID, keyGen } = userAndKey(rootState)
    const docData = buildEncryptions(keyGen, item)
    commit('SET_LOADING', true, { root: true })

    const itemRef = await this.$fire.firestore
      .collection('users')
      .doc(userID)
      .collection('items')
      .add(docData)

    const obj = { ...item, id: itemRef.id }

    commit('SET_LOADING', false, { root: true })
    commit('ADD_ITEM_TO_LIST', { item: obj, encryptions: docData })
  },

  async fetchItems({ rootState, commit }) {
    const items = []
    const detailedItems = {}
    const { userID, keyGen } = userAndKey(rootState)

    commit('SET_LOADING', true, { root: true })

    const querySnapshot = await this.$fire.firestore
      .collection('users')
      .doc(userID)
      .collection('items')
      .get()

    querySnapshot.forEach((itemDoc) => {
      const data = itemDoc.data()
      const decryptedOverview = decrypt(keyGen.vaultKey, data.encryptedOverview)
      const storedHMAC = data.overviewHMAC
      const computedHMAC = hmac512(
        decryptedOverview,
        decryptedOverview.salt,
        keyGen.vaultKey
      )

      // no need to store the salt on client
      // updated records will have new salts
      delete decryptedOverview.salt

      const valid = storedHMAC === computedHMAC
      const itemObj = {
        id: itemDoc.id,
        ...decryptedOverview,
        hmac: storedHMAC,
        valid,
      }
      items.push(itemObj)
      detailedItems[itemDoc.id] = (({ encryptedItem, itemHMAC }) => ({
        encryptedItem,
        itemHMAC,
      }))(data)
    })

    commit('SET_LOADING', false, { root: true })
    commit('SET_ENCRYPTED_ITEMS_MAP', detailedItems)
    commit('SET_ITEMS_LIST', items)
  },

  decryptItem({ rootState, state }, id) {
    const data = state.encryptedItemsMap[id]
    const { keyGen } = userAndKey(rootState)
    const decrypted = decrypt(keyGen.vaultKey, data.encryptedItem)
    const storedHMAC = data.itemHMAC
    const computedHMAC = hmac512(decrypted, decrypted.salt, keyGen.vaultKey)
    delete decrypted.salt
    const valid = storedHMAC === computedHMAC
    const itemObj = {
      id,
      ...decrypted,
      hmac: storedHMAC,
      valid,
    }
    return new Item(itemObj)
  },

  async updateItem({ rootState, commit }, item) {
    const { userID, keyGen } = userAndKey(rootState)
    const docData = buildEncryptions(keyGen, item)
    commit('SET_LOADING', true, { root: true })
    await this.$fire.firestore
      .collection('users')
      .doc(userID)
      .collection('items')
      .doc(item.id)
      .set(docData)

    const obj = { ...item, id: item.id }
    obj.fields = item.fields.map((f) => new Field(f))

    commit('SET_LOADING', false, { root: true })
    commit('UPDATE_ITEM_IN_LIST', { item: obj, encryptions: docData })
  },

  async deleteItem({ rootState, commit }, item) {
    const userID = rootState.auth.currentUser.uid
    commit('SET_LOADING', true, { root: true })

    await this.$fire.firestore
      .collection('users')
      .doc(userID)
      .collection('items')
      .doc(item.id)
      .delete()

    commit('SET_LOADING', false, { root: true })
    commit('REMOVE_ITEM_FROM_LIST', item)
  },
}
const mutations = {
  SET_CURRENT_ITEM(state, value = {}) {
    state.currentItem = setItem(value)
  },

  SET_OPENED_ITEM(state, value = {}) {
    state.openedItem = setItem(value)
  },
  SET_ITEMS_LIST(state, itemsList = []) {
    state.itemsList = [...itemsList]
  },
  SET_ENCRYPTED_ITEMS_MAP(state, value = {}) {
    state.encryptedItemsMap = {}
    Object.assign(state.encryptedItemsMap, value)
  },
  ADD_ITEM_TO_LIST(state, { item = {}, encryptions }) {
    item = new Item(item)
    item.trimValues()
    state.itemsList.push(item)

    const obj = {}
    obj[item.id] = encryptions
    Object.assign(state.encryptedItemsMap, obj)
  },
  UPDATE_ITEM_IN_LIST(state, { item = {}, encryptions }) {
    const index = state.itemsList.findIndex((i) => i.id === item.id)
    const copy = new Item(item)
    copy.trimValues()
    state.itemsList.splice(index, 1, copy)

    const obj = {}
    obj[item.id] = encryptions
    Object.assign(state.encryptedItemsMap, obj)
  },
  REMOVE_ITEM_FROM_LIST(state, item) {
    const index = state.itemsList.findIndex((i) => i.id === item.id)
    state.itemsList.splice(index, 1)
  },
  ADD_FIELD(state, field = {}) {
    state.currentItem.fields.push(new Field(field))
  },
  UPDATE_FIELD_BY_INDEX(state, { newField = {}, index }) {
    state.currentItem.fields.splice(index, 1, new Field(newField))
  },
  REMOVE_FIELD_BY_INDEX(state, index) {
    state.currentItem.fields.splice(index, 1)
  },
}
export default { state, getters, actions, mutations }

/********************************
 *      HELPER FUNCTIONS
 ********************************/

/**
 *
 * @param {Object} value parameter containing the Item's properties
 * @returns {Item} new Item created from parameter's properties
 */
function setItem(value) {
  const obj = new Item({ ...value })
  obj.fields = obj.fields.map((f) => new Field(f))
  obj.tags = [...obj.tags]
  return obj
}

function userAndKey(rootState) {
  const userID = rootState.auth.currentUser.uid
  const keyGen = rootState.auth.keyGen
  return { userID, keyGen }
}

function signItem(keyGen, item) {
  const record = { ...item }
  const salt = randomSalt()
  record.salt = salt
  const hmac = hmac512(item, salt, keyGen.vaultKey)
  return { record, hmac }
}

function buildEncryptions(keyGen, item) {
  const sig1 = signItem(keyGen, item.toJson())
  const sig2 = signItem(keyGen, item.toOverviewJson())

  const { itemHMAC, overviewHMAC } = {
    itemHMAC: sig1.hmac,
    overviewHMAC: sig2.hmac,
  }
  const { saltedRecord, saltedOverview } = {
    saltedRecord: sig1.record,
    saltedOverview: sig2.record,
  }

  const encryptedItem = encrypt(keyGen.vaultKey, saltedRecord)
  const encryptedOverview = encrypt(keyGen.vaultKey, saltedOverview)

  return { encryptedItem, encryptedOverview, itemHMAC, overviewHMAC }
}
