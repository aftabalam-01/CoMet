import { Router } from "express";
import {
  createUser,
  getUser,
  handleRefreshToken,
  adminLogin,
  loginUser,
  allUsers,
  updateUser,
  deleteUser,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from "../controllers/user";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
const router = Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.post("/login/admin", adminLogin);
router.put("/logout", logout);
router.get("/refresh", handleRefreshToken);
router.post("/forgot-password", forgotPassword);
router.get("/me", authMiddleware, getCurrentUser);
router.put("/reset-password/:token", resetPassword);
router.get("/profile/:id", getUser);
router.get("/all-users", authMiddleware, isAdmin, allUsers);
router.put("/update/:id", authMiddleware, updateUser);
router.put("/delete/:id", authMiddleware, deleteUser);

export default router;
