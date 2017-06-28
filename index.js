var Crawler = require("crawler");

var c = new Crawler({
    maxConnections : 10,
    callback : function(error, res, done) {
        if(error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
        }
        done();
    }
});

c.queue('http://www.basketball-reference.com/leagues/NBA_2017_games-october.html');
