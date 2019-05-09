const express = require('express');
const app = express();
// const json = require('jsonfile');
const bodyParser = require('body-parser');

const DB = require('./utils/DB');

console.log(process.argv);
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

DB.connectAndFetchData()
    .then( status => {
        console.log(status);
    });

const UserModel = require('./models/userModel');
const userHelper = require('./routes/helpers/userHelper');
const userRouter = require('./routes/resourceRoute')(UserModel,userHelper);

const TodoModel = require('./models/todoModel');
const TodoHelper = require('./routes/helpers/todoHelper');
const todoRouter = require('./routes/resourceRoute')(TodoModel,TodoHelper);

const postModel = require('./models/postModel');
const PostHelper = require('./routes/helpers/postHelper');
const postRouter = require('./routes/resourceRoute')(postModel,PostHelper);

app.use('/api/v1/users',userRouter);
app.use('/api/v1/todos',todoRouter);
app.use('/api/v1/posts',postRouter);

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
