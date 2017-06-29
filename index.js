var sprintf = require('sprintf-js').sprintf;
var mysql = require('mysql');
var crawler = require("crawler");

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'nba'
});

var c = new crawler({
    maxConnections: 10,
    callback: function(error, res, done) {
        if(error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            $("#schedule tbody tr").each(function(row) {
                var date = $(this).find("[data-stat='date_game']").text();
                var start_time = $(this).find("[data-stat='game_start_time']").text();
                var ts = new Date(date + ' ' + start_time).getTime();
                var visitor_team_name = $(this).find("[data-stat='visitor_team_name']").text();
                var visitor_pts = $(this).find("[data-stat='visitor_pts']").text();
                var home_team_name = $(this).find("[data-stat='home_team_name']").text();
                var home_pts = $(this).find("[data-stat='home_pts']").text();
                var box_score_link = $(this).find("[data-stat='box_score_text'] a").attr('href');
                var overtimes = $(this).find("[data-stat='overtimes']").text();
                // connection.query(
                //     sprintf('insert into game (%s, %s)',
                //     date,
                //
                // ), function(err, results, fields) {
                //     if (err) throw err;
                // });
                var query = sprintf(
                    "insert into game (ts, a_team, a_score, h_team, h_score, link, ot) values (%s, '%s', %s, '%s', %s, '%s', '%s')",
                    ts,
                    visitor_team_name,
                    visitor_pts,
                    home_team_name,
                    home_pts,
                    box_score_link,
                    overtimes
                );
                connection.query(query, function(err) {
                    if (err) throw err;
                })
            });
        }
        done();
    }
});

var nbaReference = 'http://www.basketball-reference.com';
var gameYears = [
    '2017',
];
var gameMonths = [
    'october',
];

gameYears.forEach(function(year) {
    gameMonths.forEach(function(month) {
        c.queue(nbaReference + '/leagues/NBA_' + year + '_games-' + month + '.html');
    });
});
