const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let todosSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    completed: Boolean
});

module.exports = mongoose.model('todos',todosSchema);
