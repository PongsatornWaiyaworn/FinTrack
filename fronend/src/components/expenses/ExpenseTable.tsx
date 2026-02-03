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
import { Expense } from "@/types/expense";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Transportation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Utilities: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Shopping: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (expense: Expense) => void;
  isLoading?: boolean;
}

export function ExpenseTable({ expenses, onDelete, isLoading }: ExpenseTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
    <div className="rounded-lg border bg-card">
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
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">
                {format(new Date(expense.expense_date), "PP")}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(categoryColors[expense.category])}
                >
                  {expense.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">
                ${expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
