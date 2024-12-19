const express = require('express');
const Order = require('../models/order');
const OrderedItems = require('../models/orderedItems');
const mongoose = require('mongoose');
const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('userId orderedItems');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId orderedItems');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
});

// Create a new order
router.post('/', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
});

// Update an order by ID
router.put('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }
});

// Delete an order by ID
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
});

router.post('/purchase', async (req, res) => {
  const { userId, items } = req.body; // items is an array of { productId, quantity, priceAtPurchase }
  

  // Validate userId
  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invalid request data. Provide userId and items.' });
  }

  // Ensure userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId. Must be a valid ObjectId.' });
  }

  try {
    // Create ordered items
    const orderedItems = await Promise.all(
      items.map(async (item) => {
        if (!item.productId || !item.quantity || !item.priceAtPurchase) {
          throw new Error('Invalid item data. Provide productId, quantity, and priceAtPurchase.');
        }

        const orderedItem = new OrderedItems({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        });

        return await orderedItem.save();
      })
    );

    // Calculate total amount
    const totalAmount = orderedItems.reduce(
      (sum, item) => sum + item.quantity * item.priceAtPurchase,
      0
    );

    // Create the order
    const newOrder = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      orderedItems: orderedItems.map((item) => item._id),
      totalAmount,
      status: 'pending',
    });
    await newOrder.save();

    // Update ordered items to include orderId
    await Promise.all(
      orderedItems.map(async (item) => {
        item.orderId = newOrder._id;
        return await item.save();
      })
    );
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ message: 'Error processing purchase', error });
  }
});

module.exports = router;
