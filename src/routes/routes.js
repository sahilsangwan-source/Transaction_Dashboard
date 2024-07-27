import express from "express";
import { transactionController } from "../controller/controller.js";
const router = express.Router();

router.get("/transaction", transactionController.getTransaction);
router.get("/statistics", transactionController.getStatistics);
router.get("/barchart", transactionController.getBarChartData);
router.get("/piechart", transactionController.getPieChartData);
router.get("/combined-data", transactionController.getCombinedData);
export default router;
