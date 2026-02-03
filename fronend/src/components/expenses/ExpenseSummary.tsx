import { Expense } from "@/types/expense";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, DollarSign } from "lucide-react";

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const count = expenses.length;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Receipt className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold font-mono">
              ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
