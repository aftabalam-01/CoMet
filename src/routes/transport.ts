import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
import {
  createBulkTransport,
  createTransport,
  deleteBulkTransport,
  deleteTransport,
  getTransport,
  getTransports,
  updateTransport,
} from "../controllers/transport";

const router = Router();

router.post("/create", authMiddleware, createTransport);
router.post("/create-bulk", authMiddleware, createBulkTransport);
router.get("/transport-detail/:id", getTransport);
router.get("/transports", getTransports);
router.put("/update/:id", authMiddleware, isAdmin, updateTransport);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteTransport);
router.delete("/delete-bulk", authMiddleware, isAdmin, deleteBulkTransport);

export default router;
