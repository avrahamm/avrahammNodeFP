function getNewItem( req, resp, ItemModel ) {
    return getUpdatingItem( req, resp)
        .then( updatingItem => {
            //Item specific structure
            const newTodo = new ItemModel( updatingItem );
            return newTodo;
        })
        .catch( err => {
            return Promise.reject(err);
        })
}

function getUpdatingItem( req, resp ) {
    return validateUpdatingItem( req,resp )
        .then( () => {
            return { //Item specific structure
                userId: req.body.userId,
                title: req.body.title,
                completed: req.body.completed ? req.body.completed : false
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
    if (typeof req.body.userId === "undefined" ||
        req.body.userId ==="") {

        check = false;
        message = "POST,PUT verbs need todo legal UserId!";
        status = 422;
    }
    else if ( (typeof req.body.title === "undefined") ||
        ( req.body.title === "" ) ) {
        check = false;
        message = "POST,PUT verbs need todo title set and not empty!";
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

async function deleteRelatedItems(req,resp) {
    // log item deletion in related user file log
    return true;
}

function getUserId( resultItem ) {
    return resultItem.userId.toString();
}

function getItemResourceUri( ) {
    return "api/v1/todos";
}

module.exports = { getNewItem, validateUpdatingItem,
    getUpdatingItem, deleteRelatedItems,
    getUserId, getItemResourceUri };
