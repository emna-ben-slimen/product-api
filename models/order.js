const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderedItems: [{ type: Schema.Types.ObjectId, ref: 'OrderedItems' }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }

})
const Order = mongoose.model('Order',orderSchema);
module.exports = Order;
