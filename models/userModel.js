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

module.exports = mongoose.model('users',usersSchema);
