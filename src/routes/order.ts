import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
import { createOrder } from "../controllers/order";

const router = Router()

router.post("/create", createOrder)

export default router