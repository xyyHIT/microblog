var mongodb = require('./mongodb_connection');
var PostSchema = new mongodb.Schema({
    user: String,
    post: String,
    time: {type: Date, default: Date.now}
});

PostSchema.methods = {
    Post_Save: function (user, post, cb) {
        var post = {
            user: user,
            post: post
        }
        var parent = this.model("PostModel");
        parent.collection.insert(post, function (err, result) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, post);
            }
        })
    },

    Post_Query: function (user, cb) {
        var where = {};
        if (user) {
            where = {user: user}
        }
        this.model("PostModel").find(where).exec(function (err, result) {
            if (err) {
                cb(err, null);
            } else {
                var posts = [];
                result.forEach(function (doc) {
                    posts.push(doc);
                });
                cb(null, posts);
            }
        });
    }
};

module.exports = mongodb.model("PostModel", PostSchema, "Post");