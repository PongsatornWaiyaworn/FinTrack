import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Expense, ExpenseFormData, ExpenseFilters } from "@/types/expense";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export function useExpenses(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: ["expenses", filters],
    queryFn: async () => {
      let query = supabase
        .from("expenses")
        .select("*");

      if (filters?.startDate) {
        query = query.gte("expense_date", format(filters.startDate, "yyyy-MM-dd"));
      }
      if (filters?.endDate) {
        query = query.lte("expense_date", format(filters.endDate, "yyyy-MM-dd"));
      }

      const sortField = filters?.sortField || "expense_date";
      const sortDirection = filters?.sortDirection === "asc";
      query = query.order(sortField, { ascending: sortDirection });

      const { data, error } = await query;

      if (error) throw error;
      return data as Expense[];
    },
  });
}

export function useExpense(id: string | undefined) {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Expense;
    },
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: ExpenseFormData) => {
      const { data, error } = await supabase
        .from("expenses")
        .insert({
          amount: expense.amount,
          category: expense.category,
          expense_date: format(expense.expense_date, "yyyy-MM-dd"),
          note: expense.note || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: "Expense created",
        description: "Your expense has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create expense. Please try again.",
        variant: "destructive",
      });
      console.error("Create expense error:", error);
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, expense }: { id: string; expense: ExpenseFormData }) => {
      const { data, error } = await supabase
        .from("expenses")
        .update({
          amount: expense.amount,
          category: expense.category,
          expense_date: format(expense.expense_date, "yyyy-MM-dd"),
          note: expense.note || null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: "Expense updated",
        description: "Your expense has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive",
      });
      console.error("Update expense error:", error);
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: "Expense deleted",
        description: "The expense has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive",
      });
      console.error("Delete expense error:", error);
    },
  });
}
