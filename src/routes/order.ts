import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
import { createOrder, viewOrder } from "../controllers/order";

const router = Router();

router.post("/create", createOrder);
router.get("/order-detail/:id", viewOrder);

export default router;
