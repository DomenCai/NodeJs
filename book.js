var superagent = require("superagent");
var eventProxy = require('eventproxy');
var express = require('express');
var schedule = require('node-schedule');

const IMG = 'http://statics.zhuishushenqi.com';
const recommend = 'http://api.zhuishushenqi.com/book/recommend';
const rank = 'http://api.zhuishushenqi.com/ranking';
const cats = 'http://api.zhuishushenqi.com/cats/lv2/statistics';
const bookList = 'http://api.zhuishushenqi.com/book-list';

var app = express();
var result = {};

var get = function (url, callback) {
    superagent.get(url).end(function (error, data) {
        if (error) {
            console.log('error: ' + error.message);
            return;
        }
        callback(JSON.parse(data.text));
    });
};

var getWithParams = function (url, param, callback) {
    superagent.get(url).query(param).end(function (error, data) {
        if (error) {
            console.log('error: ' + error.message);
            return;
        }
        callback(JSON.parse(data.text));
    });
};

var inArray = function (str, arr) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === str) return true;
    }
    return false;
};

var getRecommend = function (url) {
    getWithParams(url, {gender: 'male'}, function (data) {
        result.maleRecomend = data.books;
    });

    getWithParams(url, {gender: 'female'}, function (data) {
        result.femaleRecommend = data.books;
    });
};

var getRanking = function (url) {
    get(url, function (data) {
        var names = ['最热榜', '留存榜', '完结榜'];
        var ranks = data.rankings.slice(0, 3);
        var ep = new eventProxy();
        ranks.forEach(function (item, index) {
            get(rank + '/' + item._id, function (data) {
                var result = {id: item._id, name: names[index], icon: IMG + item.cover};
                result.books = data.ranking.books.slice(0, 6);
                ep.emit('getRank', result);
            });
        });
        ep.after('getRank', ranks.length, function (list) {
            result.rank = list;
        });
    });
};

var getCats = function (url) {
    get(url, function (data) {
        var male = [];
        var female = [];
        var maleCats = ['玄幻', '都市', '仙侠', '科幻', '武侠'];
        var femaleCats = ['现代言情', '古代言情', '青春校园', '纯爱', '女尊'];
        data.male.forEach(function (item) {
            if (inArray(item.name, maleCats)) {
                male.push({name: item.name, count: item.bookCount, cover: item.bookCover})
            }
        });
        data.female.forEach(function (item) {
            if (inArray(item.name, femaleCats)) {
                female.push({name: item.name, count: item.bookCount, cover: item.bookCover})
            }
        });
        result.maleCats = male;
        result.femaleCats = female;
    });
};

var getBookList = function (url) {
    get(url, function (data) {
        result.bookList = data.bookLists.slice(0, 5);
    });
};

var rule = new schedule.RecurrenceRule();
rule.second = [0, 10, 20, 30, 40, 50];
schedule.scheduleJob(rule, function () {
    getRecommend(recommend);
    getRanking(rank);
    getCats(cats);
    getBookList(bookList);
    console.log(new Date());
});

app.get('/', function(req, res){
    console.log('start');
    res.send(result);
});
app.listen(3000, function () {
    console.log('app is listening at port 3000');
});
