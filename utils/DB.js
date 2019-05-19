const mongoose = require('mongoose');

const DAL = require("./DAL");
const userModel = require('../models/userModel');
const todoModel = require('../models/todoModel');
const postModel = require('../models/postModel');
const LogHelper = require('./LogHelper');

const MONGODB_CONNECTION_PATH = 'mongodb://localhost:27017/nodefpDB';

function connectAndFetchData() {
    return connectToDB()
        .then( () => {
            return userModel.find({}, function (err, docs) {
                if( docs.length ) { // data exist, go on
                    return "";
                }
                else {  // no data - go fetch
                    return initDBWithData()
                        .then( usersMongoIds => {
                            return LogHelper.initUserLogFiles(usersMongoIds);
                        })
                }
            });
        })
        .then( ( ) => {
            return "DB Ready";
        })
        .catch( (err) => {
            console.log(err);
            process.exit(1);
        })
}

function connectToDB() {
    return mongoose.connect(MONGODB_CONNECTION_PATH,
        {useNewUrlParser: true})
        .then( () => {
            console.log('Mongoose connected!');
            // initDBWithData();
            return 'Mongoose connected!';
        })
        .catch( (err) => {
                console.log(err);
                process.exit(1);
            }
        );
}

function initDBWithData() {
    let usersData = [];
    let todosData = [];
    let postsData = [];
    let userIdToMongoIdMapping = [];

    let usersPromise = DAL.getData('https://jsonplaceholder.typicode.com/users');
    let todosPromise = DAL.getData('https://jsonplaceholder.typicode.com/todos');
    let postsPromise = DAL.getData('https://jsonplaceholder.typicode.com/posts');

    return Promise.all([usersPromise, todosPromise, postsPromise])
        .then(resolvedArray => {
            usersData = resolvedArray[0].data;
            todosData = resolvedArray[1].data;
            postsData = resolvedArray[2].data;
            return insertDataToModel(userModel, usersData);
        })
        .then(() => {
            // retrieve all users '_id id' to create mapping.
            return userModel.find({}, '_id id')
        })
        .then(users => {
            users.forEach(user => {
                userIdToMongoIdMapping[user.id] = user._id;
                console.log("user._id =" + user._id + ", user.id =" + user.id);
            });
            // resolve mapping array
            // return Promise.resolve(userIdToMongoIdMapping);
            return userIdToMongoIdMapping;
        })
        .then(userIdToMongoIdMapping => {
            // replace original userId with user document _id for todos and posts.
            todosData.forEach(todo => {
                todo.userId = userIdToMongoIdMapping[todo.userId];
            });
            postsData.forEach(post => {
                post.userId = userIdToMongoIdMapping[post.userId];
            });
            // store todos and posts with updated userId values.
            return Promise.all([
                insertDataToModel(todoModel, todosData),
                insertDataToModel(postModel, postsData)
            ])
        })
        .then(() => {
            console.log("userId was replaced with user._id successfully!");
            return userIdToMongoIdMapping;
        })
        .catch(error => {
            console.log(error);
            process.exit(1);
        });
}

/**
 *
 * @param model: mongoose model for specific collection
 * @param data: jsons array
 */
function insertDataToModel(model, data) {
    // save multiple documents to the collection referenced by Book Model
    return model.insertMany(data)
        .then(function () {
            console.log("insertMany inserted to Collection " + model.collection.collectionName);
            return "insertMany Done!";
        })
        .catch(function (err) {
            /* Error handling */
            console.error(err);
            process.exit(1);
        });
}

function disconnectGracefully() {
    return mongoose.connection.close()
        .then(() => {
            console.log('mongoose.connection closed.');
        });
}

function dropAndDisconnectGracefully() {
    return mongoose.connection.dropDatabase()
        .then(() => {
            console.log('mongo DB dropped.');
            return mongoose.connection.close();
        })
        .then(() => {
            console.log('MongoDb connection closed.');
        });
}

module.exports = { connectAndFetchData, disconnectGracefully,dropAndDisconnectGracefully };
