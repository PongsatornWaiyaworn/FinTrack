import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import expenseRoutes from "./modules/expenses/expense.routes";
import categoryRoute from "./modules/category/category.route";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoute);

export default app;
