import express from 'express';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

//get all products
//public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//get product
//public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // throw new Error('some error');
  res.json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;
    product.brand = brand;
    product.image = image;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('product not found');
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    name: 'sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'sample brand',
    category: 'sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'sample description'
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json('product deleted');
  } else {
    res.status(404);
    throw new Error('product not found');
  }
});

const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const reviewExists = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (reviewExists) {
      res.status(400);
      throw new Error('product already reviewed');
    } else {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((total, item) => item.rating + total, 0) /
        product.reviews.length;

      await product.save();

      res.status(201).json('review added');
    }
  } else {
    res.status(404);
    throw new Error('product not found');
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

export {
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
  createProduct,
  createReview,
  getTopProducts
};
