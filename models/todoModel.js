const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let todosSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    completed: Boolean
});

if (!todosSchema.options.toObject) {
    todosSchema.options.toObject = {};
}

todosSchema.options.toObject.transform = function (doc, ret, options) {
    // remove the __v of every document before returning the result
    delete ret.__v;
    return ret;
};
module.exports = mongoose.model('todos',todosSchema);
