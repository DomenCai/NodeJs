//引入mongodb模块，获得客户端对象
var MongoClient = require('mongodb').MongoClient;
//连接字符串
var DB_CONN_STR = 'mongodb://localhost:27017/chihuo';

//定义函数表达式，用于操作数据库并返回结果
var insertData = function (db, callback) {
    //获得指定的集合
    var collection = db.collection('users');
    //插入数据
    var data = [{_id: 7, name: 'rose', password: 21}, {_id: 8, name: 'mark', password: 22}];

    collection.insert(data, function (err, result) {
        //如果存在错误
        if (err) {
            console.log('Error:' + err);
            return;
        }
        //调用传入的回调方法，将操作结果返回
        callback(result);
    });
};

//使用客户端连接数据，并指定完成时的回调方法
MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    //执行插入数据操作，调用自定义方法
    insertData(db, function(result) {
        //显示结果
        console.log(result);
        //关闭数据库
        db.close();
    });
});



// var mongoose = require('mongoose');
//
// mongoose.connect('mongodb://localhost/chihuo');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     console.log('------数据库连接成功！------')
//     var kittySchema = mongoose.Schema({
//         name: String
//     });
//     var Kitten = mongoose.model('Kitten', kittySchema);
//     var silence = new Kitten({name: 'Silence'});
//     console.log(silence.name); // 'Silence'
// });



// var db = mongoose.connect('mongodb://localhost/chihuo');//；连接数据库
// var Schema = mongoose.Schema;   //  创建模型
// var userScheMa = new Schema({
//     name: String,
//     password: String
// }); //  定义了一个新的模型，但是此模式还未和users集合有关联
// // exports.user = db.model('users', userScheMa); //  与users集合关联
//
// db.connection.on("error", function (error) {
//     console.log("数据库连接失败：" + error);
// });
// db.connection.on("open", function () {
//     console.log("------数据库连接成功！------");
// });