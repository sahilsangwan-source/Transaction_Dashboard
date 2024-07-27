export class transactionMiddleware {
  static filterTransaction(data, criteria) {
    if (!criteria.search) {
      return data;
    }
    const { search = "" } = criteria;

    let filteredTransactions = data.filter((transaction) => {
      return (
        transaction.title.includes(search) ||
        transaction.description.includes(search) ||
        transaction.price.toString().includes(search) ||
        transaction.category.includes(search)
      );
    });
    return filteredTransactions;
  }

  static calculateStatistics(data, month) {
    const totalSales = data.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.dateOfSale);
      if (transactionDate.getMonth() + 1 == month && transaction.sold) {
        return acc + transaction.price;
      }
      return acc;
    }, 0);

    const totalSoldItems = data.filter((transaction) => {
      const transactionDate = new Date(transaction.dateOfSale);
      return transactionDate.getMonth() + 1 == month && transaction.sold;
    }).length;

    const totalNotSoldItems = data.filter((transaction) => {
      const transactionDate = new Date(transaction.dateOfSale);
      return transactionDate.getMonth() + 1 == month && !transaction.sold;
    }).length;

    return {
      totalSales,
      totalSoldItems,
      totalNotSoldItems,
    };
  }

  static categorizeTransactionsByPrice(data, month) {
    const ranges = [
      { range: "0-100", min: 0, max: 100, count: 0 },
      { range: "101-200", min: 101, max: 200, count: 0 },
      { range: "201-300", min: 201, max: 300, count: 0 },
      { range: "301-400", min: 301, max: 400, count: 0 },
      { range: "401-500", min: 401, max: 500, count: 0 },
      { range: "501-600", min: 501, max: 600, count: 0 },
      { range: "601-700", min: 601, max: 700, count: 0 },
      { range: "701-800", min: 701, max: 800, count: 0 },
      { range: "801-900", min: 801, max: 900, count: 0 },
    ];

    data.forEach((transaction) => {
      const transactionDate = new Date(transaction.dateOfSale);
      if (transactionDate.getMonth() + 1 == month) {
        ranges.forEach((range) => {
          if (
            transaction.price >= range.min &&
            transaction.price <= range.max
          ) {
            range.count++;
          }
        });
      }
    });

    return ranges.map((range) => ({
      priceRange: range.range,
      count: range.count,
    }));
  }

  static categorizeTransactionsByCategory(data, month) {
    const categoryCounts = {};

    data.forEach((transaction) => {
      const transactionDate = new Date(transaction.dateOfSale);
      if (transactionDate.getMonth() + 1 == month) {
        const category = transaction.category;
        if (categoryCounts[category]) {
          categoryCounts[category]++;
        } else {
          categoryCounts[category] = 1;
        }
      }
    });

    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));
  }

  static paginateTransactions(data, page, per_page) {
    const start = (page - 1) * per_page;
    return data.slice(start, start + per_page);
  }
}
