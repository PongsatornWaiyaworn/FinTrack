import "./config/env";
import app from "./app";

// app.use(cors({
//   origin: ["http://localhost:5173", "https://fintrack-frontend.onrender.com"],
//   credentials: true,
// }));


app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
function cors(arg0: { origin: string[]; credentials: boolean; }): any {
    throw new Error("Function not implemented.");
}
