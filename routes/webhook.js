var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (req.query['hub.verify_token'] === "bilna_facebook_chat_bot_apps") {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');    
  }
});


var token = "EAAXLNrHrrHQBAMWiEdoVzZCUu5X5rkzjavEpnZBXbA4yZAsPZBa4UzXsmlU9sxPTo5Se8t61yuvZAnZAJHP4jH6IQtVKGME5S8pGkBzwPG1k3F2Y9m7ioWrfhZAUN8lffjAUGkLZBwQaoB1Mj1HfmeSNHY5XLpZBcjbHoZAcJSBJwEK5QHZBdLE7zZBC";

router.post('/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      var text = event.message.text
      console.log(text);
      if (text === 'Generic') {
          sendGenericMessage(sender)
          continue
      }
      sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
    }
    if (event.postback) {
      var text = JSON.stringify(event.postback)
      sendTextMessage(sender, "Postback received: "+text.substring(0, 200))
      continue
    }
  }
  res.sendStatus(200)
})

function sendTextMessage(sender, text) {
  if (text.toLowerCase() == "ping") text = "Pong"
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function sendGenericMessage(sender) {
  var messageData = {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "generic",
              "elements": [{
                  "title": "First card",
                  "subtitle": "Element #1 of an hscroll",
                  "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                  "buttons": [{
                      "type": "web_url",
                      "url": "https://www.messenger.com",
                      "title": "web url"
                  }, {
                      "type": "postback",
                      "title": "Postback",
                      "payload": "Payload for first element in a generic bubble",
                  }],
              }, {
                  "title": "Second card",
                  "subtitle": "Element #2 of an hscroll",
                  "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                  "buttons": [{
                      "type": "postback",
                      "title": "Postback",
                      "payload": "Payload for second element in a generic bubble",
                  }],
              }]
          }
      }
  }
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  })
}

module.exports = router;
