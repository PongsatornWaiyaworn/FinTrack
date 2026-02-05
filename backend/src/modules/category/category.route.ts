import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkUpdateCategory,
} from "./category.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/bulk", bulkUpdateCategory);  
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
