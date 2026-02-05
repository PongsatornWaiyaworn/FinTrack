const { db } = require("../../config/db");
const { DEFAULT_CATEGORIES } = require("../../constant/defaultCategories");
const { CategorySQL } = require("./category.sql");

async function getCategoriesService(userId) {
  const { rows } = await db.query(
    CategorySQL.getAllByUser,
    [userId]
  );
  return rows;
}

async function getCategoryByIdService(userId, categoryId) {
  const { rows } = await db.query(
    CategorySQL.getById,
    [categoryId, userId]
  );
  return rows[0];
}

async function createCategoryService(userId, data) {
  const { rows } = await db.query(
    CategorySQL.create,
    [userId, data.name, data.color ?? null]
  );
  return rows[0];
}

async function updateCategoryService(userId, categoryId, data) {
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

async function deleteCategoryService(userId, categoryId) {
  await db.query(
    CategorySQL.delete,
    [categoryId, userId]
  );
}

async function createDefaultCategories(userId) {
  for (const cat of DEFAULT_CATEGORIES) {
    await db.query(
      CategorySQL.create,
      [userId, cat.name, cat.color]
    );
  }
}

async function bulkUpdateCategoryService(userId, data) {
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

module.exports = {
  getCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  createDefaultCategories,
  bulkUpdateCategoryService,
};
