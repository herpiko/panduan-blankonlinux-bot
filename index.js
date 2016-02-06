var fs = require('fs');
var request = require('request');
var bot = require('telegram-node-bot')('telegramtoken');
var swearWords = fs.readFileSync('swearwordlist.txt').toString().split("\n");
var botName = 'wakijo';
var state = 'wakeup';
var tokens = ['5fb2c0f3-2fea-48c0-ac88-cfc88084eac7','d06be67e-1542-4840-ae89-f59ed6a7642c','2c4087c8-e70c-4c97-a7a2-bac4e8534fdb','203dd4af-60c3-4bc0-aed5-8bd4addbab6f']
var currentToken = 0;
bot.router
  .when(['ping'], 'PingController')
  .when(['/jo'], 'CommandJo')

bot.controller('PingController', function(x){
  bot.for('ping', function(){
    x.sendMessage('pong');
  })
})

var failCount = 0;
var req = function(x) {
  var from = x.message.from.username;
  console.log('currentToken' + currentToken);
  request('http://sandbox.api.simsimi.com/request.p?key=' + tokens[currentToken] + '&lc=id&ft=1.0&text=' + x.message.text.replace('/ko ',''), function(err, res, body) {
    console.log(err);
    var response = JSON.parse(body).response;
    console.log(body);
    if (response) {
      failCount = 0;
      response = response.replace(/Simsimi/g, "simsimi");
      response = response.replace(/Simi/g, "simi");
      response = response.replace(/simsimi/g, botName);
      response = response.replace(/simi/g, botName);
      for (var i in swearWords) {
        if (response.toLowerCase().indexOf(swearWords[i]) > -1 && swearWords[i] != '') {
          return x.sendMessage('@' + from + ', hmmm... gak boleh saru.');
          break;
        }
      }
      x.sendMessage('@' + from + ', ' + response.toLowerCase());
    } else {
      failCount++;
      if (currentToken == 3) {
        currentToken = 0;
      } else {
        currentToken++;
      }
      req(x);
      if (failCount > 5) {
        x.sendMessage('@' + from + ', maaf, ' + botName + ' lagi pusing. besok aja lagi ya.');
      }
    }
  });

}

var reply = function(botName, x) {
  console.log(x.message);
  var from = x.message.from.username;
  var fromId = x.message.from.id;
  var text = x.message.text;
  if (text.split(' ')[1] == 'tidur') {
    state = 'sleep';
     return x.sendMessage('oke, ' + botName + ' tidur sekarangi. met malam!');
  }
  if (text.split(' ')[1] == 'bangun') {
    state = 'wakeup';
     return x.sendMessage('hoaaaahhmm.. jam berapa ini?');
  }
  if (state == 'sleep') {
     return x.sendMessage('ssstt. wakijo sedang tidur');
  }
  if (
    (text.toLowerCase().indexOf("siapa") > -1 && text.toLowerCase().indexOf("nama") > -1) ||
    (text.toLowerCase().indexOf("siapa") > -1 && text.toLowerCase().indexOf("kamu") > -1)
  ) {
    x.sendMessage('hai @' + from + ', namaku ' + botName);
  } else {
    req(x);
  }
}
bot.controller('CommandJo', function(x){
  var botName = 'wakijo';
  reply(botName, x)
})
