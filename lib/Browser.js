const puppeteer = require('puppeteer');
const cheerio   = require('cheerio');
const promise   = require('promise');

var Browser = function(){

  this.me;

  this.init = () => {

    return new Promise(

      (resolve, reject) => {

        puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
          .then(browser => {

            this.me = browser;
            return resolve(true)

          })

      }

    )

  }

}

Browser.prototype.getItems = async function(url) {

  var self = this;
  var page = await self.me.newPage();
  await page.goto(url);
  var content = await page.content();
  var $ = cheerio.load(content);

  var len = $(".search-results-grid").children().length;
  var shoes = $(".search-results-grid").children();

  var items = [];

  for(var i = 0; i < len - 1; i++){

    if(shoes[i]){

      var item = $($(shoes[i]).next().html());
      var root = $($(shoes[i]).next())
      var a = $(root.children()[0]);
      var b = $($(a.next()).html());
      var c = $(b.children()[0])
      var d = $(c.html())
      var price = $(d[0]).text();

      items.push({

        image: item[0].children[0].attribs["src"],
        name: $(item[0].children[1]).html().replace(/<br>/g, " - "),
        price: "Lowest ask: " + price,
        url: a[0].attribs.href

      })

    }

  }

  return items;

};

module.exports = Browser;
