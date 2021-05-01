import Field from './field'
import Item from './item'

export default class SharedItem extends Item {
  constructor(itemData, { sharedWith, sharedBy }) {
    super(itemData)
    this.sharedBy = sharedBy
    this.sharedWith = sharedWith
    this.fields =
      (itemData.fields && itemData.fields.map((f) => new Field(f))) || []
  }

  toOverviewJson() {
    const obj = super.toOverviewJson()
    obj.sharedBy = this.sharedBy
    obj.sharedWith = this.sharedWith
    return obj
  }

  toJson() {
    const obj = super.toJson()
    obj.sharedBy = this.sharedBy
    obj.sharedWith = this.sharedWith
    obj.fields = this.fields.map((f) => new Field(f))
    console.log('FIELDS', this.fields, obj.fields)
    return obj
  }
}
