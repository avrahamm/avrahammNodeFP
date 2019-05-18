function getNewItem( req, resp, ItemModel ) {
    return getUpdatingItem( req, resp)
        .then( updatingItem => {
            //Item specific structure
            const newPost = new ItemModel( updatingItem );
            return newPost;
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
                body: req.body.body
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
        ( req.body.userId === "" ) ) {
        check = false;
        message = "POST,PUT verbs need post legal UserId!";
        status = 422;
    }
    else if ( (typeof req.body.title === "undefined") ||
        (req.body.title === "") ) {
        check = false;
        message = "POST,PUT verbs need post title set and not empty!";
        status = 422;
    }
    else if ( (typeof req.body.body === "undefined") ||
        ( req.body.body === "") ) {
        check = false;
        message = "POST,PUT verbs need post body set and not empty!";
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
    return "api/v1/posts";
}

module.exports = { getNewItem, validateUpdatingItem,
    getUpdatingItem, deleteRelatedItems,
    getUserId, getItemResourceUri };
