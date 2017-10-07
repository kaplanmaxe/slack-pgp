# slack-gpg

### Installation

<a href="https://slack.com/oauth/authorize?&client_id=250370873093.252347362529&scope=commands"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>

### About

Send PGP encrypted messages via Slack!

This is a proof-of-concept right now. The slack commands will encrypt your message for you. Once the encrypted message is sent back to you, you will then need to copy and paste the text to the recipient.

In this code base, the plain text message from the command is never stored in a database.

<img src="https://i.imgur.com/G1sOlqV.gif" width="750" />

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

### Decryption

To decrypt a message, copy the encrypted text. On your local computer run:

```
echo "PGP_ENCRYPTED_TEXT" | gpg --decrypt
```

### What's next?

- Encrypt with multiple keys
- Pass slack username and match key to username.
- Figure out a way to send the message via the slack command to the current open chat window.
