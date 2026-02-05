import { db } from "@/config/db";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.schema";
import { DEFAULT_CATEGORIES } from "@/constant/defaultCategories";
import { CategorySQL } from "./category.sql";

export async function getCategoriesService(userId: string) {
  const { rows } = await db.query(
    CategorySQL.getAllByUser,
    [userId]
  );
  return rows;
}

export async function getCategoryByIdService(
  userId: string,
  categoryId: string
) {
  const { rows } = await db.query(
    CategorySQL.getById,
    [categoryId, userId]
  );
  return rows[0];
}

export async function createCategoryService(
  userId: string,
  data: CreateCategoryDto
) {
  const { rows } = await db.query(
    CategorySQL.create,
    [userId, data.name, data.color ?? null]
  );
  return rows[0];
}

export async function updateCategoryService(
  userId: string,
  categoryId: string,
  data: UpdateCategoryDto
) {
  const { rows } = await db.query(
    CategorySQL.update,
    [
      categoryId,
      userId,
      data.name ?? null,
      data.color ?? null,
    ]
  );
  return rows[0];
}

export async function deleteCategoryService(
  userId: string,
  categoryId: string
) {
  await db.query(
    CategorySQL.delete,
    [categoryId, userId]
  );
}

export async function createDefaultCategories(userId: string) {
  for (const cat of DEFAULT_CATEGORIES) {
    await db.query(
      CategorySQL.create,
      [userId, cat.name, cat.color]
    );
  }
}

type BulkPayload = {
  create: {
    name: string;
    color?: string | null;
  }[];
  update: {
    id: string;
    name?: string;
    color?: string | null;
  }[];
  delete: string[];
};

export async function bulkUpdateCategoryService(
  userId: string,
  data: BulkPayload
) {
  const { create, update, delete: del } = data;

  // CREATE
  for (const cat of create) {
    await db.query(CategorySQL.create, [
      userId,
      cat.name,
      cat.color ?? null,
    ]);
  }

  // UPDATE
  for (const cat of update) {
    await db.query(CategorySQL.update, [
      cat.id,
      userId,
      cat.name ?? null,
      cat.color ?? null,
    ]);
  }

  // DELETE
  for (const id of del) {
    await db.query(CategorySQL.delete, [id, userId]);
  }
}
