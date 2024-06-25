const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const { loadFinancialData, loadKeywords, getFinancialData, generateResponse } = require('./financialLogic.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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

  let userInfo = {};

  // Ask for the user's name
  socket.emit('message', 'What is your name?');

 // Function to ask for the user's name
 const askForName = () => {
  socket.emit('message', 'What is your name?');
};

// Initial prompt for the name
askForName();

// Handle incoming messages
socket.on('message', (message) => {
  console.log('Message received:', message);
  
  if (!userInfo.name) {
    const name = message.trim();
    const userRecord = financialData.users.find(u => u.name.toLowerCase() === name.toLowerCase());
    if (userRecord) {
      userInfo.name = name;
      socket.emit('message', `Thank you, ${userInfo.name}! Now, please provide your ID.`);
    } else {
      socket.emit('message', `Sorry, I couldn't find the name ${name} in our records. Please provide a valid name.`);
      askForName(); // Ask for name again
    }
  } else if (!userInfo.id) {
    userInfo.id = parseInt(message.trim());
    const userRecord = financialData.users.find(u => u.name.toLowerCase() === userInfo.name.toLowerCase() && u.id === userInfo.id);
    if (userRecord) {
      socket.emit('message', `Hello, ${userInfo.name}! How can I assist you today?`);
    } else {
      socket.emit('message', 'Sorry, the provided ID is incorrect for the name you provided.');
      userInfo = {}; // Reset userInfo
      askForName(); // Ask for name again
    }
  } else {
    // Once name and ID are provided, handle the user's queries
    const response = generateResponse(message, userInfo);
    socket.emit('message', response);
  }
});

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Reset user info on disconnection
    userInfo = {};
  });
});

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html')); // Adjusted path
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
