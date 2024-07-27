import { transactionMiddleware } from "../middlewares/middlewares.js";
import { transactionModel } from "../model/model.js";
export class transactionController {
  static async getTransaction(req, res) {
    try {
      const data = await transactionModel.fetchData();
      const criteria = {
        search: req.query.search || "",
        page: parseInt(req.query.page) || 1,
        per_page: parseInt(req.query.per_page) || 10,
      };
      const result = transactionMiddleware.filterTransaction(data, criteria);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions", error });
    }
  }

  static async getStatistics(req, res) {
    try {
      const data = await transactionModel.fetchData();
      const month = parseInt(req.query.month);
      if (!month) {
        return res.status(400).json({ message: "Month is required" });
      }
      const statistics = await transactionMiddleware.calculateStatistics(
        data,
        month
      );
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Error fetching statistics", error });
    }
  }

  static async getBarChartData(req, res) {
    try {
      const data = await transactionModel.fetchData();
      const month = parseInt(req.query.month);
      if (!month) {
        return res.status(400).json({ message: "Month is required" });
      }
      const barChartData = transactionMiddleware.categorizeTransactionsByPrice(
        data,
        month
      );
      res.json(barChartData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bar chart data", error });
    }
  }

  static async getPieChartData(req, res) {
    try {
      const data = await transactionModel.fetchData();
      const month = parseInt(req.query.month);
      if (!month) {
        return res.status(400).json({ message: "Month is required" });
      }
      const pieChartData =
        transactionMiddleware.categorizeTransactionsByCategory(data, month);
      res.json(pieChartData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pie chart data", error });
    }
  }

  static async getCombinedData(req, res) {
    try {
      const { month, search, page = 1, per_page = 10 } = req.query;
      const data = await transactionModel.fetchData();

      const filteredTransactions = transactionMiddleware.filterTransaction(
        data,
        { search }
      );

      const paginatedTransactions = transactionMiddleware.paginateTransactions(
        filteredTransactions,
        page,
        per_page
      );
      const statisticsData = transactionMiddleware.calculateStatistics(data,
        month
      );
      const ChartData = transactionMiddleware.categorizeTransactionsByPrice(data,
        month
      );

      const pieChartData =
        transactionMiddleware.categorizeTransactionsByCategory(
          data,
          parseInt(month)
        );

      const combinedData = {
        transactions: paginatedTransactions,
        statistics: statisticsData,
        pieChart: pieChartData,
        barChart: ChartData,
      };

      res.json(combinedData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching combined data", error });
    }
  }
}
