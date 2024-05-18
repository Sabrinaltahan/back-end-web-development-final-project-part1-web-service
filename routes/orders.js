const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const authMiddleware = require('../middleware/auth');
const Item = require('../models/item');

// Get all orders (for admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized, only admin can access this route' });
    }

    // Fetch all orders
    const orders = await Order.find();

    // Populate the price for each order
    const ordersWithPrices = await Promise.all(
      orders.map(async (order) => {
        const item = await Item.findOne({ label: order.item });
        const price = item ? item.price : 'N/A'; // Handle cases where item might not be found
        return {
          ...order.toObject(),
          price
        };
      })
    );

    console.log('Admin fetched all orders successfully!');
    res.json(ordersWithPrices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Create a new order (for authenticated users)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { useremail, item, date } = req.body;
    const newOrder = new Order({
      useremail,
      userid: req.user.id,
      item,
      date,
      status: 'pending' // Default status for new orders
    });
    await newOrder.save(); // save order to database
    console.log('someone add new order successfully!') // print in console
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete an order (for admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {

    await Order.findByIdAndDelete(req.params.id);
    console.log('admin or user delete an order successfully!') // print in console
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Accept an order (for admin only)
router.put('/accept/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized, only admin can accept orders' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
    console.log('admin accept an order successfully!') // print in console
    res.json(updatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Cancel an order (for admin only)
router.put('/cancel/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized, only admin can cancel orders' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    console.log('admin cancel an order successfully!') // print in console
    res.json(updatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user's orders
// router.get('/my-orders', authMiddleware, async (req, res) => {
//   try {
//     const orders = await Order.find({ userid: req.user.id });
//     res.json(orders);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// Get user's orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userid: req.user.id });
    const ordersWithPrice = await Promise.all(orders.map(async order => {
      const item = await Item.findOne({ label: order.item });
      return { ...order.toObject(), price: item ? item.price : null };
    }));
    res.json(ordersWithPrice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Get order details by order id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const item = await Item.findOne({ label: order.item });
    if (!item) {
      return res.status(404).json({ message: 'Item not found for this order' });
    }

    const orderDetails = {
      ...order.toObject(),
      price: item.price
    };

    res.json(orderDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
