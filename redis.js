var redis = require('redis'),
    client = redis.createClient();

client.on('ready', function (err) {
    if (err) {
        console.log('Error:' + err);
        return;
    }
    client.set('author', 'Wilson', redis.print);
    client.get('author', redis.print);
    client.hmset('short', {'js': 'javascript', 'C#': 'C Sharp'}, redis.print);
    client.hmset('short', 'SQL', 'Structured Query Language', 'HTML', 'HyperText Mark-up Language', redis.print);
    client.hgetall("short", function (err, res) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        console.dir(res);
    });

    var key = 'skills';
    client.sadd(key, 'C#', 'java', redis.print);
    client.sadd(key, 'nodejs');
    client.sadd(key, "MySQL");
    client.multi()
        .sismember(key, 'C#')
        .smembers(key)
        .exec(function (err, replies) {
            console.log("MULTI got " + replies.length + " replies");
            replies.forEach(function (reply, index) {
                console.log("Reply " + index + ": " + reply.toString());
            });
            client.quit();
        });
});