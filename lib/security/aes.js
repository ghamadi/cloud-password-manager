import { secretBox, randomBytes } from 'tweetnacl'
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from 'tweetnacl-util'

export function encrypt(key, data) {
  const nonce = randomBytes(secretBox.nonceLength)
  const messageUint8 = decodeUTF8(JSON.stringify(data))
  const box = secretBox(messageUint8, nonce, key)

  const fullMessage = new Uint8Array(nonce.length + box.length)
  fullMessage.set(nonce)
  fullMessage.set(box, nonce.length)

  const base64FullMessage = encodeBase64(fullMessage)
  return base64FullMessage
}

export function decrypt(key, dataWithNonce) {
  const messageWithNonceAsUint8Array = decodeBase64(dataWithNonce)
  const nonce = messageWithNonceAsUint8Array.slice(0, secretBox.nonceLength)
  const message = messageWithNonceAsUint8Array.slice(
    secretBox.nonceLength,
    dataWithNonce.length
  )

  const decrypted = secretBox.open(message, nonce, key)

  if (!decrypted) {
    throw new Error('Could not decrypt message')
  }

  const base64DecryptedMessage = encodeUTF8(decrypted)
  return JSON.parse(base64DecryptedMessage)
}
