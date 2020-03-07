const express = require('express');
const router = express.Router();
const Product = require('./../models/products');
const mongoose = require('mongoose');


router.get('/', (req, res, next) => {
    Product.find()
        .select('_id name price')
        .exec()
        .then(docs => res.status(200).json({
            count: docs.length,
            results: docs
        }))
        .catch(err => res.status(500).json(err));
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
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

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product
        .findById(id)
        .exec()
        .then(doc => {
            if (!doc) {
                res.status(404).json({message: 'Not found'});
            }
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json(err)
        })
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const newValues = {};
    Object.keys(req.body).forEach(function(key) {
        newValues[key] = req.body[key];
    })

    Product.updateOne({_id: id}, {$set: newValues})
        .exec()
        .then(doc => res.status(200).json(doc))
        .catch(err => res.status(500).json(err));
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product
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

module.exports = router;