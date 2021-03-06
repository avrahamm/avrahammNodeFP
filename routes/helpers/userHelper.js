const TodoModel = require('../../models/todoModel');
const PostModel = require('../../models/postModel');
const PhoneModel = require('../../models/phoneModel');

function getNewItem( req, resp, ItemModel ) {
    return getUpdatingItem( req, resp)
        .then( updatingItem => {
            //Item specific structure
            const newUser = new ItemModel( updatingItem );
            return newUser;
        })
        .catch( err => {
            return Promise.reject(err);
        })
}

function getUpdatingItem( req, resp ) {
    return validateUpdatingItem( req,resp )
        .then( () => {
            return { //Item specific structure
                name: req.body.name,
                username: req.body.username,
                email: req.body.email
            };
        })
        .catch( err => {
            return Promise.reject(err);
        })
}

function validateUpdatingItem( req,resp ) {
    let message = "";
    let status = 0;
    let check = true;
    if (typeof req.body.name === "undefined" ||
        (req.body.name === "") ) {
        check = false;
        message = "POST,PUT verbs need non empty user name!";
        status = 422;
    }
    else if ( (typeof req.body.username === "undefined") ||
        (req.body.username === "") ) {
        check = false;
        message = "POST,PUT verbs need user username set and not empty!";
        status = 422;
    }
    else if ( (typeof req.body.email === "undefined") ||
        (req.body.email === "") ) {
        check = false;
        message = "POST,PUT verbs need user email set and not empty!";
        status = 422;
    }

    if( check ) {
        return Promise.resolve();
    }
    else {
        resp.status(status);
        return Promise.reject(message);
    }
}

/**
 * To delete user related items ( todos, posts, phones,..)
 * and return false notifies to delete user log file.
 * @param req
 * @param resp
 * @returns {Promise<boolean | *>}
 */
async function deleteRelatedItems(req,resp) {
    // User specific
    return TodoModel.deleteMany({userId: req.params.id })
        .then( () => {
            return PostModel.deleteMany({userId: req.params.id })
        })
        .then( () => {
            return PhoneModel.deleteMany({userId: req.params.id })
        })
        .then( () => {
            // user and user related items were deleted,delete log file
            return false;
        })
        .catch( err => {
            return resp.send(err);
        })
}

function getUserId( resultItem ) {
    return resultItem._id.toString();
}

function getItemResourceUri( ) {
    return "api/v1/users";
}

module.exports = { getNewItem, validateUpdatingItem,
    getUpdatingItem, deleteRelatedItems,
    getUserId, getItemResourceUri };
