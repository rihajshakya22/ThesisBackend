import express from "express";
import {
  deleteRate,
  getRate,
  postRate,
  updateRate,
} from "../controllers/rateController.js";
const router = express.Router();
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getRate).post(protect, admin, postRate);
router
  .route("/:id")
  .put(protect, admin, updateRate)
  .delete(protect, admin, deleteRate);
export default router;
