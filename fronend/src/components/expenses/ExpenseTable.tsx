import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExpenseWithCategory } from "@/types/expense";

interface ExpenseTableProps {
  expenses: ExpenseWithCategory[];
  onDelete: (expense: ExpenseWithCategory) => void;
  isLoading?: boolean;
}

const isDark = (color) => {
  const c = color.replace("#", "");
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 150;
};

export function ExpenseTable({
  expenses,
  onDelete,
  isLoading,
}: ExpenseTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
        <p className="text-lg">No expenses found</p>
        <p className="text-sm">Start by adding your first expense</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {expenses.map((expense) => {
            const categoryName =
              expense.category?.name ?? "Uncategorized";
            const categoryColor =
              expense.category?.color ?? "#e5e7eb";

            return (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">
                  {format(new Date(expense.expense_date), "PP")}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor: categoryColor,
                      color: isDark(categoryColor) ? "#fff" : "#111",
                      textShadow: isDark(categoryColor)
                        ? "0 0 6px #fff, 0 1px 2px rgba(0,0,0,0.7)"
                        : "0 1px 2px rgba(255,255,255,0.6)"
                    }}
                  >
                    {categoryName}
                  </Badge>
                </TableCell>

                <TableCell className="text-right font-mono">
                  $
                  {expense.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>

                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {expense.note || "-"}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/expenses/edit/${expense.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(expense)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
