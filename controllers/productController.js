const Product = require('../models/product');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Product not found' });
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Admin: Create Product
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, imageUrl, category, stock } = req.body;
        const product = await Product.create({
            name, price, description, imageUrl, category, stock
        });
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Admin: Update Product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Admin: Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
