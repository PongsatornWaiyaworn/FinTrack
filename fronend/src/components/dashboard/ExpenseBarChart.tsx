"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { parseISO, format } from "date-fns";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ExpenseWithCategory = {
  id: string;
  amount: number;
  expense_date: string;
  note?: string;
  category?: {
    id: string;
    name: string;
    color?: string | null;
  } | null;
};

type ViewMode = "daily" | "monthly" | "yearly";

export default function ExpenseChart({
  expenses,
}: {
  expenses: ExpenseWithCategory[];
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  const categories = useMemo(() => {
    const map = new Map<string, { name: string; color: string }>();

    expenses.forEach((e) => {
      const name = e.category?.name ?? "Uncategorized";
      const color = e.category?.color ?? "#94a3b8";

      if (!map.has(name)) {
        map.set(name, { name, color });
      }
    });

    return Array.from(map.values());
  }, [expenses]);

  const chartData = useMemo(() => {
    if (expenses.length === 0) return [];

    const getKey = (date: Date) => {
      if (viewMode === "daily") return format(date, "yyyy-MM-dd");
      if (viewMode === "monthly") return format(date, "yyyy-MM");
      return format(date, "yyyy");
    };

    const formatLabel = (key: string) => {
      if (viewMode === "daily")
        return format(parseISO(key), "dd MMM");
      if (viewMode === "monthly")
        return format(parseISO(`${key}-01`), "MMM yyyy");
      return key;
    };

    const map = new Map<string, any>();

    expenses.forEach((e) => {
      const date = parseISO(e.expense_date);
      const key = getKey(date);
      const categoryName = e.category?.name ?? "Uncategorized";

      if (!map.has(key)) {
        map.set(key, { date: formatLabel(key) });
      }

      const row = map.get(key);
      row[categoryName] =
        (row[categoryName] || 0) + Number(e.amount);
    });

    return Array.from(map.values());
  }, [expenses, viewMode]);

  return (
    <Card>
      <CardContent>
        {/* View Mode */}
        <div className="flex justify-end gap-2 mb-4">
          {(["daily", "monthly", "yearly"] as ViewMode[]).map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={viewMode === mode ? "default" : "outline"}
              onClick={() => setViewMode(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          ))}
        </div>

        <div className="h-[350px]">
          {chartData.length === 0 ? (
            <p className="text-center text-muted-foreground mt-20">
              No expense data
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) =>
                    `$${value.toLocaleString()}`
                  }
                />

                {categories.map((cat) => (
                  <Bar
                    key={cat.name}
                    dataKey={cat.name}
                    fill={cat.color}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
