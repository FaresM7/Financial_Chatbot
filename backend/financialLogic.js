const fs = require('fs').promises;

let financialData;
let keywords;

async function loadFinancialData() {
  try {
    const data = await fs.readFile('./financial_data.json', 'utf-8');
    financialData = JSON.parse(data);
  } catch (err) {
    console.error('Error reading financial data file:', err);
  }
}

async function loadKeywords() {
  try {
    const data = await fs.readFile('./Keywords.json', 'utf-8');
    keywords = JSON.parse(data);
  } catch (err) {
    console.error('Error reading keywords file:', err);
  }
}

function getFinancialData() {
  return financialData;
}

function calculateTotalSpending(userRecord, startMonth, endMonth) {
  const monthMap = keywords.monthMap;

  let totalSpending = 0;
  let addMonths = false;

  for (const month of Object.keys(monthMap)) {
    if (month === startMonth.toLowerCase()) {
      addMonths = true;
    }
    if (addMonths) {
      totalSpending += userRecord.spending[monthMap[month]] || 0;
    }
    if (month === endMonth.toLowerCase()) {
      break;
    }
  }

  return totalSpending;
}

function calculateMonthlySavings(userRecord, month) {
  const monthMap = keywords.monthMap;

  const spending = userRecord.spending[monthMap[month.toLowerCase()]] || 0;
  const income = userRecord.income;
  return income - spending;
}

function generateResponse(message, userInfo, userContext) {
  if (!financialData) {
    return 'Financial data not available.';
  }

  if (!keywords) {
    return 'Keywords not available.';
  }

  const user = userInfo.name;
  const userRecord = financialData.users.find(u => u.name.toLowerCase() === user.toLowerCase() && u.id === parseInt(userInfo.id));
  if (!userRecord) {
    return 'User not found.';
  }

  const lowerCaseMessage = message.toLowerCase();

  if (lowerCaseMessage.includes('exit')) {
    userContext.topic = null;
    return 'You have exited the current topic. You can now choose a new topic: spendings, savings, overview stocks, income, other';
  }

  if (!userContext.topic) {
    if (lowerCaseMessage.includes('spending')) {
      userContext.topic = 'spending';
      return 'What would you like to know about spendings? (e.g., total spendings, spendings for a specific month, spendings for a specific year)';
    } else if (lowerCaseMessage.includes('savings')) {
      userContext.topic = 'savings';
      return 'What would you like to know about savings? (e.g., total savings, savings for a specific month)';
    } else if (lowerCaseMessage.includes('overview')) {
      userContext.topic = 'overview';
      return 'Here is your asset overview: ' + userRecord.assetOverview.join(', ');
    } else if (lowerCaseMessage.includes('income')) {
      userContext.topic = 'income';
      return 'What would you like to know about your income sources? (e.g., job, investments, other)';
    } else {
      return 'Please specify what you would like to know about (e.g., spendings, savings, overview stocks, income, other).';
    }
  } else if (userContext.topic === 'spending') {
    if (lowerCaseMessage.includes('total')) {
      const totalSpending = Object.values(userRecord.spending).reduce((acc, val) => acc + val, 0);
      return `Your total spendings are $${totalSpending}. Would you like to know for a particular month or year?`;
    } else if (lowerCaseMessage.includes('for')) {
      const query = lowerCaseMessage.split('for')[1].trim();
      const monthMap = keywords.monthMap;
      if (monthMap[query.toLowerCase()]) {
        const spending = userRecord.spending[monthMap[query.toLowerCase()]] || 0;
        return `Your spendings for ${query} are $${spending}.`;
      } else if (userRecord.spendingOverYears[query]) {
        const spending = userRecord.spendingOverYears[query];
        return `Your spendings for ${query} are $${spending}.`;
      } else {
        return `I didn't understand that. Please specify a valid month or year.`;
      }
    } else if (lowerCaseMessage.includes('from') && lowerCaseMessage.includes('to')) {
      const [startMonth, endMonth] = lowerCaseMessage.split('from')[1].split('to').map(m => m.trim());
      const totalSpending = calculateTotalSpending(userRecord, startMonth, endMonth);
      return `Your total spendings from ${startMonth} to ${endMonth} are $${totalSpending}.`;
    } else {
      return 'I didn\'t understand that. Please specify total spendings or spendings for a particular month, year, or range.';
    }
  } else if (userContext.topic === 'savings') {
    if (lowerCaseMessage.includes('total')) {
      const totalSavings = userRecord.savings;
      return `Your total savings are $${totalSavings}.`;
    } else if (lowerCaseMessage.includes('for')) {
      const query = lowerCaseMessage.split('for')[1].trim();
      const monthMap = keywords.monthMap;
      if (monthMap[query.toLowerCase()]) {
        const savings = calculateMonthlySavings(userRecord, query);
        return `Your savings for ${query} are $${savings}.`;
      } else {
        return `I didn't understand that. Please specify a valid month.`;
      }
    } else {
      return 'I didn\'t understand that. Please specify total savings or savings for a particular month.';
    }
  } else if (userContext.topic === 'income') {
    return `Your total income is $${userRecord.income}. Would you like to know more about your income sources?`;
  } else if (userContext.topic === 'overview') {
    return 'Here is your asset overview: ' + userRecord.assetOverview.join(', ');
  }

  return 'I didn\'t understand that. Please specify what you would like to know about (e.g., spendings, savings, overview stocks, income, other).';
}

module.exports = {
  loadFinancialData,
  loadKeywords,
  getFinancialData,
  generateResponse
};
