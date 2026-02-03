import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Trophy } from "lucide-react";
import { Expense } from "@/types/expense";
import { differenceInDays } from "date-fns";

interface SummaryCardsProps {
  expenses: Expense[];
  startDate?: Date;
  endDate?: Date;
}

export function SummaryCards({ expenses, startDate, endDate }: SummaryCardsProps) {
  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Calculate average daily expense
  const days = startDate && endDate
    ? Math.max(1, differenceInDays(endDate, startDate) + 1)
    : expenses.length > 0
    ? Math.max(1, differenceInDays(
        new Date(Math.max(...expenses.map(e => new Date(e.expense_date).getTime()))),
        new Date(Math.min(...expenses.map(e => new Date(e.expense_date).getTime())))
      ) + 1)
    : 1;
  
  const averageDaily = totalAmount / days;

  // Find highest spending category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">
            ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {expenses.length} transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">
            ${averageDaily.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            Over {days} day{days > 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topCategory ? topCategory[0] : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {topCategory 
              ? `$${topCategory[1].toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "No expenses yet"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
