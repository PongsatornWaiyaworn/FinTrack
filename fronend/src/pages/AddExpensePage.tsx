import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateExpense } from "@/hooks/useExpenses";
import { ExpenseFormData } from "@/types/expense";

export default function AddExpensePage() {
  const navigate = useNavigate();
  const createMutation = useCreateExpense();

  const handleSubmit = (data: ExpenseFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => navigate("/expenses"),
    });
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
            <CardDescription>
              Enter the details of your expense below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseForm
              onSubmit={handleSubmit}
              onCancel={() => navigate("/expenses")}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
