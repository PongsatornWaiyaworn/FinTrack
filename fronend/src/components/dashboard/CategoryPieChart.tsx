import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryPieChartProps {
  expenses: ExpenseWithCategory[];
}

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

export function CategoryPieChart({ expenses }: CategoryPieChartProps) {

  const categoryData = expenses.reduce<
    { name: string; value: number; color: string }[]
  >((acc, exp) => {
    const name = exp.category?.name ?? "Uncategorized";
    const color = exp.category?.color ?? "#94a3b8";

    const existing = acc.find((i) => i.name === name);
    if (existing) {
      existing.value += Number(exp.amount);
    } else {
      acc.push({
        name,
        value: Number(exp.amount),
        color,
      });
    }

    return acc;
  }, []);

  categoryData.sort((a, b) => b.value - a.value);

  return (
    <Card>
  <CardContent className="h-[300px] flex items-center justify-center">
    {categoryData.length === 0 ? (
      <p className="text-muted-foreground">No data available</p>
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={85}
            dataKey="value"
            paddingAngle={2}
          >
            {categoryData.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number) =>
              `$${value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            }
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    )}
  </CardContent>
</Card>
  );
}
