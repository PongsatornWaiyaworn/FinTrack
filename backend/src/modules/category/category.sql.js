const CategorySQL = {
  getAllByUser: `
    SELECT * FROM categories
    WHERE user_id = $1
    ORDER BY created_at
  `,

  getById: `
    SELECT * FROM categories
    WHERE id = $1 AND user_id = $2
  `,

  create: `
    INSERT INTO categories (user_id, name, color)
    VALUES ($1, $2, $3)
    RETURNING *
  `,

  update: `
    UPDATE categories
    SET
      name = COALESCE($3, name),
      color = COALESCE($4, color)
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `,

  delete: `
    DELETE FROM categories
    WHERE id = $1 AND user_id = $2
  `,
};

module.exports = { CategorySQL };