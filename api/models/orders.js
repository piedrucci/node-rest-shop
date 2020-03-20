const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = Schema({
    _id: Schema.Types.ObjectId,
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true}
});

module.exports = mongoose.model('Order', orderSchema);