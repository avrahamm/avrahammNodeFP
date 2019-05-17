const ObjectId = require('mongoose').Types.ObjectId;
const validateObjectId = (id) => ObjectId.isValid(id) && (new ObjectId(id)).toString() === id;

const UserModel = require('../../models/userModel');

/**
 * To validate requested (by :id) item existence,
 * and add validated resource item to req object.
 * @param req
 * @param resp
 * @param next
 * @param ItemModel
 * @returns {*|*|void}
 */
function validateItem(req, resp, next, ItemModel) {

    let itemId = req.params.id;
    if (!validateObjectId(itemId)) {
        //@link:https://stackoverflow.com/questions/6123425/rest-response-code-for-invalid-data
        return resp.status(400).send("Illegal Id");
    }

    ItemModel.findById(itemId, {}, {})
        .then((item) => {
            if (item) {
                req.item = item;
                return next();
            } else {
                return resp.status(422).send("Item with Id Not Found");
            }
        })
        .catch(err => {
            return resp.sendStatus(404).send(err);
        })
}

/**
 * To validate related user by userId added to req.body.userId,
 * and add validated related user to req object.
 * @param req
 * @param resp
 * @param next
 * @returns {*|void|*}
 */
function validateRelatedUser(req, resp, next) {

    let relatedUserId = null;
    if ((typeof req.body.userId === "undefined")) {
        req.relatedUser = null;
        return next();
    } else if (!validateObjectId(req.body.userId)) {
        return resp.status(400).send("Illegal related UserId");
    } else {
        relatedUserId = req.body.userId;
    }

    if( req.item && ( (req.item.userId).toString() !== relatedUserId ) ) {
        return resp.status(422)
            .send("Trying to change Item UserId is Illegal!");
    }

    UserModel.findById(relatedUserId, {}, {})
        .then(relatedUser => {
            req.relatedUser = relatedUser;
            return next();
        })
        .catch(err => {
            return resp.sendStatus(404).send(err);
        });
}

/**
 * Middleware validates resource item and related user
 * and attaches validated objects to req object.
 * If fails, returns error response with code and message.
 * All that in one place to avoid code replication.
 * @type {{validateRelatedUser: validateRelatedUser, validateItem: validateItem}}
 */
module.exports = {validateItem, validateRelatedUser};
