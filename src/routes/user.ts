import {Router} from "express";
import { createUser, loginUser } from "../controllers/user";

const router = Router();

router.post("/create", createUser);
router.post("/login", loginUser);

export default router