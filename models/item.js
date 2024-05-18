const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    label: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }
});

module.exports = mongoose.model('Item', itemSchema);
