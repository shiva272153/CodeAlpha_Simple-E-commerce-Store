const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  status: { type: String, default: 'pending' },
  shippingAddress: {
    line1: String, line2: String, city: String, state: String, zip: String, country: String
  },
  paymentMethod: { type: String, enum: ['Card', 'UPI', 'COD'], default: 'COD' },
  paymentDetails: Object
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);