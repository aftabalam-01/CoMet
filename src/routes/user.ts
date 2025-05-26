import { Router } from "express";
import { createUser, handleRefreshToken, loginUser } from "../controllers/user";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/refresh", authMiddleware,handleRefreshToken);
export default router;
