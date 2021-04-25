export default class Field {
  constructor({ label = '', value = '', type = 'text' }) {
    Object.assign(this, { label, value, type })
  }

  toJson() {
    return (({ label, value, type }) => ({ label, value, type }))(this)
  }

  trimValues() {
    for (const i in this) {
      let val = this[i]
      if (val && typeof val === 'string') {
        val = val.trim()
      }
    }
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
