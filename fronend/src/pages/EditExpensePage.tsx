import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpense, useUpdateExpense } from "@/hooks/useExpenses";
import { ExpenseFormData } from "@/types/expense";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditExpensePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: expense, isLoading } = useExpense(id);
  const updateMutation = useUpdateExpense();

  const handleSubmit = (data: ExpenseFormData) => {
    if (id) {
      updateMutation.mutate(
        { id, expense: data },
        { onSuccess: () => navigate("/expenses") }
      );
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!expense) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Expense not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Expense</CardTitle>
            <CardDescription>
              Update the details of your expense
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseForm
              expense={expense}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/expenses")}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
