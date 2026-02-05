const {
  getCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  bulkUpdateCategoryService,
} = require("./category.service");

async function getCategories(req, res, next) {
  try {
    const categories = await getCategoriesService(req.user.id);
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const category = await getCategoryByIdService(
      req.user.id,
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

async function createCategory(req, res, next) {
  try {
    const category = await createCategoryService(
      req.user.id,
      req.body
    );

    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await updateCategoryService(
      req.user.id,
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

async function deleteCategory(req, res, next) {
  try {
    await deleteCategoryService(
      req.user.id,
      String(req.params.id)
    );

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function bulkUpdateCategory(req, res, next) {
  try {
    const userId = req.user.id;
    const { create, update, delete: del } = req.body;

    await bulkUpdateCategoryService(userId, {
      create: create ?? [],
      update: update ?? [],
      delete: del ?? [],
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkUpdateCategory,
};
