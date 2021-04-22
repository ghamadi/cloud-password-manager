import pbkdf2 from 'crypto-js/pbkdf2'
import { box } from 'tweetnacl'

export default function KeyGen(email, masterPassword) {
  const hashedMP = ((email, pass) => {
    const salt = pbkdf2(email, '', { keySize: 128 / 32 })
    return pbkdf2(pass, salt, {
      keySize: 128 / 32,
      iterations: 100000,
    })
  })(email, masterPassword)

  const keyPair = box.keyPair.fromSecretKey(encodeUint8Arr(hashedMP))

  const authPass = (() => {
    const salt = pbkdf2(masterPassword, '', { keySize: 128 / 32 })
    const authPass = pbkdf2(hashedMP, salt, { keySize: 256 / 32 })
    return authPass.toString()
  })()

  return {
    get vaultKey() {
      return keyPair.secretKey
    },

    get publicKey() {
      return keyPair.publicKey
    },

    get authKey() {
      return authPass
    },
  }
}

function encodeUint8Arr(myString) {
  return new TextEncoder('utf-8').encode(myString)
}
