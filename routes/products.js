const express = require('express');
const Product = require('../models/product');
const router = express.Router();

// Read All Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de récupuration du produit', error });
    }
});

// Create a new product
router.post('/', async (req, res) => {
    try {
        const { name, price, categoryId } = req.body;

        // Create a new Product instance
        const product = new Product({ name, price, categoryId });

        // Save the product to the database
        await product.save();

        // Respond with the newly created product
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du produit', error });
    }
});

// Read Specific Product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Produit introuvable' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de récupuration du produit', error });
    }
});

// Alter Product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Produit introuvable' });
        res.json(product);
    } catch (error) {
        console.error(error); // Log the error to the console for debugging
        res.status(500).json({ message: 'Erreur lors de mise à jour du produit', error });
    }
});

// Delete Product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Produit introuvable' });
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de suppression du produit', error });
    }
});

module.exports = router;
