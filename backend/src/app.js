const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const expenseRoutes = require("./modules/expenses/expense.routes");
const categoryRoute = require("./modules/category/category.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoute);

module.exports = app;