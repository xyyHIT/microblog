var mongodb = require('./mongodb_connection');
var UserSchema = new mongodb.Schema({
    name: String,
    password: String
});

UserSchema.methods = {
    User_Save: function (name, password, cb) {
        var user = {
            name: name,
            password: password
        }
        var parent = this.model("UserModel");
        parent.collection.insert(user, function (err, result) {
            cb(err, user);
        })
    },
    User_Query: function (name, cb) {
        this.model("UserModel").findOne({name: name}).exec(function (err, result) {
            if (err) {
                cb(err, null);
            } else {
                cb(err, result);
            }
        })
    }

};

module.exports = mongodb.model('UserModel', UserSchema, "User");