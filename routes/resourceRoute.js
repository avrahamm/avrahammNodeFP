 const express = require('express');

const ValidationMiddleware = require('./helpers/validationMiddleware');
const LogHelper = require('../utils/LogHelper');

function routes(ItemModel, ItemHelper) {
    const ItemRouter = express.Router();
    ItemRouter.route('/').get(function (req, resp) {
        ItemModel.find({}, function (err, items) {
            if (err) {
                return resp.send(err);
            }
            return resp.json(items);
        });
    });

    ItemRouter.use('/:id', (req, resp, next) => {
        return ValidationMiddleware.validateItem(req, resp, next, ItemModel)
    } );
    ItemRouter.use('/', [ValidationMiddleware.validateRelatedUser]);

    ItemRouter.route('/:id').get(function (req, resp) {
        return resp.json(req.item);
    });

    /**
     * POST will create new item with predefined item fields set only.
     */
    ItemRouter.route('/').post(function (req, resp) {
        const newItem = ItemHelper.getNewItem(req,ItemModel); //Item specific structure
        let createdItem = null;
        newItem.save()
            .then( createdDoc => {
                createdItem = createdDoc;
                return LogHelper.logPostAction(createdItem);
            })
            .then( () => {
                return resp.json(createdItem);
            })
            .catch(err => {
                return resp.send(err);
            })
    });

    /**
     * PUT will replace predefined item fields set only.
     */
    ItemRouter.route('/:id').put(function (req, resp) {
        const updatingObj = ItemHelper.getUpdatingItem(req); //Item specific structure
        let updatedItem = null;
        ItemModel.findByIdAndUpdate(req.params.id,
            updatingObj,
            {new:true,upsert: true}
            )
            .then( (updatedDoc) => {
                updatedItem = updatedDoc;
                return LogHelper.logPutAction( req.item, updatedItem );
            })
            .then( () => {
                return resp.json(updatedItem);
            })
            .catch(err => {
                return resp.send(err);
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
                return LogHelper.logPatchAction( req.item, updatedItem );
            })
            .then( () => {
                return resp.json(updatedItem);
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
            .then( () => {
                return LogHelper.logDeleteAction(deletedItem);
            } )
            .then( () => {
                return resp.json(deletedItem);
            })
            .catch( err => {
                return resp.send(err);
            } );
    });
    return ItemRouter;
}

module.exports = routes;
