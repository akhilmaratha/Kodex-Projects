const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/upload');
const {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { createProductRules, productRules } = require('../validators/productValidators');

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProductById);
router.post('/', protect, upload.array('images', 6), createProductRules, createProduct);
router.put('/:id', protect, upload.array('images', 6), productRules, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;