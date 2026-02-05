import { useEffect, useState, useCallback } from "react";
import { Category } from "@/types/category";
import { apiFetch } from "@/lib/api";

export function useExpenseCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/categories");
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
