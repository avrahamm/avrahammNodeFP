const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let postsSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    body: String,
});

module.exports = mongoose.model('posts',postsSchema);
