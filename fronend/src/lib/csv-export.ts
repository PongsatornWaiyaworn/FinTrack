import { Expense } from "@/types/expense";
import { format } from "date-fns";

export function exportToCSV(
  expenses: Expense[],
  filename: string = "expenses"
) {
  const headers = ["Date", "Category", "Amount", "Note"];

  const rows = expenses.map((expense) => [
    format(new Date(expense.expense_date), "yyyy-MM-dd"),
    typeof expense.category === "string"
      ? expense.category
      : expense.category?.name || "", 
    parseFloat(expense.amount.toString()).toFixed(2),
    expense.note || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) =>
          `"${String(cell).replace(/"/g, '""')}"`
        )
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
