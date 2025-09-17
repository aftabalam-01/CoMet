import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
import {
  batchOrder,
  createOrder,
  deleteBulkOrders,
  deleteOrder,
  groupedOrders,
  updateOrder,
  viewOrder,
  viewOrders,
} from "../controllers/order";

const router = Router();

router.post("/create", authMiddleware, isAdmin, createOrder);
router.post("/batch", authMiddleware, isAdmin, batchOrder);
router.get("/order-detail/:id", authMiddleware, viewOrder);
router.get("/orders", authMiddleware, viewOrders);
router.get("/orders-grouped", authMiddleware, groupedOrders);
router.put("/order-update/:id", authMiddleware, isAdmin, updateOrder);
router.delete("/order-delete/:id", authMiddleware, isAdmin, deleteOrder);
router.delete("/orders-delete", authMiddleware, isAdmin, deleteBulkOrders);

export default router;
