const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Order was created'
    });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.productId;

    res.status(200).json({
        id: id,
        message: 'Order details'
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(204).json({
        message: 'Order was deleted'
    });
});

module.exports = router;