var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === "bilna_facebook_chat_bot_apps") {
    res.send(req.query['hub.challenge']);
    // res.send("test")
  } else {
    res.send('Error, wrong validation token');    
  }
});

var token = "EAAXLNrHrrHQBAMWiEdoVzZCUu5X5rkzjavEpnZBXbA4yZAsPZBa4UzXsmlU9sxPTo5Se8t61yuvZAnZAJHP4jH6IQtVKGME5S8pGkBzwPG1k3F2Y9m7ioWrfhZAUN8lffjAUGkLZBwQaoB1Mj1HfmeSNHY5XLpZBcjbHoZAcJSBJwEK5QHZBdLE7zZBC";

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      var text = event.message.text
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
