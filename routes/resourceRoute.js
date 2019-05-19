const express = require('express');

const ValidationMiddleware = require('./helpers/validationMiddleware');
const LogHelper = require('../utils/LogHelper');

/**
 * One Router structure for all resources,
 * customizations are made through ItemModel and ItemHelper.
 * To avoid code repetition and yet be flexible.
 * Also ValidationMiddleware is used to perform common validation steps.
 * @param ItemModel
 * @param ItemHelper
 * @returns {Router}
 */
function routes(ItemModel, ItemHelper) {
    const ItemRouter = express.Router();
    ItemRouter.route('/').get(function (req, resp) {
        ItemModel.find({}, function (err, items) {
            if (err) {
                return resp.send(err);
            }

            const returnItems = items.map((item) => {
                const transformedItem = item.toObject();
                transformedItem.links = {};
                transformedItem.links.self =
                    `http://${req.headers.host}/${ItemHelper.getItemResourceUri()}/${item._id}`;
                return transformedItem;
            });
            return resp.json(returnItems);
        });
    });

    /**
     * Add ValidationMiddleware to perform validations,
     */
    ItemRouter.use('/:id', (req, resp, next) => {
        return ValidationMiddleware.validateItem(req, resp, next, ItemModel)
    } );
    /**
     * if needed several validations can be added for each url -
     * in array notation. [ v1,v2...]
     * @link:http://expressjs.com/en/4x/api.html#path-examples
     */
    ItemRouter.use('/', [ValidationMiddleware.validateRelatedUser]);

    ItemRouter.route('/:id').get(function (req, resp) {
        return resp.json(req.item.toObject());
    });

    /**
     * POST will create new item with predefined item fields set only.
     */
    ItemRouter.route('/').post(function (req, resp) {
        // const newItem = ItemHelper.getNewItem(req, resp, ItemModel); //Item specific structure
        let createdItem = null;

        ItemHelper.getNewItem(req, resp, ItemModel)
            .then(newItem => {
                return newItem.save();
            })
            .then( createdDoc => {
                createdItem = createdDoc;
                return LogHelper.logChange( ItemHelper, null, createdItem );
            })
            .then( () => {
                return resp.json(createdItem.toObject());
            })
            .catch(err => {
                resp.send(err);
            })
    });

    /**
     * PUT will replace predefined item fields set only.
     */
    ItemRouter.route('/:id').put(function (req, resp) {
        let updatedItem = null;
        // const updatingObj = ItemHelper.getUpdatingItem(req, resp); //Item specific structure

        ItemHelper.getUpdatingItem( req, resp )
            .then(updatingObj => {
                return ItemModel.findByIdAndUpdate(req.params.id,
                    updatingObj,
                    {new:true,upsert: true}
                )
            })
            .then( (updatedDoc) => {
                updatedItem = updatedDoc;
                return LogHelper.logChange( ItemHelper, req.item, updatedItem );
            })
            .then( () => {
                return resp.json(updatedItem.toObject());
            })
            .catch(err => {
                resp.send(err);
            })
    });

    /**
     * PATCH will replace whatever fields.
     */
    ItemRouter.route('/:id').patch(function (req, resp) {

        let key,value;
        let updatingObj = {};
        let updatedItem = null;

        if( req.body._id) {
            delete req.body._id;
        }
        Object.entries(req.body).forEach(item => {
            key = item[0];
            value = item[1];
            updatingObj[key] = value;
        });

        ItemModel.findByIdAndUpdate(req.params.id,
            updatingObj,
            {new:true,upsert: true}
            )
            .then( (updatedDoc) => {
                updatedItem = updatedDoc;
                return LogHelper.logChange( ItemHelper, req.item, updatedItem );
            })
            .then( () => {
                return resp.json(updatedItem.toObject());
            })
            .catch(err => {
                return resp.send(err);
            })
    });

    ItemRouter.route('/:id').delete(function (req, resp) {
        let deletedItem = null;
        ItemModel.findByIdAndDelete(req.params.id,{})
            .then( (deletedDoc) => {
                deletedItem = deletedDoc;
                return ItemHelper.deleteRelatedItems(req,resp);
            } )
            .then( (needToLog) => {
                return LogHelper.logChange(ItemHelper, deletedItem, null, needToLog);
            } )
            .then( () => {
                return resp.json(deletedItem.toObject());
            })
            .catch( err => {
                return resp.send(err);
            } );
    });
    return ItemRouter;
}

module.exports = routes;
