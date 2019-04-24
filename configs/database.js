var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/personsDB');

var db = mongoose.connection;

db.once('open', () => console.log('DB is connected..'));
db.once('error', () => console.log('Connection failed'));


