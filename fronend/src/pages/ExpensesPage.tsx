import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { DeleteExpenseDialog } from "@/components/expenses/DeleteExpenseDialog";
import { Button } from "@/components/ui/button";
import { useExpenses, useDeleteExpense } from "@/hooks/useExpenses";
import { Expense, ExpenseFilters as FilterType } from "@/types/expense";
import { exportToCSV } from "@/lib/csv-export";

export default function ExpensesPage() {
  const [filters, setFilters] = useState<FilterType>({
    sortField: "expense_date",
    sortDirection: "desc",
  });
  const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);

  const { data: expenses = [], isLoading } = useExpenses(filters);
  const deleteMutation = useDeleteExpense();

  const handleExport = () => {
    if (expenses.length > 0) {
      exportToCSV(expenses);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteExpense) {
      deleteMutation.mutate(deleteExpense.id, {
        onSuccess: () => setDeleteExpense(null),
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">
              Manage and track your expenses
            </p>
          </div>
          <Button asChild>
            <Link to="/expenses/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <ExpenseFilters
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
        />

        {/* Summary */}
        <ExpenseSummary expenses={expenses} />

        {/* Table */}
        <ExpenseTable
          expenses={expenses}
          onDelete={setDeleteExpense}
          isLoading={isLoading}
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
