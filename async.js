var async = require('async');

// var concurrencyCount = 0;
// var fetchUrl = function (url, callback) {
//     var delay = parseInt((Math.random() * 10000000) % 2000, 10);
//     concurrencyCount++;
//     console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
//     setTimeout(function () {
//         concurrencyCount--;
//         callback(null, url + ' html content');
//     }, delay);
// };
//
// var urls = [];
// for(var i = 0; i < 30; i++) {
//     urls.push('http://datasource_' + i);
// }
//
// async.mapLimit(urls, 5, function (url, callback) {
//     fetchUrl(url, callback);
// }, function (err, result) {
//     console.log('final:');
//     console.log(result);
// });

async.series({
    one: function(callback){
        setTimeout(function () {
            callback(null, 1)
        }, 1000);
    },
    two: function(callback){
        callback(null, 2);
    }
},function(err, results) {
    console.dir(results);
});

async.waterfall([
    function(callback){
        callback(null, 'one', 'two');
    },
    function(arg1, arg2, callback){
        // arg1 now equals 'one' and arg2 now equals 'two'
        callback(null, 'three');
    },
    function(arg1, callback){
        // arg1 now equals 'three'
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
    console.log(result);
});

async.parallel([
    function (callback) {
        setTimeout(function () {
            callback(null, 'one')
        }, 2000);
    },
    function (callback) {
        setTimeout(function () {
            callback(null, 'two')
        }, 1000);
    }
], function (err, results) {
    console.log(results);
});
