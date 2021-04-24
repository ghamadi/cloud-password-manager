import { categoryIDs } from '~/lib/item_categories'
import Field from '~/lib/models/field'
import Item from '~/lib/models/item'

const state = () => ({
  openedItem: null,
  currentItem: new Item({ id: 0, categoryID: categoryIDs.password }),
})

const getters = {
  openedItem(state) {
    return state.openedItem
  },
  currentItem(state) {
    return state.currentItem
  },
  dirty(state) {
    return (
      state.openedItem &&
      state.currentItem.equals &&
      !state.currentItem.equals(state.openedItem)
    )
  },
}
const actions = {}
const mutations = {
  SET_CURRENT_ITEM(state, value = {}) {
    state.currentItem = setItem(value)
  },

  SET_OPENED_ITEM(state, value = {}) {
    state.openedItem = setItem(value)
  },
  ADD_FIELD(state, field = {}) {
    state.currentItem.fields.push(new Field(field))
  },
  UPDATE_FIELD_BY_INDEX(state, { newField = {}, index }) {
    state.currentItem.fields[index] = new Field(newField)
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
