import "./config/env";
import app from "./app";
import cors from "cors";

const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(","),
    credentials: process.env.CORS_CREDENTIALS === "true",
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
