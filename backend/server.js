const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { loadFinancialData, getFinancialData, generateResponse } = require('./financialLogic.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build'))); 

// Middleware to parse JSON bodies
app.use(express.json());

// Load financial data
loadFinancialData().then(() => {
  console.log('Financial data loaded');
}).catch(err => {
  console.error('Failed to load financial data:', err);
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  

  // Prompt the user for their name
  socket.emit('message', 'To assist you better, please provide your name and ID in the format: "My name is [name] and my ID is [ID]".');

  let userInfo = {};

  // Handle incoming messages
  socket.on('message', (message) => {
    console.log('Message received:', message);
    // Process the message
    if (!userInfo.name || !userInfo.id) {
      const nameMatch = message.match(/My name is (\w+)/i);
      const idMatch = message.match(/My ID is (\d+)/i);

      if (nameMatch && idMatch) {
        const name = nameMatch[1];
        const id = parseInt(idMatch[1]);
        const financialData = getFinancialData();
        const userRecord = financialData.users.find(u => u.name.toUpperCase() === name.toUpperCase() && u.id === id);
        if (userRecord) {
          userInfo.name = name;
          userInfo.id = id;
          socket.emit('message', `Hello, ${userInfo.name}! How can I assist you today? 
            \n You can ask: \n How much money did I saved? 
            \n What are my investment in stocks?
            \n How much money did I spend?`);
        } else {
          socket.emit('message', 'Sorry, I couldn\'t understand. The provided ID & Name is wrong.');
        }
      } else {
        socket.emit('message', 'Sorry, I couldn\'t understand. Please provide your name and ID again.');
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
