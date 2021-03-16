import express from 'express';
import {
  getProductById,
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  createReview,
  getTopProducts
} from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/top').get(getTopProducts);
router.route('/:id/reviews').post(protect, createReview);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, isAdmin, updateProduct)
  .delete(protect, isAdmin, deleteProduct);

router.route('/').get(getProducts).post(protect, isAdmin, createProduct);

export default router;
