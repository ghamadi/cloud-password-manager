import Item from './item'

export default class SharedItem extends Item {
  constructor(itemData, { sharedWith, sharedBy }) {
    super(itemData)
    this.sharedBy = sharedBy
    this.sharedWith = sharedWith
  }

  toOverviewJson() {
    const obj = super.toOverviewJson()
    obj.sharedBy = this.sharedBy
    return obj
  }

  toJson() {
    const obj = super.toJson()
    obj.sharedBy = this.sharedBy
    return obj
  }
}
