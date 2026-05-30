const { body } = require('express-validator');

const productRules = [
  body('name').optional({ nullable: true, checkFalsy: true }).trim().notEmpty().withMessage('Product name is required'),
  body('description').optional({ nullable: true, checkFalsy: true }).trim(),
  body('price').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Product price must be a valid number'),
  body('category').optional({ nullable: true, checkFalsy: true }).trim(),
];

const createProductRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Product price must be a valid number'),
  body('description').optional({ nullable: true, checkFalsy: true }).trim(),
  body('category').optional({ nullable: true, checkFalsy: true }).trim(),
];

module.exports = { productRules, createProductRules };