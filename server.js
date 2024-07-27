import express from "express";
import dotenv from "dotenv";
import transactionRouter from "./src/routes/routes.js";
import cors from "cors";
import path from "path";
const app = express();
dotenv.config();
app.use(cors());
app.use(express.static(path.resolve("public")));
app.get("/",(req,res)=>{
  res.status(200).render("index.html");
})
app.use("/api", transactionRouter);

app.listen(process.env.PORT, () => {
  
  console.log("server is running at port 3000");
});
