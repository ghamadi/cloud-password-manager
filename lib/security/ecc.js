import { box, randomBytes } from 'tweetnacl'
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from 'tweetnacl-util'

/**
 *
 * @param {Uint8Array} publicKey of the receiver (32 bytes)
 * @param {Uint8Array} secretKey of the sender (32 bytes)
 * @param {Object} data to be encrypted
 * @returns an encryption of passed data which can only be decrypted by the receiver's secret key
 */
export function encrypt(publicKey, secretKey, data) {
  const nonce = randomBytes(box.nonceLength)
  const messageUint8 = decodeUTF8(JSON.stringify(data))
  const encrypted = box(
    messageUint8,
    nonce,
    Uint8Array.from(publicKey),
    Uint8Array.from(secretKey)
  )

  const fullMessage = new Uint8Array(nonce.length + encrypted.length)
  fullMessage.set(nonce)
  fullMessage.set(encrypted, nonce.length)

  const base64FullMessage = encodeBase64(fullMessage)
  return base64FullMessage
}

/**
 *
 * @param {Uint8Array} publicKey of the sender (32 bytes)
 * @param {Uint8Array} secretKey of the receiver (32 bytes)
 * @param {String} messageWithNonce encrypted message (with appended nonce) to be decrypted
 * @returns Object of the decrypted data
 */
export function decrypt(publicKey, secretKey, messageWithNonce) {
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce)
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength)
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonce.length
  )

  const decrypted = box.open(
    message,
    nonce,
    Uint8Array.from(publicKey),
    Uint8Array.from(secretKey)
  )

  if (!decrypted) {
    throw new Error('Could not decrypt message')
  }

  const base64DecryptedMessage = encodeUTF8(decrypted)
  return JSON.parse(base64DecryptedMessage)
}
