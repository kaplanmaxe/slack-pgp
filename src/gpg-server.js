import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { spawn, execFile } from 'child_process';
import request from 'request';
import { MongoClient } from 'mongodb';

require('dotenv').config();

const app = express();
http.createServer(app).listen(process.env.PORT);
app.use(bodyParser.urlencoded({ extended: false }));
let db;

MongoClient.connect(process.env.MONGO_URL, { poolSize: 4 }, (err, database) => {
  if (err) console.error('Error connectiong to db');
  db = database;
});

/**
 * Encrypt endpoint
 */
app.post('/api/v1/encrypt', (req, res) => {
  const msg = parseMessage(req.body.text);
  // Need to be able to use | so we use sh.
  // We always need to trust or GPG will throw an err
  const process = spawn(
    'sh',
    ['-c', `echo ${msg.message} | gpg --encrypt --armor -r ${msg.key} --trust-model always`],
  );

  process.stdout.on('data', data => {
    res.status(200).json({ text: data.toString() });
  });

  process.stderr.on('data', err => {
    res.status(400).json({ text: err.toString() });
  });
});

/**
 * Import endpoint
 */
app.post('/api/v1/import', (req, res) => {
  const msg = parseMessage(req.body.text);
  execFile(process.env.GPG_PATH, ['--keyserver', 'pgpkeys.mit.edu', '--recv', msg.key], err => {
    db.collection(process.env.MONGO_COLLECTION).insertOne({ key: msg.key, username: msg.message });
    if (err) res.json({ text: 'Key not found on key server.' });
    res.json({ text: 'Key was successfully imported!' });
  });
});

/**
 * Auth endpoint
 */
app.get('/api/v1/auth', (req, res) => {
  const options = {
    uri: `https://slack.com/api/oauth.access?code=${req.query.code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URI}`,
    method: 'GET',
  };
  request(options, (error, response, body) => {
      const success = JSON.parse(body).ok;
      if (success) {
        res.send('GPG has successfully been added to your slack team! Click <a href="https://github.com/kaplanmaxe/slack-gpg">here</a> to go home.');
      } else {
        res.send('An error occurred. Please email info@kaplankomputing.com');
      }
  });
});

/**
 * Parses message for key and message
 * @param {string} msg Message coming from slack
 * @return {string}
 */
function parseMessage(msg) {
  return {
    message: msg.match(/"([^"]*)"/)[1],
    key: msg.split('"')[2].trim(),
  };
}
