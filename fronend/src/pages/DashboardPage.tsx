import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import ExpenseBarChart from "@/components/dashboard/ExpenseBarChart";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { useExpenses } from "@/hooks/useExpenses";
import { useExpenseCategories } from "@/hooks/useExpenseCategories";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const { data: expenses = [], isLoading } = useExpenses({
    startDate,
    endDate,
    sortField: "expense_date",
    sortDirection: "desc",
  });

  const { categories, loading: categoryLoading } = useExpenseCategories();

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const expensesWithCategory = useMemo(
    () =>
      expenses.map((exp) => ({
        ...exp,
        category: categoryMap.get(exp.category_id) ?? null,
      })),
    [expenses, categoryMap]
  );

  if (isLoading || categoryLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Visualize and analyze your spending
            </p>
          </div>

          <Skeleton className="h-16 w-full" />

          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[380px]" />
            <Skeleton className="h-[380px]" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visualize and analyze your spending
          </p>
        </div>

        {/* Filters */}
        <DashboardFilters
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        {/* Summary */}
        <SummaryCards
          expenses={expensesWithCategory}
          startDate={startDate}
          endDate={endDate}
        />

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 min-h-[600px] h-full">
          <div className="h-full">
            <CategoryPieChart expenses={expensesWithCategory} />
          </div>

          <div className="h-full">
            <ExpenseBarChart expenses={expensesWithCategory} />
          </div>
      </div>
      </div>
    </AppLayout>
  );
}
