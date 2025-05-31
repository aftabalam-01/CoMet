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
} from "../controllers/user";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
const router = Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.post("/login/admin", adminLogin);
router.get("/refresh", authMiddleware, handleRefreshToken);
router.get("/profile/:id", getUser);
router.get("/all-users", authMiddleware, isAdmin,allUsers);
router.put("/update/:id", authMiddleware, updateUser)
router.delete("/delete/:id", authMiddleware, deleteUser)

export default router;
