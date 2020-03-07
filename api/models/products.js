const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    price: Number
});

module.exports = mongoose.model('Product', productSchema);