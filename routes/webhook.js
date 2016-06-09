var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res) {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

// var token = "EAAXLNrHrrHQBAMWiEdoVzZCUu5X5rkzjavEpnZBXbA4yZAsPZBa4UzXsmlU9sxPTo5Se8t61yuvZAnZAJHP4jH6IQtVKGME5S8pGkBzwPG1k3F2Y9m7ioWrfhZAUN8lffjAUGkLZBwQaoB1Mj1HfmeSNHY5XLpZBcjbHoZAcJSBJwEK5QHZBdLE7zZBC";

router.post('/', function (req, res) {
  var events = req.body.entry[0].messaging;
  for (i = 0; i < events.length; i++) {
      var event = events[i];
      if (event.message && event.message.text) {
          sendTextMessage(event.sender.id, event.message.text);
      }
  }
  res.sendStatus(200);
})

function sendTextMessage(sender, text) {
  console.log('Sender ID : '+sender)
  console.log(text)
  if (text.toLowerCase() == "ping") {
    text = {text: "Echo: " + text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
  }
}

module.exports = router;
