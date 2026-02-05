export interface Category {
  id: string;
  user_id: string;

  name: string;
  color: string | null;

  created_at: string;
}

export interface CreateCategoryDTO {
  name: string;
  color?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  color?: string;
}
