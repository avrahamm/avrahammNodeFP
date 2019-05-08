const express = require('express');

function routes(UserModel) {
    const userRouter = express.Router();
    userRouter.route('/').get(function (req, resp) {
        UserModel.find({}, function (err, users) {
            // console.log(users);
            if (err) {
                return resp.send(err);
            }
            return resp.json(users);
        });
    });

    userRouter.route('/:id').get(function (req, resp) {
        UserModel.findById(req.params.id, {},{},
            (err, user) => {
            if (err) {
                return resp.send(err);
            }
            if (user) {
                return resp.json(user);
            }
            return resp.sendStatus(404);
        });

    });

    /**
     * POST will create new user with {name,username,email} only.
     */
    userRouter.route('/').post(function (req, resp) {
        const newUser = new UserModel({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email
        });

        newUser.save(function (err) {
            if (err) {
                return resp.send(err);
            }
            return resp.json(newUser);
        });

    });

    /**
     * PUT will replace {name,username,email} only.
     */
    userRouter.route('/:id').put(function (req, resp) {
        let updatingObj = {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email
        };
        UserModel.findByIdAndUpdate(req.params.id,
            updatingObj,
            {new:true,upsert: true},
            function (err, updatedUser) {
                if (err) {
                    return resp.send(err);
                }
                return resp.json(updatedUser);
            });
    });

    /**
     * PATCH will replace whatever fields.
     */
    userRouter.route('/:id').patch(function (req, resp) {

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

        UserModel.findByIdAndUpdate(req.params.id,
            updatingObj,
            {new:true,upsert: true},
            function (err, updatedUser) {
                if (err) {
                    return resp.send(err);
                }
                return resp.json(updatedUser);
            });
    });

    userRouter.route('/:id').delete(function (req, resp) {
        UserModel.findByIdAndDelete(req.params.id,
            {},
            function (err, deletedUser) {
                if (err) {
                    return resp.send(err);
                }
                // TODO! delete related todos
                // TODO! delete related posts
                return resp.json(deletedUser);
                // return resp.send('Deleted !');
            });
    });

    return userRouter;
}

module.exports = routes;
