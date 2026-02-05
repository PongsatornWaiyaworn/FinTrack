import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Expense, ExpenseFormData, ExpenseFilters } from "@/types/expense";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { format } from "date-fns";

export function useExpenses(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: ["expenses", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.startDate) {
        params.append(
          "startDate",
          format(filters.startDate, "yyyy-MM-dd")
        );
      }

      if (filters?.endDate) {
        params.append(
          "endDate",
          format(filters.endDate, "yyyy-MM-dd")
        );
      }

      if (filters?.sortField) {
        params.append("sortField", filters.sortField);
      }

      if (filters?.sortDirection) {
        params.append("sortDirection", filters.sortDirection);
      }

      return apiFetch(`/expenses?${params.toString()}`) as Promise<Expense[]>;
    },
  });
}

export function useExpense(id?: string) {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: () => apiFetch(`/expenses/${id}`) as Promise<Expense>,
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expense: ExpenseFormData) =>
      apiFetch("/expenses", {
        method: "POST",
        body: JSON.stringify({
          ...expense,
          expense_date: format(expense.expense_date, "yyyy-MM-dd"),
        }),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: "Expense created",
        description: "Your expense has been saved successfully.",
      });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, expense }: { id: string; expense: ExpenseFormData }) =>
      apiFetch(`/expenses/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...expense,
          expense_date: format(expense.expense_date, "yyyy-MM-dd"),
        }),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: "Expense updated",
      });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseId: string) => {
      return apiFetch(`/expenses/${expenseId}`, {
        method: "DELETE",
      });
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
