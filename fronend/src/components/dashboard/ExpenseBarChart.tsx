import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  parseISO,
  format,
  isSameDay,
  subMonths,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  isWithinInterval,
} from "date-fns";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* ---------------- Types ---------------- */
type ExpenseWithCategory = {
  id: string;
  amount: number | string;
  expense_date: string;
  category?: {
    id: string;
    name: string;
    color?: string | null;
  } | null;
};

type ViewMode =
  | "today"
  | "thisWeek"
  | "thisMonth"
  | "last3Months"
  | "thisYear";

/* ---------------- Utils ---------------- */
const normalizeAmount = (v: any) =>
  Math.round(Number(v) * 100) / 100;

/* ---------------- Tooltip ---------------- */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border bg-background p-2 shadow-sm">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>

      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: p.fill }}
          />
          <span className="text-sm">
            {p.name}:{" "}
            <b>
              $
              {Number(p.value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </b>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Component ---------------- */
export default function ExpenseChart({
  expenses,
}: {
  expenses: ExpenseWithCategory[];
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("today");

  /* -------- categories -------- */
  const categories = useMemo(() => {
    const map = new Map<string, { name: string; color: string }>();

    expenses.forEach((e) => {
      const name = e.category?.name ?? "Uncategorized";
      const color = e.category?.color ?? "#94a3b8";
      if (!map.has(name)) map.set(name, { name, color });
    });

    return Array.from(map.values());
  }, [expenses]);

  /* -------- chart data -------- */
  const chartData = useMemo(() => {
    if (expenses.length === 0) return [];

    const today = new Date();

    const weekRange = {
      start: startOfWeek(today, { weekStartsOn: 1 }),
      end: endOfWeek(today, { weekStartsOn: 1 }),
    };

    const monthStart = startOfMonth(today);
    const threeMonthsAgo = startOfMonth(subMonths(today, 2));
    const yearStart = startOfYear(today);

    const map = new Map<string, any>();

    const initRow = (label: string) => {
      const row: any = { date: label };
      categories.forEach((c) => (row[c.name] = 0));
      return row;
    };

    const add = (
      key: string,
      label: string,
      category: string,
      amount: number
    ) => {
      if (!map.has(key)) map.set(key, initRow(label));
      map.get(key)[category] += normalizeAmount(amount);
    };

    expenses.forEach((e) => {
      const date = parseISO(e.expense_date);
      const cat = e.category?.name ?? "Uncategorized";
      const amt = normalizeAmount(e.amount);

      switch (viewMode) {
        case "today":
          if (isSameDay(date, today)) {
            add("today", "Today", cat, amt);
          }
          break;

        case "thisWeek":
          if (isWithinInterval(date, weekRange)) {
            const key = format(date, "yyyy-MM-dd");
            add(key, format(date, "EEE dd"), cat, amt);
          }
          break;

        case "thisMonth":
          if (date >= monthStart) {
            const key = format(date, "yyyy-MM-dd");
            add(key, format(date, "dd MMM"), cat, amt);
          }
          break;

        case "last3Months":
          if (date >= threeMonthsAgo) {
            const key = format(date, "yyyy-MM");
            add(key, format(date, "MMM yyyy"), cat, amt);
          }
          break;

        case "thisYear":
          if (date >= yearStart) {
            const key = format(date, "yyyy-MM");
            add(key, format(date, "MMM yyyy"), cat, amt);
          }
          break;
      }
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [expenses, viewMode, categories]);

  /* -------- view modes -------- */
  const modes: { label: string; value: ViewMode }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "thisWeek" },
    { label: "This Month", value: "thisMonth" },
    { label: "Last 3 Months", value: "last3Months" },
    { label: "This Year", value: "thisYear" },
  ];

  /* -------- render -------- */
  return (
    <Card>
      <CardContent>
        {/* Controls */}
        <div className="flex flex-wrap justify-end gap-2 mb-4">
          {modes.map((m) => (
            <Button
              key={m.value}
              size="sm"
              variant={viewMode === m.value ? "default" : "outline"}
              onClick={() => setViewMode(m.value)}
            >
              {m.label}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-[350px]">
          {chartData.length === 0 ? (
            <p className="text-center text-muted-foreground mt-20">
              No expense data
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  tickFormatter={(v) =>
                    Number(v).toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                {categories.map((c) => (
                  <Bar
                    key={c.name}
                    dataKey={c.name}
                    fill={c.color}
                    barSize={22}
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
