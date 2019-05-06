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

    userRouter.route('/').post(function (req, resp) {
        const newUser = new UserModel({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email
        });

        newUser.save(function (err) {
            if (err) {
                resp.send(err);
            }
            resp.send('Person Created !')
        });

    });

    userRouter.route('/:id').put(function (req, resp) {
        const { user } = req;
        user.name = req.body.name;
        user.username = req.body.username;
        user.email = req.body.email;
        UserModel.findByIdAndUpdate(req.params.id,
            {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email
            },
            function (err, per) {
                if (err) {
                    return resp.send(err);
                }
                return resp.send('Updated !');
            });
    });

    userRouter.route('/:id').delete(function (req, resp) {
        UserModel.findByIdAndDelete(req.params.id,
            function (err, per) {
                if (err) {
                    return resp.send(err);
                }
                return resp.send('Deleted !');
            });
    });

    // middleware for '/:id' routes  to attach target user
    // to req object once
    userRouter.use('/:id', (req, res, next) => {
        UserModel.findById(req.params.id, (err, user) => {
            if (err) {
                return res.send(err);
            }
            if (user) {
                req.user = user;
                return next();
            }
            return res.sendStatus(404);
        });
    })

    userRouter.route('/:id').get(function (req, resp) {
        const { user } = req;
        return resp.json(user);
    });

    return userRouter;
}

module.exports = routes;
