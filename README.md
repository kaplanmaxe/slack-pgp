# slack-gpg

Send PGP encrypted messages via Slack!

This is a proof-of-concept right now. The slack commands will encrypt your message for you. Once the encrypted message is sent back to you, you will then need to copy and paste the text to the recipient.

This application is set up without a database so no messages will be stored.

### Usage

The key must be imported before attempting to encrypt with it.

```
/gpg-import [key-id] (Pulls from pgpkeys.mit.edu)
/gpg-encrypt [message] [key-id]
```

### Examples

```
/gpg-import 12345678
/gpg-encrypt "this is an encrypted message" 12345678 
```
