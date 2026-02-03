import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expense } from "@/types/expense";
import { format } from "date-fns";

interface DeleteExpenseDialogProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteExpenseDialog({
  expense,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteExpenseDialogProps) {
  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Expense</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this expense? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p>
              <span className="text-muted-foreground">Amount:</span>{" "}
              <span className="font-medium font-mono">
                ${expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Category:</span>{" "}
              <span className="font-medium">{expense.category}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Date:</span>{" "}
              <span className="font-medium">{format(new Date(expense.expense_date), "PP")}</span>
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
