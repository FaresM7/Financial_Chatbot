const fs = require('fs');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const { loadFinancialData, loadKeywords, getFinancialData, Response } = require('./financialLogic.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const privateKey = fs.readFileSync('./key.pem', 'utf8');
const certificate = fs.readFileSync('./cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

let lastResponses = [];
let sameResponseCount = 0;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build'))); 

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Load financial data and keywords
Promise.all([loadFinancialData(), loadKeywords()]).then(() => {
  console.log('Financial data and keywords loaded');
}).catch(err => {
  console.error('Failed to load financial data and keywords:', err);
});


// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  function resetConversation() {
    console.log('Resetting user state');
    userInfo = {};
    userContext = {};
    lastResponses = [];
    sameResponseCount = 0;
    socket.emit('message', 'Conversation reset. What is your name?');
  }

  // Send a welcome message to the user
  socket.emit('message', 'Welcome to the Financial Co-pilot Chatbot!');

  let userInfo = {};
  let userContext = {};

  // Ask for the user's name
  socket.emit('message', 'What is your name?');

  // Handle incoming messages
  socket.on('message', (message) => {
    console.log('Message received:', message);
    // Process the message
    if (!userInfo.name) {
      userInfo.name = message.trim(); // Assume the first message is the name
      socket.emit('message', `Thank you, ${userInfo.name}! Now, please provide your ID.`);
    } else if (!userInfo.id) {
      userInfo.id = parseInt(message.trim()); // Assume the second message is the ID
      const financialData = getFinancialData();
      const userRecord = financialData.users.find(u => u.name.toLowerCase() === userInfo.name.toLowerCase() && u.id === userInfo.id);
      if (userRecord) {
        socket.emit('message', `Hello, ${userInfo.name}! How can I assist you today? Would you like to ask about:\n- Spendings\n- Savings\n- Overview stocks\n- Income\n- Other`);
      } else {
        socket.emit('message', 'Sorry, the provided ID is incorrect for the name you provided.');
        userInfo = {}; // Reset userInfo
        socket.emit('message', 'Please provide your name again.');
      }
    } else {
      const response = Response(message, userInfo, userContext);
      // Check if the response is the same as the last one
      if (lastResponses.length > 0 && response === lastResponses[lastResponses.length - 1]) {
        sameResponseCount++;
        socket.emit('message', response);
        if (sameResponseCount >= 3) {
          console.log("Same response received 3 times in a row. Reloading the page.");
          socket.emit('message', "It seems you're stuck. I received this message 4 times. Let's start over.");
          resetConversation();
        }
      } else {
        // Reset the counter if the response is different
        sameResponseCount = 1;
        socket.emit('message', response);
      }
      // Add the current response to the array
      lastResponses.push(response);
      // Keep only the last 3 responses
      if (lastResponses.length > 4) {
        lastResponses.shift();
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Reset user info on disconnection
    userInfo = {};
    userContext = {};
  });
});


// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html')); 
});


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});