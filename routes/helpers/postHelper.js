function getNewItem( req,ItemModel ) {
    const newPost = new ItemModel(//Item specific structure
        getUpdatingItem( req )
        );
    return newPost;
}

function getUpdatingItem( req ) {
    const postObj = { //Item specific structure
        userId: req.body.userId,
        title: req.body.title,
        body: req.body.body
    };
    return postObj;
}

function deleteRelatedItems(req) {

}

module.exports = { getNewItem, getUpdatingItem, deleteRelatedItems };
