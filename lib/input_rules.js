const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i

const required = (val) => (val && !`${val}`.match(/^\s+$/)) || 'Required field'
const min = (x) => (val) => (val && val.length >= x) || 'Minimum 8 characters'
const email = (val) =>
  (val && val.match(emailRegex) && true) || 'AUB emails only'

export default {
  required,
  min,
  email,
}
