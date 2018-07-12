console.log("Loading...");
const Browser   = require("./lib/Browser");
const nodeogram = require("nodeogram");
const fs        = require("fs");
const config    = JSON.parse(fs.readFileSync('config.json'));

var browser = new Browser();
var bot = new nodeogram.Bot(config.key);
var timer;
const InlineQueryResultPhoto = nodeogram.InlineQueryResultPhoto;

browser.init()
  .then(success => {

    console.log("StockX bot is ready!")

    bot.init();

    bot.on('inline_query', (query) => {

    if(query.query.trim() == "")
      return;

    clearTimeout(timer);
    timer = setTimeout(() => {

      console.log("executing search...")
      var item = query.query.replace(/\s/g, "%20");
      console.log(item)
      browser.getItems('https://stockx.com/search?s=' + item)
        .then(items => {

          var answers = [];

          for(item in items){

            var pieces = items[item].image.split(/(\.jpg|\.png)/);
            var image = pieces[0] + pieces[1];

            if(image.includes("stockx-assets"))
              continue;

            answers.push(

              new InlineQueryResultPhoto(
                String(item),
                String(image),
                String(image),
                {
                  message_text: '<a href="' + items[item].image + '">&#8205;</a>\n<b>' + items[item].name + '</b>\n' + items[item].price + '\n<a href="https://stockx.com/'+items[item].url+'">View it on StockX</a>',
                  parse_mode: 'html',
                  disable_web_page_preview: false
                }
              )


            )

          }

          if(answers.length == 0)
            answers.push(new InlineQueryResultArticle('null', 'No results found', {message_text: 'No results found for ' + item}, {description: 'Nope.'}))
          query.answer(answers);

        })

    }, 1000)

    });

    bot.command('start', 'Starts the bot', false, (args, message) => {

      message.reply("Welcome to the StockX unofficial bot, dear " + message.from.username + "!\nThis bot is still in testing mode, but it does its job, that is fetching data about an item on StockX via inline queries.\nTry writing in any chat you want '@stockxbot Supreme Split Tee' (without quotes, obviously) and see the result!");

    })

})
