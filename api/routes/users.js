const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('./../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', (req, res, next) => {
    User.find()
        .select('_id email')
        .exec()
        .then(docs => res.status(200).json({
            count: docs.length,
            results: docs
        }))
        .catch(err => res.status(500).json(err));
});

router.post('/signup', (req , res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({message: 'The email is already registered'});
            }

            bcrypt.hash(req.body.password, 10, (err, encrypted) => {
                if (err) {
                    res.status(500).json({
                        error: err
                    });
                }
                const user = new User({
                    _id: mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: encrypted,
                });
        
                user
                    .save()
                    .then(result => res.status(201).json(result))
                    .catch(err => {
                        const errors = err.errors;
                        const validationErrors = Object.keys(errors);
                        const listErrors = [];
                        for (const f of validationErrors) {
                            listErrors.push({[f]: errors[f]['message']});
                        }
                        res.status(400).json({errors: listErrors});
                    });
            });
        })
        .catch(err => {
            res.status(400).json(err)
        })
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User
        .deleteOne({_id: id})
        .exec()
        .then(result => {
            const deleted = result.deletedCount;
            if (deleted) {
                res.status(204).json(result);
            }
            res.status(404).json({message: 'Not found'});
        })
        .catch(err => {
            res.status(500).json(err)
        })
});

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.find({email: email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(404).json({
                    message: 'Email not found, user doesn\'t exist'
                });
            }

            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );

                    return res.status(200).json({
                        message: 'Auth Sucessful',
                        token: token,
                    });
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
});

module.exports = router;