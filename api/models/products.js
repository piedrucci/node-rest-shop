const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);