export function User(userInfo) {
  const { uid, name, email, verified } = userInfo
  Object.assign(this, { uid, name, email, verified })
}
