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

// curl -i -X POST -H 'Content-Type: application/json' -d '{"object":"page","entry":[{"id":43674671559,"time":1460620433256,"messaging":[{"sender":{"id":1456789},"recipient":{"id":987654321},"timestamp":1460620433123,"message":{"mid":"mid.1460620432888:f8e3412003d2d1cd93","seq":12604,"text":"Testing Chat Bot .."}}]}]}' https://bilna-chat-bot.herokuapp.com/webhook
// var token = "EAAXLNrHrrHQBAMWiEdoVzZCUu5X5rkzjavEpnZBXbA4yZAsPZBa4UzXsmlU9sxPTo5Se8t61yuvZAnZAJHP4jH6IQtVKGME5S8pGkBzwPG1k3F2Y9m7ioWrfhZAUN8lffjAUGkLZBwQaoB1Mj1HfmeSNHY5XLpZBcjbHoZAcJSBJwEK5QHZBdLE7zZBC";

router.post('/', jsonParser, function (req, res) {
  var events = req.body.entry[0].messaging;
  for (i = 0; i < events.length; i++) {
    var event = events[i];
    // var event = events[0];
    if (!(Object.keys(event.message) === 0) && event.message.text) {
      sendTextMessage(event.sender.id, event.message.text);
    }
  }
  res.sendStatus(200);
})

function sendTextMessage(sender, text) {
  // console.log('outside if: '+text)
  // if (text.toLowerCase() === "ping") {
    var recipient = '{"id": "'+sender+'"}'
    var message = '{"text": "hello, '+text+'"}'
    var data = '{"recipient": '+recipient+', "message": '+message+'}'
    var subscribe = 'curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token='+process.env.PAGE_ACCESS_TOKEN+'"'
    var cmd = 'curl -X POST -H "Content-Type: application/json" -d \''+data+'\' "https://graph.facebook.com/v2.6/me/messages?access_token='+process.env.PAGE_ACCESS_TOKEN+'"';
    exec(subscribe, function(error, stdout, stderr) {
      exec(cmd, function(error, stdout, stderr) {
        // console.log('Masuk exec, stdout: '+stdout)
      });
    });
    // console.log('send command: '+cmd);
    // console.log('inside if after cmd: '+text)
  // }
}

module.exports = router;
