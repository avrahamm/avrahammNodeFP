const express = require('express');

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

    ItemRouter.route('/:id').get(function (req, resp) {
        ItemModel.findById(req.params.id, {},{},
            (err, item) => {
            if (err) {
                return resp.send(err);
            }
            if (item) {
                return resp.json(item);
            }
            return resp.sendStatus(404);
        });
    });

    /**
     * POST will create new item with predefined item fields set only.
     */
    ItemRouter.route('/').post(function (req, resp) {
        const newItem = ItemHelper.getNewItem(req,ItemModel); //Item specific structure
        newItem.save()
            .then( createdItem => {
                LogHelper.logPostAction(createdItem);
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
        ItemModel.findByIdAndUpdate(req.params.id,
            updatingObj,
            {new:true,upsert: true},
            function (err, updatedItem) {
                if (err) {
                    return resp.send(err);
                }
                LogHelper.logPutAction(updatedItem);
                return resp.json(updatedItem);
            });
    });

    /**
     * PATCH will replace whatever fields.
     */
    ItemRouter.route('/:id').patch(function (req, resp) {

        let key,value;
        let updatingObj = {};
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
            {new:true,upsert: true},
            function (err, updatedItem) {
                if (err) {
                    return resp.send(err);
                }
                LogHelper.logPatchAction(updatedItem);
                return resp.json(updatedItem);
            });
    });

    ItemRouter.route('/:id').delete(function (req, resp) {
        ItemModel.findByIdAndDelete(req.params.id,
            {},
            function (err, deletedItem) {
                if (err) {
                    return resp.send(err);
                }
                ItemHelper.deleteRelatedItems(req);
                LogHelper.logDeleteAction(deletedItem);
                return resp.json(deletedItem);
            });
    });
    return ItemRouter;
}

module.exports = routes;
