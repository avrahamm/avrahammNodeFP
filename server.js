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
const UserHelper = require('./routes/helpers/userHelper');
const userRouter = require('./routes/resourceRoute')(UserModel,UserHelper);

const TodoModel = require('./models/todoModel');
const TodoHelper = require('./routes/helpers/todoHelper');
const todoRouter = require('./routes/resourceRoute')(TodoModel,TodoHelper);

const PostModel = require('./models/postModel');
const PostHelper = require('./routes/helpers/postHelper');
const postRouter = require('./routes/resourceRoute')(PostModel,PostHelper);

const PhoneModel = require('./models/phoneModel');
const PhoneHelper = require('./routes/helpers/phoneHelper');
const phoneRouter = require('./routes/resourceRoute')(PhoneModel,PhoneHelper);

app.use(`/${UserHelper.getItemResourceUri()}`,userRouter);
app.use(`/${TodoHelper.getItemResourceUri()}`,todoRouter);
app.use(`/${PostHelper.getItemResourceUri()}`,postRouter);
app.use(`/${PhoneHelper.getItemResourceUri()}`,phoneRouter);

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
