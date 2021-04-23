import Field from './field'

export default class Item {
  constructor({
    id,
    title = 'Untitled',
    icon = 'mdi-key-variant',
    notes = '',
    tags = [],
    fields = [],
  }) {
    Object.assign(this, { id, title, icon, notes, tags, fields })
  }

  addField({ id, label, value, type }) {
    this.fields.push(new Field({ id, label, value, type }))
  }

  removeField(id) {
    const deleteIndex = this.fields.find((f) => f.id === id)
    this.fields.splice(deleteIndex, 1)
  }

  equals(item) {
    return (
      this.id === item.id &&
      this.title === item.title &&
      this.icon === item.icon &&
      this.notes === item.notes &&
      arraysEqual(this.tags, item.tags) &&
      arraysEqual(this.fields, item.fields)
    )
  }
}

function arraysEqual(a, b) {
  /*
      Array-aware equality checker:
      Returns whether arguments a and b are == to each other;
      however if they are equal-lengthed arrays, returns whether their
      elements are pairwise == to each other recursively under this
      definition.
  */
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length)
      // assert same length
      return false
    for (
      let i = 0;
      i < a.length;
      i++ // assert each element equal
    )
      if (!arraysEqual(a[i], b[i])) return false
    return true
  } else {
    return a === b // if not both arrays, should be the same
  }
}
