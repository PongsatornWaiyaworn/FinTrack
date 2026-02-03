import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Expense } from "@/types/expense";
import { format, parseISO, startOfMonth, eachDayOfInterval, eachMonthOfInterval, subDays } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ExpenseBarChartProps {
  expenses: Expense[];
  startDate?: Date;
  endDate?: Date;
}

type ViewMode = "daily" | "monthly";

export function ExpenseBarChart({ expenses, startDate, endDate }: ExpenseBarChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  const generateChartData = () => {
    if (expenses.length === 0) return [];

    const expenseDates = expenses.map((e) => parseISO(e.expense_date));
    const minDate = startDate || new Date(Math.min(...expenseDates.map((d) => d.getTime())));
    const maxDate = endDate || new Date(Math.max(...expenseDates.map((d) => d.getTime())));

    if (viewMode === "daily") {
      const days = eachDayOfInterval({
        start: minDate,
        end: maxDate,
      }).slice(-30); // Last 30 days max

      return days.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const total = expenses
          .filter((e) => e.expense_date === dayStr)
          .reduce((sum, e) => sum + Number(e.amount), 0);

        return {
          date: format(day, "MMM dd"),
          amount: total,
        };
      });
    } else {
      const months = eachMonthOfInterval({
        start: startOfMonth(minDate),
        end: startOfMonth(maxDate),
      });

      return months.map((month) => {
        const monthStr = format(month, "yyyy-MM");
        const total = expenses
          .filter((e) => e.expense_date.startsWith(monthStr))
          .reduce((sum, e) => sum + Number(e.amount), 0);

        return {
          date: format(month, "MMM yyyy"),
          amount: total,
        };
      });
    }
  };

  const chartData = generateChartData();

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expense Trend</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Expense Trend</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("daily")}
          >
            Daily
          </Button>
          <Button
            variant={viewMode === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("monthly")}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value: number) => [
                `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                "Amount",
              ]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar
              dataKey="amount"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
