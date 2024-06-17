const fs = require('fs').promises;

let financialData;

async function loadFinancialData() {
  try {
    const data = await fs.readFile('./financial_data.json', 'utf-8');
    financialData = JSON.parse(data);
  } catch (err) {
    console.error('Error reading financial data file:', err);
  }
}

function getFinancialData() {
  return financialData;
}

function generateResponse(message, userInfo) {
  if (!financialData) {
    return 'Financial data not available.';
  }

  const user = userInfo.name;
  const userRecord = financialData.users.find(u => u.name.toUpperCase() === user.toUpperCase() && u.id === parseInt(userInfo.id));
  if (!userRecord) {
    return 'User not found.';
  }

  const lowerCaseMessage = message.toLowerCase();

  // Define keywords for different categories
  const categories = {
    savings: ['savings', 'save', 'saved'],
    spending: ['spending', 'expenditure', 'expenses', 'spend'],
    monthlyStatement: ['monthly statement', 'statement for this month', 'monthly report', 'monthly summary'],
    assetOverview: ['asset overview', 'overview of assets', 'assets summary', 'assets report'],
    income: ['income', 'earnings', 'salary', 'wage'],
    debt: ['debt', 'loan', 'borrow', 'owe'],
    investment: ['investment', 'invest', 'stocks', 'bonds'],
    insurance: ['insurance', 'coverage', 'policy'],
    creditScore: ['credit score', 'credit rating'],
    tax: ['tax', 'taxes', 'tax return', 'tax refund'],
    retirementFund: ['retirement fund', 'pension', '401k', 'ira'],
    mortgage: ['mortgage', 'home loan'],
    rent: ['rent', 'lease'],
    utilityBills: ['utility bills', 'electricity bill', 'water bill', 'internet bill'],
    carLoan: ['car loan', 'auto loan'],
    studentLoan: ['student loan', 'education loan'],
    howFucked: ['how fucked'],
    canIAffordRent: ['rent'],
    canIAffordToLive: ['live'],
    canIAffordFood: ['food']
  };

  // Iterate over the categories to find a matching keyword and generate the appropriate response
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      switch (category) {
        case 'savings':
          return `${userRecord.name}'s savings: $${userRecord.savings}`;
        case 'spending':
          return `${userRecord.name}'s spending: $${userRecord.spending}`;
        case 'monthlyStatement':
          return `Here are ${userRecord.name}'s monthly statements: <a href="${userRecord.monthlyStatements[0]}" target="_blank">View PDF</a>`;
        case 'assetOverview':
          return `${userRecord.name}'s asset overview: ${userRecord.assetOverview}`;
        case 'income':
          return `${userRecord.name}'s income: $${userRecord.income}`;
        case 'debt':
          return `${userRecord.name}'s debt: $${userRecord.debt}`;
        case 'investment':
          return `${userRecord.name}'s investments: ${JSON.stringify(userRecord.investments)}`;
        case 'insurance':
          return `${userRecord.name}'s insurance policies: ${JSON.stringify(userRecord.insurances)}`;
        case 'creditScore':
          return `${userRecord.name}'s credit score: ${userRecord.creditScore}`;
        case 'tax':
          return `${userRecord.name}'s tax details: ${JSON.stringify(userRecord.taxes)}`;
        case 'retirementFund':
          return `${userRecord.name}'s retirement fund: $${userRecord.retirementFund}`;
        case 'mortgage':
          return `${userRecord.name}'s mortgage details: ${JSON.stringify(userRecord.mortgage)}`;
        case 'rent':
          return `${userRecord.name}'s rent details: ${JSON.stringify(userRecord.rent)}`;
        case 'utilityBills':
          return `${userRecord.name}'s utility bills: ${JSON.stringify(userRecord.utilityBills)}`;
        case 'carLoan':
          return `${userRecord.name}'s car loan details: ${JSON.stringify(userRecord.carLoan)}`;
        case 'studentLoan':
          return `${userRecord.name}'s student loan details: ${JSON.stringify(userRecord.studentLoan)}`;
        case 'howFucked':
          return `${userRecord.name}'s status: ${userRecord.HowFuckedAmI}`;
        case 'canIAffordRent':
          return `${userRecord.name}'s rent status: ${userRecord.CanIAffordRent}`;
        case 'canIAffordToLive':
          return `${userRecord.name}'s living status: ${userRecord.CanIAffordToLive}`;
        case 'canIAffordFood':
          return `${userRecord.name}'s food status: ${userRecord.CanIAffordFood}`;
      }
    }
  }

  return 'I\'m sorry, I\'m not sure how to answer that.';
}

module.exports = {
  loadFinancialData,
  getFinancialData,
  generateResponse
};
