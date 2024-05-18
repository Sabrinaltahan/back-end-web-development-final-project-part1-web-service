const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const authMiddleware = require('../middleware/auth');
const path = require('path');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    console.log('someone get all menu items!') // print in console
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new item (for admin only)
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     // Check if the authenticated user is an admin
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Unauthorized, only admin can add new items' });
//     }

//     // If the user is an admin, proceed to add the new item
//     const newItem = new Item(req.body);
//     await newItem.save();
//     res.status(201).json(newItem);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

const multer = require('multer');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')) // Destination directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname) // adding time to the original file name as the saved file name
  }
});

// setup mimetype
const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  } else {
    cb(null, false);
  }
}

// Create multer instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

// Route handler for adding a new item with image upload
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    // Check if the authenticated user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized, only admin can add new items' });
    }

    // Extract other item data from req.body
    const { label, description, price } = req.body;

    // Get file path of the uploaded image
    const imagePath = `/uploads/${req.file.filename}`;

    // Create new item object with the image file path
    const newItem = new Item({
      label,
      description,
      price,
      image: imagePath
    });

    // Save item to database
    await newItem.save();
    console.log('admin add new item successfully!') // print in console
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// Update an item (for admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if the authenticated user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized, only admin can update items' });
    }

    // If the user is an admin, proceed to update the item
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log('admin update an item successfully!') // print in console
    res.json(updatedItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete an item (for admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if the authenticated user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized, only admin can delete items' });
    }

    // If the user is an admin, proceed to delete the item
    await Item.findByIdAndDelete(req.params.id);
    console.log('admin delete an item successfully!') // print in console
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
