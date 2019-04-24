var express = require('express');
var app = express();

const bodyParser = require('body-parser');

require('./configs/database');

var personsRouter = require('./routes/personsRoute');

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());


app.use('/api/persons',personsRouter);

app.listen(8001);
console.log('Server is running...')