const mongoose = require('mongoose');

const DAL = require("./DAL");
const userModel = require('../models/userModel');
const todoModel = require('../models/todoModel');
const postModel = require('../models/postModel');

async function connectAndFetchData() {
    await connectToDB();
    await initDBWithData();
    return "DB Ready";
}

function connectToDB() {
    mongoose.connect('mongodb://localhost:27017/nodefpDB',
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

function initDBWithData(connectionStatus=""){

    let usersPromise = DAL.getData('https://jsonplaceholder.typicode.com/users');
    let todosPromise = DAL.getData('https://jsonplaceholder.typicode.com/todos');
    let postsPromise = DAL.getData('https://jsonplaceholder.typicode.com/posts');
    Promise.all([usersPromise,todosPromise,postsPromise])
        .then( resolvedArray =>
        {
            let usersData = resolvedArray[0].data;
            let todosData = resolvedArray[1].data;
            let postsData = resolvedArray[2].data;

            Promise.all([
                insertDataToModel(userModel, usersData),
                insertDataToModel(todoModel, todosData),
                insertDataToModel(postModel, postsData)
                ])
                .then(resolvedArray => {
                    return "DB Data set!";
                })
                .catch( err => {
                    console.log(err);
                    process.exit(1);
                })
        })
        .catch( error =>
        {
            console.log(error);
            process.exit(1);
        });
}

/**
 *
 * @param model: mongoose model for specific collection
 * @param data: jsons array
 */
function insertDataToModel( model, data) {
    // save multiple documents to the collection referenced by Book Model
    model.insertMany(data)
        .then(function(docs) {
            console.log("Multiple documents inserted to Collection");
            return "insertMany Done!";
        })
        .catch(function(err) {
            /* Error handling */
            console.error(err);
            process.exit(1);
        });
}

function dropAndDisconnectGracefully() {
    mongoose.connection.dropDatabase()
        .then(() => {
            console.log('mongo DB dropped.');
        })
        .then(() => {
            mongoose.connection.close();
        })
        .then(() => {
            console.log('MongoDb connection closed.');
            process.exit(0);
        });
}

module.exports = { connectAndFetchData,dropAndDisconnectGracefully};
