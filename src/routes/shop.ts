import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
import {
  createBulkShop,
  createShop,
  deleteBulkShop,
  deleteShop,
  getShop,
  getShops,
  updateShop,
} from "../controllers/shop";

const router = Router();

router.post("/create", authMiddleware, createShop);
router.post("/create-bulk", authMiddleware, createBulkShop);
router.get("/shop-detail/:id", getShop);
router.get("/shops", getShops);
router.put("/update/:id", authMiddleware, isAdmin, updateShop);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteShop);
router.delete("/delete-bulk", authMiddleware, isAdmin, deleteBulkShop);

export default router;
