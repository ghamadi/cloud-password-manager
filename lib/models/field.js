export default class Field {
  constructor({ label = '', value = '', type = 'text' }) {
    Object.assign(this, { label, value, type })
  }

  toJson() {
    return (({ label, value, type }) => ({ label, value, type }))(this)
  }

  equals(field) {
    return (
      field &&
      this.label === field.label &&
      this.value === field.value &&
      this.type === field.type
    )
  }
}
