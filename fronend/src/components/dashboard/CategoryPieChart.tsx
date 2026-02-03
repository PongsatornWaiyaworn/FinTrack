import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Expense } from "@/types/expense";

const COLORS = [
  "hsl(24, 100%, 50%)",   // Food - Orange
  "hsl(210, 100%, 50%)",  // Transportation - Blue
  "hsl(45, 100%, 50%)",   // Utilities - Yellow
  "hsl(270, 100%, 60%)",  // Entertainment - Purple
  "hsl(330, 100%, 60%)",  // Shopping - Pink
  "hsl(0, 0%, 50%)",      // Other - Gray
];

interface CategoryPieChartProps {
  expenses: Expense[];
}

export function CategoryPieChart({ expenses }: CategoryPieChartProps) {
  const categoryData = expenses.reduce((acc, exp) => {
    const existing = acc.find((item) => item.name === exp.category);
    if (existing) {
      existing.value += Number(exp.amount);
    } else {
      acc.push({ name: exp.category, value: Number(exp.amount) });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Sort by value for consistent color assignment
  categoryData.sort((a, b) => b.value - a.value);

  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
