import sha512 from 'crypto-js/sha512'
import hmacSha512 from 'crypto-js/hmac-sha512'

export function randomSalt() {
  const str = randomHashString()
  return sha512(str).toString()
}

export function hmac512(data, salt, vk) {
  const key = sha512(vk + salt).toString()
  return hmacSha512(data, key).toString()
}

function randomHashString() {
  const arr = new Uint8Array(16)
  const time = new Date().getTime()
  const cryptoObj = window.crypto || window.msCrypto
  cryptoObj.getRandomValues(arr)
  const prefix = `${decodeUint8Array(arr) || ''}`
  const paddingCount = 100 * Math.random() + 30
  let padding = '_'
  for (let i = 0; i < paddingCount; i++)
    padding += String.fromCharCode(61 * Math.random() + 64)
  return `${prefix}_${padding}_${time}`
}

function decodeUint8Array(arr) {
  return new TextDecoder('utf-8').decode(arr)
}
