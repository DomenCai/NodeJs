var superagent = require("superagent");
var charset = require('superagent-charset');
charset(superagent);
var cheerio=require("cheerio");
var express = require('express');
var app = express();
var baseUrl = 'http://www.mmjpg.com/';

app.get('/', function(req, res){
    superagent.get(baseUrl).end(function(error,data){
        if(error){
            console.log("error exception occured !");
            return res.error(error);
        }
        var $ = cheerio.load(data.text); //注意传递的是data.text而不是data本身
        var arr = [];
        $('.main .pic li').each(function (idx, element) {
            var $element = $(element);
            var $img = $element.find('a').children('img');
            arr.push({
                "title": $img.attr('alt'),
                "href": $element.find('a').attr('href'),
                "src": $img.attr('src'),
                "view": $element.find('.view').text()
            });
        });
        // console.log(arr);
        res.send(arr);
    });
});

app.listen(8000, function () {
    console.log('app is listening at port 8000');
});
console.log('Server running at http://127.0.0.1:8000/');