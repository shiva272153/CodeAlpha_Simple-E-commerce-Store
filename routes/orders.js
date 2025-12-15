const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', auth, createOrder);
router.get('/my', auth, getMyOrders);
router.get('/', [auth, admin], getAllOrders); // Admin: Get All Orders
router.put('/:id/status', [auth, admin], updateOrderStatus); // Admin: Update Status

module.exports = router;