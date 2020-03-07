const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('./../models/orders');
const Product = require('./../models/products');

router.get('/', (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .populate('product', '_id name price')
        .exec()
        .then(docs => res.status(200).json({
            count: docs.length,
            results: docs
        }))
        .catch(err => res.status(500).json(err));
});

router.post('/', (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: productId,
                quantity: req.body.quantity
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json(result);
        })
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

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    Order
        .findById(id)
        .populate('product', '_id name price')
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

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order
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