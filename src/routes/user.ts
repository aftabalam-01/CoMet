import { Router } from "express";
import {
  createUser,
  getUser,
  handleRefreshToken,
  loginUser,
} from "../controllers/user";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
const router = Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/refresh", authMiddleware, handleRefreshToken);
router.get("/profile", getUser);
export default router;
