var superagent = require("superagent");
var cheerio=require("cheerio");
var express = require('express');
var app = express();
var baseUrl = 'http://www.mzitu.com/';

app.get('/', function(req, res){
    console.log('start');
    superagent.get(baseUrl).end(function(error,data){
        if(error){
            console.log("error exception occured !");
            return res.error(error);
        }
        var $ = cheerio.load(data.text); //注意传递的是data.text而不是data本身
        var arr = [];
        $('#pins li').each(function (idx, element) {
            var $element = $(element);
            var $img = $element.find('a').children('img');
            arr.push({
                "title": $img.attr('alt'),
                "href": $element.find('a').attr('href'),
                "src": $img.attr('data-original').replace('http://i.meizitu.net/', 'http://127.0.0.1:3000/img/'),
                "view": $element.find('.view').text()
            });
        });
        // console.log(arr);
        res.send(arr);
    });
});

app.get('/img/*', function(req, res) {
    superagent.get('http://i.meizitu.net/' + req.params[0])
        .set('Referer', 'http://www.mzitu.com/')
        .pipe(res);
});

var get_client_ip = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    return ip;
};

app.listen(8000, function () {
    console.log('app is listening at port 8000');
});
console.log('Server running at http://127.0.0.1:8000/');