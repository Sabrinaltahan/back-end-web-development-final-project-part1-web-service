const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    useremail: { type: String, required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    item: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'canceled'], default: 'pending' }
});

module.exports = mongoose.model('Order', orderSchema);
