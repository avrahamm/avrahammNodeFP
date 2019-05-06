const express = require('express');
const app = express();
// const json = require('jsonfile');
const bodyParser = require('body-parser');

const DB = require('./utils/DB');

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());

DB.connectAndFetchData()
    .then( status => {
        console.log(status);
    });

const UserModel = require('./models/userModel');
const userRouter = require('./routes/userRoute')(UserModel);
app.use('/api/users',userRouter);

const server = app.listen(8002);
console.log('Server is running...');

/**
 * @link:https://hackernoon.com/graceful-shutdown-in-nodejs-2f8f59d1c357
 */
process.on('SIGINT', () => {
    console.info('Stopping Server - SIGINT signal received.');
    server.close( () => {
        console.log('Http server closed.');
    });

    DB.dropAndDisconnectGracefully();
});