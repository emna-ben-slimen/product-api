const express = require('express');
const OrderedItem = require('../models/orderedItems');
const router = express.Router();

// Get all ordered items
router.get('/', async (req, res) => {
    try {
        const orderedItems = await OrderedItem.find().populate('orderId productId');
        res.json(orderedItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ordered items', error });
    }
});

// Get a specific ordered item by ID
router.get('/:id', async (req, res) => {
    try {
        const orderedItem = await OrderedItem.findById(req.params.id).populate('orderId productId');
        if (!orderedItem) return res.status(404).json({ message: 'Ordered item not found' });
        res.json(orderedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ordered item', error });
    }
});

// Create a new ordered item
router.post('/', async (req, res) => {
    try {
        const orderedItem = new OrderedItem(req.body);
        await orderedItem.save();
        res.status(201).json(orderedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ordered item', error });
    }
});

// Update an ordered item by ID
router.put('/:id', async (req, res) => {
    try {
        const orderedItem = await OrderedItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!orderedItem) return res.status(404).json({ message: 'Ordered item not found' });
        res.json(orderedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ordered item', error });
    }
});

// Delete an ordered item by ID
router.delete('/:id', async (req, res) => {
    try {
        const orderedItem = await OrderedItem.findByIdAndDelete(req.params.id);
        if (!orderedItem) return res.status(404).json({ message: 'Ordered item not found' });
        res.json({ message: 'Ordered item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ordered item', error });
    }
});

module.exports = router;
