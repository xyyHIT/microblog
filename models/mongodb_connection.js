dbOptions = {
    useMongoClient: true,
    autoReconnect: true,
    poolSize: 5
};

var mongoose = require('mongoose');
var settings = require('../settings');
mongoose.connect(settings.mongodb_url);
module.exports = mongoose;