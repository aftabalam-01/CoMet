import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
import {
  createOrder,
  deleteBulkOrders,
  deleteOrder,
  updateOrder,
  viewOrder,
  viewOrders,
} from "../controllers/order";

const router = Router();

router.post("/create", authMiddleware, isAdmin, createOrder);
router.get("/order-detail/:id", authMiddleware, isAdmin, viewOrder);
router.get("/orders", authMiddleware, isAdmin, viewOrders);
router.put("/order-update/:id", authMiddleware, isAdmin, updateOrder);
router.delete("/order-delete/:id", authMiddleware, isAdmin, deleteOrder);
router.delete("/orders-delete", authMiddleware, isAdmin, deleteBulkOrders);

export default router;
