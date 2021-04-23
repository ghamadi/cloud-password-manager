export default class Field {
  constructor({ id, categoryID, label, value = '', type = 'text' }) {
    Object.assign(this, { id, categoryID, label, value, type })
  }
}
