const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    name : String,
    price : Number,
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' }

})
const Product = mongoose.model('Product',productSchema);
module.exports = Product;
