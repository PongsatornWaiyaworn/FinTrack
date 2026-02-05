const { z } = require("zod");

const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  color: z.string().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().optional(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
