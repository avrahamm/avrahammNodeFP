const express = require('express');
const app = express();
// const json = require('jsonfile');
const bodyParser = require('body-parser');

const DB = require('./utils/DB');

console.log(process.argv);
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());

DB.connectAndFetchData()
    .then( status => {
        console.log(status);
    });

const UserModel = require('./models/userModel');
const userRouter = require('./routes/userRoute')(UserModel);
const TodoModel = require('./models/todoModel');
const todoRouter = require('./routes/todoRoute')(TodoModel);

app.use('/api/users',userRouter);
app.use('/api/todos',todoRouter);

const server = app.listen(8002);
console.log('Server is running...');

/**
 * @link:https://hackernoon.com/graceful-shutdown-in-nodejs-2f8f59d1c357
 */
process.on('SIGINT', () => {
    console.info('SIGINT signal received - Exiting.');
    // DB.dropAndDisconnectGracefully().
    DB.disconnectGracefully().
        then( () => {
        server.close( () => {
            console.log('Http server closed.');
            process.exit(0);
        });
    })
});
