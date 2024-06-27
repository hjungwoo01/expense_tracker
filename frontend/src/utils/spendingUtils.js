export const getTodaySpending = (expenses) => {
    const today = new Date().toISOString().split('T')[0];
    return expenses
      .filter(expense => expense.date.split('T')[0] === today)
      .reduce((total, expense) => total + expense.amount, 0);
  };
  
  export const getWeekSpending = (expenses) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return expenses
      .filter(expense => new Date(expense.date) >= startOfWeek)
      .reduce((total, expense) => total + expense.amount, 0);
  };
  
  export const getMonthSpending = (expenses) => {
    const currentMonth = new Date().getMonth() + 1;
    return expenses
      .filter(expense => new Date(expense.date).getMonth() + 1 === currentMonth)
      .reduce((total, expense) => total + expense.amount, 0);
  };
  
  export const getYearSpending = (expenses) => {
    const currentYear = new Date().getFullYear();
    return expenses
      .filter(expense => new Date(expense.date).getFullYear() === currentYear)
      .reduce((total, expense) => total + expense.amount, 0);
  };
  
  export const filterExpensesByPeriod = (expenses, period, month, year) => {
    return expenses.filter(expense => {
      const date = new Date(expense.date);
      const expenseMonth = date.getMonth() + 1;
      const expenseYear = date.getFullYear();
  
      if (expenseYear !== year) return false;
  
      if (period === 'year') return true;
      if (period === 'month' && expenseMonth === month) return true;
      if (period === 'week') {
        const weekStart = new Date(year, month - 1, 1);
        const weekEnd = new Date(year, month, 0);
        return date >= weekStart && date <= weekEnd;
      }
      if (period === 'day') {
        const today = new Date();
        return date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
      }
      return false;
    });
  };
  
  export const groupExpensesByDay = (expenses) => {
    const grouped = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, amount: 0 };
      }
      acc[date].amount += expense.amount;
      return acc;
    }, {});
  
    return Object.values(grouped);
  };
  
  export const groupExpensesByWeek = (expenses) => {
    const grouped = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const week = `${weekStart.toISOString().split('T')[0]} - ${date.toISOString().split('T')[0]}`;
      if (!acc[week]) {
        acc[week] = { date: week, amount: 0 };
      }
      acc[week].amount += expense.amount;
      return acc;
    }, {});
  
    return Object.values(grouped);
  };
  
  export const groupExpensesByMonth = (expenses) => {
    const grouped = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toISOString().substring(0, 7);
      if (!acc[month]) {
        acc[month] = { date: month, amount: 0 };
      }
      acc[month].amount += expense.amount;
      return acc;
    }, {});
  
    return Object.values(grouped);
  };
  
  export const groupExpensesByYear = (expenses) => {
    const grouped = expenses.reduce((acc, expense) => {
      const year = new Date(expense.date).getFullYear();
      if (!acc[year]) {
        acc[year] = { date: year, amount: 0 };
      }
      acc[year].amount += expense.amount;
      return acc;
    }, {});
  
    return Object.values(grouped);
  };
  
  export const groupExpensesByCategory = (expenses) => {
    const grouped = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { category, amount: 0 };
      }
      acc[category].amount += expense.amount;
      return acc;
    }, {});
  
    return Object.values(grouped);
  };
  