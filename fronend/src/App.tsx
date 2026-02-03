import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import AddExpensePage from "./pages/AddExpensePage";
import EditExpensePage from "./pages/EditExpensePage";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "@/context/AuthProvider"; 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/expenses/new" element={<AddExpensePage />} />
            <Route path="/expenses/edit/:id" element={<EditExpensePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
