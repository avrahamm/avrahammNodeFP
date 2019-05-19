const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let phonesSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    phone_type: String,
    phone_number: String,
});

if (!phonesSchema.options.toObject) {
    phonesSchema.options.toObject = {};
}

phonesSchema.options.toObject.transform = function (doc, ret, options) {
    // remove the __v of every document before returning the result
    delete ret.__v;
    return ret;
};

module.exports = mongoose.model('phones',phonesSchema);
