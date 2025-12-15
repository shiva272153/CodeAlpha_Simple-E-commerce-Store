const Order = require('../models/order');

exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, paymentDetails } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ msg: 'No items in order' });
        }
        if (!shippingAddress) {
            return res.status(400).json({ msg: 'Shipping address is required' });
        }

        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await Order.create({
            user: req.user.id,
            items,
            total,
            shippingAddress,
            paymentMethod,
            paymentDetails
        });

        res.status(201).json({ msg: 'Order created successfully', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
