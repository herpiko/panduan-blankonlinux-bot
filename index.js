var fs = require('fs');
var request = require('request');
var bot = require('telegram-node-bot')('368924947:AAH25Il5ocoGOfmdJQ_CiP7-3v76ph6cJs0');
var botName = 'PanduanBot';
var state = 'wakeup';
bot.router
  .when(['ping'], 'PingController')
  .when(['/panduan'], 'Commands')

bot.controller('PingController', function(x){
  bot.for('ping', function(){
    x.sendMessage('pong');
  })
})

var reply = function(botName, x) {
  console.log(x.message);
  var from = x.message.from.username;
  var fromId = x.message.from.id;
  var text = x.message.text;
  if (
    (text.toLowerCase().indexOf("siapa") > -1 && text.toLowerCase().indexOf("nama") > -1) ||
    (text.toLowerCase().indexOf("siapa") > -1 && text.toLowerCase().indexOf("kamu") > -1)
  ) {
    x.sendMessage('hai @' + from + ', namaku ' + botName);
  } else {
    req(x);
  }
}
bot.controller('Commands', function(x){
  reply(botName, x)
})
