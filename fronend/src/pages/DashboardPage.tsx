import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { ExpenseBarChart } from "@/components/dashboard/ExpenseBarChart";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { useExpenses } from "@/hooks/useExpenses";
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

  if (isLoading) {
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

        {/* Summary Cards */}
        <SummaryCards
          expenses={expenses}
          startDate={startDate}
          endDate={endDate}
        />

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryPieChart expenses={expenses} />
          <ExpenseBarChart
            expenses={expenses}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    </AppLayout>
  );
}
