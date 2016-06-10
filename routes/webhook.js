var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var exec = require('child_process').exec;

/* GET home page. */
router.get('/', function(req, res) {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

// var token = "EAAXLNrHrrHQBAMWiEdoVzZCUu5X5rkzjavEpnZBXbA4yZAsPZBa4UzXsmlU9sxPTo5Se8t61yuvZAnZAJHP4jH6IQtVKGME5S8pGkBzwPG1k3F2Y9m7ioWrfhZAUN8lffjAUGkLZBwQaoB1Mj1HfmeSNHY5XLpZBcjbHoZAcJSBJwEK5QHZBdLE7zZBC";

router.post('/', jsonParser, function (req, res) {
  var events = req.body.entry[0].messaging;
  // for (i = 0; i < events.length; i++) {
    // var event = events[i];
    var event = events[0];
    if (!(Object.keys(event.message) === 0) && event.message.text) {
      sendTextMessage(event.sender.id, event.message.text);
    }
  // }
  res.sendStatus(200);
})

function sendTextMessage(sender, text) {
  console.log('outside if: '+text)
  if (text.toLowerCase() === "ping") {
    console.log('inside if: '+text)
    var cmd = 'curl -X POST -H "Content-Type: application/json" -d \'{"recipient":{"id":"'+recipientId+'"}, "message":{"text":"hello, '+text+'!"}}\' "https://graph.facebook.com/v2.6/me/messages?access_token='+process.env.PAGE_ACCESS_TOKEN+'"';
    console.log('send command: '+cmd);
    exec(cmd, function(error, stdout, stderr) {
      console.log('Masuk exec: '+stderr+' : '+error)
    });
    // request({
    //   url: 'https://graph.facebook.com/v2.6/me/messages?access_token='+process.env.PAGE_ACCESS_TOKEN,
    //   method: 'POST',
    //   body: {
    //     recipient: {id: recipientId},
    //     message: {text: "Echo: " + text },
    //   }
    // }, function(error, response, body) {
    //   // if (!error && response.statusCode == 200) {
    //     console.log(body) // Show the HTML for the Google homepage.
    //   // }
    //   if (error) {
    //     console.log('Error sending message: ', error);
    //   } else if (response.body.error) {
    //     console.log('Error: ', response.body.error);
    //   }
    // });
  }
}

module.exports = router;
