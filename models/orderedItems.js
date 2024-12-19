const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderedItemsSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: false },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    priceAtPurchase : { type: Number, required: true }

})
const OrderedItems = mongoose.model('OrderedItems',orderedItemsSchema);
module.exports = OrderedItems;
