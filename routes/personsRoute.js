const express = require('express');

const router = express.Router();

const peronsDB = require('../models/personModel');


router.route('/').get(function (req, resp) {
    peronsDB.find({}, function (err, pers) {
        console.log(pers);
        if (err) {
            return resp.send(err);
        }
        return resp.json(pers);
    });
});


router.route('/:id').get(function (req, resp) {
    peronsDB.findById(req.params.id, function (err, per) {
        if (err) {
            return resp.send(err);
        }
        return resp.json(per);
    });
});


router.route('/').post(function (req, resp) {
    const newPerson = new peronsDB({
        FirstName: req.body.fname,
        LastName: req.body.lname,
        Age: req.body.age
    });

    newPerson.save(function (err) {
        if (err) {
            resp.send(err);
        }
        resp.send('Person Created !')
    });

});


router.route('/:id').put(function (req, resp) {
    peronsDB.findByIdAndUpdate(req.params.id,
        {
            FirstName: req.body.fname,
            LastName: req.body.lname,
            Age: req.body.age
        },
        function (err, per) {
            if (err) {
                return resp.send(err);
            }
            return resp.send('Updated !');
        });
});


router.route('/:id').delete(function (req, resp) {
    peronsDB.findByIdAndDelete(req.params.id,
        function (err, per) {
            if (err) {
                return resp.send(err);
            }
            return resp.send('Deleted !');
        });
});


module.exports = router;
