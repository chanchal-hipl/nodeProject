import express from "express";
import { createUser, getUsers, getUser, updateUser, deleteUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createUser); 
router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
