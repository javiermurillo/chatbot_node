'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Process data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES 

app.get('/', function(req,res){
  res.send("Hello world human!")
})

let token = '' // fb token here

    //  Webhook
app.get('/webhook/',function(req,res){
  if (req.query['hub.verify_token'] === 'YOUR_TOKEN_HERE'){ // Replace for the token of your app
    res.send(req.query['hub.challenge'])
  }
  res.send('Wrong token')

})

    //  Webhook - POST when get message
app.post('/webhook', function(req,res){
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++){
    let event = messaging_events[i]
    let sender = event.sender.id
    if (event.message && event.message.text){
      let text = event.message.text
      // IA Logic
      sendText(sender,"Your message was: " + text)
    }
  }
  res.sendStatus(200)
})

function sendText(sender,text){
  let messageData = {text: text}
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs : {access_token : token},
    method: "POST",
    json: {
      recipient: {id: sender},
      message: messageData,
    }
  }, function(error, response, body){
    if (error){
      console.log("sending error")
    } else if (response.body.error) {
      console.log(response.body)
      console.log("response body error")
    }
  })
}



app.listen(app.get('port'), function(){
  console.log("running: port")
})