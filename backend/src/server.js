require("dotenv").config();
const app = require("./app");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(","),
    credentials: process.env.CORS_CREDENTIALS === "true",
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
