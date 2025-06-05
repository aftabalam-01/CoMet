import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
import { createShop, getShop, getShops } from "../controllers/shop";

const router = Router();

router.post("/create", authMiddleware, isAdmin, createShop);
router.get("/shop-detail/:id", getShop);
router.get("/shops", getShops);
export default router;
