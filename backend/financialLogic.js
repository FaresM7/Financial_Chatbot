const fs = require('fs').promises;

let financialData;
let keywords;

async function loadFinancialData() {
  try {
    const data = await fs.readFile('financial_data.json', 'utf-8');
    financialData = JSON.parse(data);
  } catch (err) {
    console.error('Error reading financial data file:', err);
  }
}

async function loadKeywords() {
  try {
    const data = await fs.readFile('keywords.json', 'utf-8');
    keywords = JSON.parse(data);
  } catch (err) {
    console.error('Error reading keywords file:', err);
  }
}

function getFinancialData() {
  return financialData;
}

function generateResponse(message, userInfo) {
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

  for (const [category, categoryKeywords] of Object.entries(keywords)) {
    if (categoryKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      switch (category) {
        case 'savings':
          return `${userRecord.name}'s savings: $${userRecord.savings}`;
        case 'spending':
          return `${userRecord.name}'s spending: $${userRecord.spending}`;
        case 'monthlyStatement':
          return `Here are ${userRecord.name}'s monthly statements: <a href="${userRecord.monthlyStatements[0]}" target="_blank">View PDF</a>`;
        case 'assetOverview':
          return `${userRecord.name}'s asset overview: ${userRecord.assetOverview.join(', ')}`;
        case 'income':
          return `${userRecord.name}'s income: $${JSON.stringify(userRecord.income)}`;
        case 'debt':
          return `${userRecord.name}'s debt: $${JSON.stringify(userRecord.debt)}`;
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
          return `${userRecord.name}'s status: ${JSON.stringify(userRecord.HowFuckedAmI)}`;
        case 'canIAffordRent':
          return `${userRecord.name}'s rent status: ${JSON.stringify(userRecord.CanIAffordRent)}`;
        case 'canIAffordToLive':
          return `${userRecord.name}'s living status: ${JSON.stringify(userRecord.CanIAffordToLive)}`;
        case 'canIAffordFood':
          return `${userRecord.name}'s food status: ${JSON.stringify(userRecord.CanIAffordFood)}`;
        default:
          return 'I\'m sorry, I\'m not sure how to answer that. Ask me again!';
      }
    }
  }

  return 'I\'m sorry, I\'m not sure how to answer that. Ask me again! \n You can ask about your Savings or your Spendings';
}

module.exports = {
  loadFinancialData,
  loadKeywords,
  getFinancialData,
  generateResponse
};
