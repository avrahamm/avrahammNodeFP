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

function deleteRelatedItems(req) {
    // User specific
    // TODO! delete related todos
    // TODO! delete related posts
}

module.exports = { getNewItem, getUpdatingItem, deleteRelatedItems };
