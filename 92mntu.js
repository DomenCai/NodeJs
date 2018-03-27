var superagent = require("superagent");
var charset = require('superagent-charset');
charset(superagent);
var cheerio=require("cheerio");
var express = require('express');
var app = express();
var baseUrl = 'http://m.92mntu.com';

// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello\n');
// }).listen(8080);

app.get('/', function(req, res){
    superagent.get(baseUrl).end(function(error,data){
        if(error){
            console.log("error exception occured !");
            return next(error);
        }
        console.log('start');
        var $=cheerio.load(data.text); //注意传递的是data.text而不是data本身
        var arr=[];
        $('#container .post').each(function (idx, element) {
            var $element = $(element);
            arr.push({
                "title":$element.find('a').attr('title'),
                "href":baseUrl + $element.find('a').attr('href'),
                "src":$element.find('a').children('img').attr('src')
            });
        });
        console.log(arr);
        res.send(arr);
    });
});



app.listen(8080, function () {
    console.log('app is listening at port 8080');
});
console.log('Server running at http://127.0.0.1:8080/');