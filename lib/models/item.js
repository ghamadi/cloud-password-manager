import Field from './field'
export default class Item {
  constructor({
    id,
    categoryID,
    title = '',
    icon = 'mdi-key-variant',
    notes = '',
    tags = [],
    fields = [],
  }) {
    Object.assign(this, { id, categoryID, title, icon, notes, tags, fields })
  }

  addField({ id, label, value, type }) {
    this.fields.push(new Field({ id, label, value, type }))
  }

  trimValues() {
    for (const i in this) {
      const val = this[i]
      if (val && typeof val === 'string') {
        this[i] = val.trim()
      } else if (i === 'fields') {
        val.forEach((field) => {
          field.trimValues()
        })
      }
    }
  }

  removeField(id) {
    const deleteIndex = this.fields.find((f) => f.id === id)
    this.fields.splice(deleteIndex, 1)
  }

  equals(item) {
    return (
      item &&
      this.id === item.id &&
      this.title === item.title &&
      this.icon === item.icon &&
      this.notes === item.notes &&
      arraysEqual(this.tags, item.tags) &&
      arraysEqual(this.fields, item.fields)
    )
  }

  toJson() {
    const obj = (({ categoryID, title, icon, notes, tags, fields }) => ({
      categoryID,
      title: title && title.trim(),
      icon,
      notes: notes && notes.trim(),
      tags,
      fields: fields.map((f) => f.toJson()),
    }))(this)
    return obj
  }

  toOverviewJson() {
    const obj = (({ categoryID, title, icon, tags }) => ({
      categoryID,
      title,
      icon,
      tags,
    }))(this)
    return obj
  }
}

function arraysEqual(a, b) {
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; i++)
      if (!arraysEqual(a[i], b[i])) return false

    return true
  } else {
    if (a instanceof Field) return a.equals(b)
    return a === b
  }
}
