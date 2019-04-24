var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var personSchema = new Schema({

    FirstName : String,
    LastName : String,
    Age : Number
});


module.exports = mongoose.model('persons',personSchema)

