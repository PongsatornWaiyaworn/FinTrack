import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Trophy } from "lucide-react";
import { differenceInDays } from "date-fns";
import { Expense } from "@/types/expense";

interface ExpenseWithCategory extends Expense {
  category: {
    id: string;
    name: string;
  } | null;
}

interface SummaryCardsProps {
  expenses: ExpenseWithCategory[];
  startDate?: Date;
  endDate?: Date;
}

export function SummaryCards({
  expenses,
  startDate,
  endDate,
}: SummaryCardsProps) {
  const totalAmount = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  // จำนวนวัน
  const days =
    startDate && endDate
      ? Math.max(1, differenceInDays(endDate, startDate) + 1)
      : expenses.length > 0
      ? Math.max(
          1,
          differenceInDays(
            new Date(
              Math.max(
                ...expenses.map((e) =>
                  new Date(e.expense_date).getTime()
                )
              )
            ),
            new Date(
              Math.min(
                ...expenses.map((e) =>
                  new Date(e.expense_date).getTime()
                )
              )
            )
          ) + 1
        )
      : 1;

  const averageDaily = totalAmount / days;
  
  const categoryTotals = expenses.reduce((acc, exp) => {
    const categoryName = exp.category?.name;
    if (!categoryName) return acc;

    acc[categoryName] =
      (acc[categoryName] || 0) + Number(exp.amount);

    return acc;
  }, {} as Record<string, number>);

  const topCategoryEntry = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total Expenses
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">
            ${totalAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {expenses.length} transactions
          </p>
        </CardContent>
      </Card>

      {/* Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Daily Average
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">
            ${averageDaily.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Over {days} day{days > 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* Top Category */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Top Category
          </CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topCategoryEntry ? topCategoryEntry[0] : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {topCategoryEntry
              ? `$${topCategoryEntry[1].toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "No expenses yet"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
