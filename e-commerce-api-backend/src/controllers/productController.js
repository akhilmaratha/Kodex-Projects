const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const Product = require('../models/Product');

function buildImageUrls(req) {
  if (!req.files || req.files.length === 0) {
    return [];
  }

  return req.files.map((file) => `/uploads/${file.filename}`);
}

const listProducts = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    products,
  });
});

const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('createdBy', 'name email');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.json({
    success: true,
    product,
  });
});

const createProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const product = await Product.create({
    name: req.body.name,
    description: req.body.description || '',
    price: Number(req.body.price),
    category: req.body.category || '',
    images: buildImageUrls(req),
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    product,
  });
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const newImages = buildImageUrls(req);

  product.name = req.body.name ?? product.name;
  product.description = req.body.description ?? product.description;
  product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
  product.category = req.body.category ?? product.category;
  product.images = [...product.images, ...newImages];

  await product.save();

  res.json({
    success: true,
    product,
  });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: 'Product deleted',
  });
});

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};