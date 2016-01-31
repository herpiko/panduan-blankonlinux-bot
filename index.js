var fs = require('fs');
var request = require('request');
var bot = require('telegram-node-bot')('175281371:AAHX1dRSkDCedUqG1agznkHZiEFaypE1psQ');
var swearWords = fs.readFileSync('swearwordlist.txt').toString().split("\n");
var botName = 'wakijo';
bot.router
  .when(['ping'], 'PingController')
  .when(['/jo'], 'Command');

bot.controller('PingController', function(x){
  bot.for('ping', function(){
    x.sendMessage('pong');
  })
})
bot.controller('Command', function(x){
  bot.for('/jo', function(x){
    console.log(x.message);
    var from = x.message.from.username;
    var text = x.message.text;
    if (
      (text.toLowerCase().indexOf("siapa") > -1 && text.toLowerCase().indexOf("nama") > -1) ||
      (text.toLowerCase().indexOf("siapa") > -1 && text.toLowerCase().indexOf("kamu") > -1)
    ) {
      x.sendMessage('hai ' + from + ', namaku ' + botName);
    } else {
      request('http://sandbox.api.simsimi.com/request.p?key=d06be67e-1542-4840-ae89-f59ed6a7642c&lc=id&ft=1.0&text=' + x.message.text.replace('/ko ',''), function(err, res, body) {
        console.log(err);
        var response = JSON.parse(body).response;
        console.log(body);
        if (response) {
          for (var i in swearWords) {
            console.log(swearWords[i]);
            console.log(response);
            console.log(response.toLowerCase().indexOf(swearWords[i]));
            if (response.toLowerCase().indexOf(swearWords[i]) > -1) {
              return x.sendMessage('@' + from + ', hmmm...');
              break;
            }
          }
          if (response.toLowerCase().indexOf("simsimi")) {
            response = response.replace("Simsimi", "simsimi");
            response = response.replace("simsimi", botName);
            response = response.replace("simi", botName);
          }
          x.sendMessage('@' + from + ', ' + response.toLowerCase());
        } else {
          x.sendMessage('@' + from + ', maaf, ' + botName + ' lagi pusing. besok aja lagi ya.');
        }

      });
    }
  })
})
