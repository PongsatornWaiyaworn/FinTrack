import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DeleteExpenseDialog } from "@/components/expenses/DeleteExpenseDialog";
import { ExpenseFilters as ExpenseFiltersPanel } from "@/components/expenses/ExpenseFilters";

import { useExpenses, useDeleteExpense } from "@/hooks/useExpenses";
import { useExpenseCategories } from "@/hooks/useExpenseCategories";
import { exportToCSV } from "@/lib/csv-export";

import type { Expense, ExpenseFilters } from "@/types/expense";

const defaultFilters: ExpenseFilters = {
  sortField: "expense_date",
  sortDirection: "desc",
};

export default function ExpensesPage() {
  const [filters, setFilters] = useState<ExpenseFilters>(defaultFilters);
  const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);

  const { data: expenses = [], isLoading } = useExpenses(filters);
  const { categories, loading: categoryLoading } = useExpenseCategories();
  const deleteMutation = useDeleteExpense();

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const expensesWithCategory = expenses.map((exp) => ({
    ...exp,
    category: categoryMap.get(exp.category_id) ?? null,
  }));

  const handleExport = () => {
    if (expensesWithCategory.length > 0) {
      exportToCSV(expensesWithCategory);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteExpense) return;

    deleteMutation.mutate(deleteExpense.id, {
      onSuccess: () => setDeleteExpense(null),
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Filters */}
        <ExpenseFiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
        />

        {/* Summary */}
        <SummaryCards expenses={expensesWithCategory} />

        {/* Table */}
        <ExpenseTable
          expenses={expensesWithCategory}
          onDelete={setDeleteExpense}
          isLoading={isLoading || categoryLoading}
        />

        {/* Delete Dialog */}
        <DeleteExpenseDialog
          expense={deleteExpense}
          open={!!deleteExpense}
          onOpenChange={(open) => !open && setDeleteExpense(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </AppLayout>
  );
}
