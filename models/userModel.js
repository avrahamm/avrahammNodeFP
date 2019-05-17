const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let usersSchema = new Schema({
    id : Number,
    name : String,
    username : String,
    email : String,
    address: Object,
    phone : String,
    website : String,
    company: Object,
});

if (!usersSchema.options.toObject) {
    usersSchema.options.toObject = {};
}

usersSchema.options.toObject.transform = function (doc, ret, options) {
    // remove the __v of every document before returning the result
    delete ret.__v;
    return ret;
};

module.exports = mongoose.model('users',usersSchema);
