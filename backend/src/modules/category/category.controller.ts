import { Request, Response, NextFunction } from "express";
import {
  getCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  bulkUpdateCategoryService,
} from "./category.service";

export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await getCategoriesService(req.user!.id);
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function getCategoryById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = await getCategoryByIdService(
      req.user!.id,
      String(req.params.id)
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = await createCategoryService(
      req.user!.id,
      req.body
    );

    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = await updateCategoryService(
      req.user!.id,
      String(req.params.id),
      req.body
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deleteCategoryService(
      req.user!.id,
      String(req.params.id)
    );

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function bulkUpdateCategory(req: Request, res: Response) {
  const userId = req.user!.id;
  const { create, update, delete: del } = req.body;

  await bulkUpdateCategoryService(userId, {
    create: create ?? [],
    update: update ?? [],
    delete: del ?? [],
  });

  res.json({ success: true });
}
