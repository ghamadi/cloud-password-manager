import { categoryIDs } from '~/lib/item_categories'
import Field from '~/lib/models/field'
import Item from '~/lib/models/item'
import { encrypt, decrypt } from '~/lib/security/aes'

const state = () => ({
  openedItem: null,
  currentItem: new Item({ id: 0, categoryID: categoryIDs.password }),
  itemsList: [],
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
    const encryptedItem = encrypt(keyGen.vaultKey, item.toJson())
    const itemRef = await this.$fire.firestore
      .collection('users')
      .doc(userID)
      .collection('items')
      .add({ encryptedItem })

    const obj = { ...item, id: itemRef.id }
    commit('ADD_ITEM_TO_LIST', obj)
    console.log('current list', rootState.items.itemsList)
  },

  async fetchItems({ rootState, commit }) {
    const items = []
    const { userID, keyGen } = userAndKey(rootState)
    const querySnapshot = await this.$fire.firestore
      .collection('users')
      .doc(userID)
      .collection('items')
      .get()

    querySnapshot.forEach((itemDoc) => {
      const itemObj = decrypt(keyGen.vaultKey, itemDoc.data().encryptedItem)
      itemObj.id = itemDoc.id
      items.push(new Item(itemObj))
    })

    commit('SET_ITEMS_LIST', items)
  },

  async updateItem({ rootState, commit }, item) {
    const { userID, keyGen } = userAndKey(rootState)
    const encryptedItem = encrypt(keyGen.vaultKey, item.toJson())
    const itemRef = await this.$fire.firestore
      .collection('users')
      .doc(userID)
      .collection('items')
      .doc(item.id)
      .set({ encryptedItem })

    const obj = { ...item, id: itemRef.id }
    commit('ADD_ITEM_TO_LIST', obj)
    console.log('current list', rootState.items.itemsList)
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
  ADD_ITEM_TO_LIST(state, item = {}) {
    state.itemsList.push(new Item(item))
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
