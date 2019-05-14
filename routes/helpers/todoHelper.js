function getNewItem( req,ItemModel ) {
    const newTodo = new ItemModel(//Item specific structure
        getUpdatingItem( req )
        );
    return newTodo;
}

function getUpdatingItem( req ) {
    const todoObj = { //Item specific structure
        userId: req.body.userId,
        title: req.body.title,
        completed: req.body.completed
    };
    return todoObj;
}

function deleteRelatedItems(req,resp) {}

module.exports = { getNewItem, getUpdatingItem, deleteRelatedItems };
