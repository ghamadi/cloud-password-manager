export default class Field {
  constructor({ id, label, value = '', type = 'text' }) {
    Object.assign(this, { id, label, value, type })
  }

  equals(field) {
    return (
      field &&
      this.id === field.id &&
      this.label === field.label &&
      this.type === field.type
    )
  }
}
