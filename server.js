import express from "express";
import dotenv from "dotenv";
import transactionRouter from "./src/routes/routes.js";
import cors from "cors";
const app = express();
dotenv.config();
app.use(cors());
app.use("/api", transactionRouter);

app.listen(process.env.PORT, () => {
  console.log("server is running at port 3000");
});
