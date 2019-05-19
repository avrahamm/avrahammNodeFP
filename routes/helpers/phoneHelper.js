function getNewItem( req, resp, ItemModel ) {
    return getUpdatingItem( req, resp)
        .then( updatingItem => {
            //Item specific structure
            const newPhone = new ItemModel( updatingItem );
            return newPhone;
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
                phone_type: req.body.phone_type,
                phone_number: req.body.phone_number
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
        message = "POST,PUT verbs for phone need legal UserId!";
        status = 422;
    }
    else if ( (typeof req.body.phone_type === "undefined") ||
        ( req.body.phone_type === "" ) ) {
        check = false;
        message = "POST,PUT verbs need phone_type set and not empty!";
        status = 422;
    }
    else if ( (typeof req.body.phone_number === "undefined") ||
        ( req.body.phone_number === "" ) ) {
        check = false;
        message = "POST,PUT verbs need phone_number set and not empty!";
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
    return "api/v1/phones";
}

module.exports = { getNewItem, validateUpdatingItem,
    getUpdatingItem, deleteRelatedItems,
    getUserId, getItemResourceUri };
