export function decrypt(hex) {

    const hex_string = hex.replace(/_/g, '/').replace(/-/g, '+')
    const nacl = require('tweetnacl')
    nacl.util = require('tweetnacl-util')
    const encrytped_msg = nacl.util.decodeBase64(hex_string)
    console.log("decoded " + encrytped_msg)
    const key = nacl.util.decodeUTF8('9z$C&F)J@NcRfUjXn2r4u7x!A%D*G-Ka')

    const nonce = encrytped_msg.slice(0, 24)
    const ciphertext = encrytped_msg.slice(24)
    const original_msg = nacl.secretbox.open(ciphertext, nonce, key)
    const id = nacl.util.encodeUTF8(original_msg)

    return id
}