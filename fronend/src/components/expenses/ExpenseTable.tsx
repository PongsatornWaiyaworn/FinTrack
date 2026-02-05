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
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center text-muted-foreground">
        <p className="text-lg">No expenses found</p>
        <p className="text-sm">Start by adding your first expense</p>
      </div>
    );
  }

  return (
    <>
      {/* ================= Desktop Table ================= */}
      <div className="hidden md:block rounded-lg border bg-card overflow-x-auto">
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
                      }}
                    >
                      {categoryName}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right font-mono">
                    $
                    {expense.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
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
                        className="text-destructive"
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

      {/* ================= Mobile Cards ================= */}
      <div className="md:hidden space-y-3">
        {expenses.map((expense) => {
          const categoryName =
            expense.category?.name ?? "Uncategorized";
          const categoryColor =
            expense.category?.color ?? "#e5e7eb";

          return (
            <div
              key={expense.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(expense.expense_date), "PP")}
                </span>

                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: categoryColor,
                    color: isDark(categoryColor) ? "#fff" : "#111",
                  }}
                >
                  {categoryName}
                </Badge>
              </div>

              {/* Amount */}
              <div className="text-lg font-mono font-semibold">
                $
                {expense.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>

              {/* Note */}
              {expense.note && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {expense.note}
                </p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/expenses/edit/${expense.id}`}>
                    <Pencil className="mr-1 h-4 w-4" />
                    Edit
                  </Link>
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(expense)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
