import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProducts,
  getProductByCategoryId,
  getFeaturedProducts,
  getProductsByColor,
  getProductsByBrand,
  getProductsByPrice,
  getProductsByAlphabetical,
  getProductsByNewAndOld,
  getProductToWishList,
  getProductWishlisted,
  removeFromWishlist,
  updateProductReview,
  getWishlistedProductOfUser,
  deleteProductReview,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/featured").get(getFeaturedProducts);
router.route("/colored").get(getProductsByColor);
router.route("/branded").get(getProductsByBrand);
router.route("/priced").get(getProductsByPrice);
router.route("/sorted").get(getProductsByAlphabetical);
router.route("/filter").get(getProductsByNewAndOld);
router
  .route("/:id/reviews")
  .post(protect, createProductReview)
  .put(protect, updateProductReview)
  .delete(protect, deleteProductReview);
router.route("/:id/wishlist").post(protect, getProductToWishList);
router.route("/:id/remove").post(protect, removeFromWishlist);
router.get("/top", getTopProducts);
router.route("/wishlist").get(protect, getWishlistedProductOfUser);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);
router.get("/category/:id", getProductByCategoryId);
export default router;
