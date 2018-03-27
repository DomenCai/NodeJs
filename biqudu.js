var superagent = require("superagent");
var cheerio=require("cheerio");
var express = require('express');
var app = express();
var baseUrl = 'https://www.biqudu.com/paihangbang/';

superagent.get(baseUrl).end(function(error,data){
    if(error){
        console.log("error exception occured !");
        return res.error(error);
    }
    // console.log(data.text);
    var $ = cheerio.load(data.text); //注意传递的是data.text而不是data本身
    var arr = [];
    $('.tbo').each(function (idx, element) {
        var $element = $(element);
        var $img = $element.find('.fen-top ul');
        console.log($img.text())
    //     arr.push({
    //         "title": $img.attr('alt'),
    //         "href": $element.find('a').attr('href'),
    //         "src": $img.attr('data-original').replace('http://i.meizitu.net/', 'http://127.0.0.1:3000/img/'),
    //         "view": $element.find('.view').text()
    //     });
    });
    console.log(arr);
    // res.send(arr);
});