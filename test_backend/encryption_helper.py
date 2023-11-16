from nacl.secret import SecretBox
from base64 import urlsafe_b64encode
import nacl.secret
import nacl.utils

KEY = bytes('9z$C&F)J@NcRfUjXn2r4u7x!A%D*G-Ka', 'utf8')

#
# Helper function to encrypt passwords/tokens
#
def encrypt(message):

    message = bytes(message, 'utf8')
    nonce = nacl.utils.random(24)
    box = SecretBox(KEY)
    encrypted = box.encrypt(message, nonce)

    return urlsafe_b64encode(encrypted).decode('ascii')