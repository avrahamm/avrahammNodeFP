const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let postsSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    body: String,
});

if (!postsSchema.options.toObject) {
    postsSchema.options.toObject = {};
}

postsSchema.options.toObject.transform = function (doc, ret, options) {
    // remove the __v of every document before returning the result
    delete ret.__v;
    return ret;
};

module.exports = mongoose.model('posts',postsSchema);
