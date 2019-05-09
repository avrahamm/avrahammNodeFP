const express = require('express');

function routes(ItemModel) {
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
        const newTodo = new ItemModel({ //Item specific structure
            userId: req.body.userId,
            title: req.body.title,
            completed: req.body.completed
        });

        newTodo.save(function (err) {
            if (err) {
                return resp.send(err);
            }
            return resp.json(newTodo);
        });

    });

    /**
     * PUT will replace predefined item fields set only.
     */
    ItemRouter.route('/:id').put(function (req, resp) {
        let updatingObj = { //Item specific structure
            userId: req.body.userId,
            title: req.body.title,
            completed: req.body.completed
        };
        ItemModel.findByIdAndUpdate(req.params.id,
            updatingObj,
            {new:true,upsert: true},
            function (err, updatedItem) {
                if (err) {
                    return resp.send(err);
                }
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
                return resp.json(deletedItem);
                // return resp.send('Deleted !');
            });
    });

    return ItemRouter;
}

module.exports = routes;
