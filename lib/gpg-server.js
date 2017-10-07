'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _child_process = require('child_process');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var app = (0, _express2.default)();
_http2.default.createServer(app).listen(process.env.PORT);
app.use(_bodyParser2.default.urlencoded({ extended: false }));

/**
 * GPG endpoint
 */
app.post('/api/v1/gpg', function (req, res) {
  var msg = parseMessage(req.body.text);
  // Need to be able to use | so we use sh
  var process = (0, _child_process.spawn)('sh', ['-c', 'echo ' + msg.message + ' | gpg --encrypt --armor -r ' + msg.key]);

  process.stdout.on('data', function (data) {
    res.status(200).json({ text: data.toString() });
  });

  process.stderr.on('data', function (err) {
    res.status(400).json({ text: err.toString() });
  });
});

app.get('/api/v1/auth', function (req, res) {
  var options = {
    uri: 'https://slack.com/api/oauth.access?code=' + req.query.code + '&client_id=' + process.env.CLIENT_ID + '&client_secret=' + process.env.CLIENT_SECRET + '&redirect_uri=' + process.env.REDIRECT_URI,
    method: 'GET'
  };
  (0, _request2.default)(options, function (error, response, body) {
    var success = JSON.parse(body).ok;
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
  var message = msg.split(' ');
  return {
    message: message[0],
    key: message[1]
  };
}