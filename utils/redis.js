const settings = require("../settings");

var redis = require('redis'),
    port = settings.redis.port;
    host = settings.redis.host;
    opts = {};

var client = redis.createClient(port, host); //port, host, opts

client.on("ready", function (res) {
    console.log('ready');
});


var method = {
    set: function(key, value, cb, expire_time) {
        client.set(key, value, function(err, res) {
            var json = {};
            if (err) {
                json.success = false;
                json.error = err;
            } else {
                json.success = true;
                json.result = res;
                if (expire_time)
                    client.expire(key, expire_time);
            }
            cb(json);
        })
    },
    get: function(key, cb, expire_time) {
        if (expire_time) {
            client.expire(key, expire_time);
        }
        client.get(key, function(err, res) {
            var json = {};
            if (err) {
                json.success = false;
                json.error = err;
            } else {
                json.success = true;
                json.result = res;
            }
            cb(json);
        });
    }
};


module.exports = method;