var mongodb = require('./mongodb_connection');
var CompanySchema = new mongodb.Schema({
    name: String,
    company: String,
    phone: String
});

CompanySchema.methods = {
    Company_Save: function (company, cb) {
        var parent = this.model("CompanyModel");
        parent.collection.insert(company, function (err, result) {
            if (!err) {
                company.id = result.insertedIds[0];
            }
            cb(err, company);
        })
    },
    Company_Query: function (phone, cb) {
        this.model("CompanyModel").findOne({phone: phone}).exec(function (err, result) {
            if (err) {
                cb({valid: true})
            } else {
                if (result) {
                    cb({valid: false, id: result._doc._id});
                } else {
                    cb({valid: true});
                }
            }
        })
    }
};

module.exports = mongodb.model('CompanyModel', CompanySchema, 'company');