const TodoModel = require('../../models/todoModel');
const PostModel = require('../../models/postModel');


function getNewItem( req,ItemModel ) {
    const newUser = new ItemModel(//Item specific structure
        getUpdatingItem( req )
        );
    return newUser;
}

function getUpdatingItem( req ) {
    const userObj = { //Item specific structure
        name: req.body.name,
        username: req.body.username,
        email: req.body.email
    };
    return userObj;
}

function deleteRelatedItems(req,resp) {
    // User specific
    return TodoModel.deleteMany({userId: req.params.id })
        .then( () => {
            return PostModel.deleteMany({userId: req.params.id })
        })
        .catch( err => {
            return resp.send(err);
        })
}

module.exports = { getNewItem, getUpdatingItem, deleteRelatedItems };
