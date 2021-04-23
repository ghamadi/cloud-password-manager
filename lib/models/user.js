// export function User(userInfo) {
//   const { uid, name, email, verified } = userInfo
//   Object.assign(this, { uid, name, email, verified })
// }

export default class User {
  constructor({ id, uid, name, email, verified }) {
    Object.assign(this, { id, uid, name, email, verified })
  }

  get items() {
    return this.userItems || []
  }

  set items(val) {
    this.userItems = val ? [...val] : this.userItems || []
  }
}
