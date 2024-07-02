import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar
} from '@chatscope/chat-ui-kit-react';
import AIImage from '../images/AI.jpg'; // Import the local image
import '../chat.css'; // Import the CSS file

const socket = io(); // Initialize Socket.IO client

const Chat = () => {
  const [messages, setMessages] = useState([
  ]);

  useEffect(() => {
    // Handle incoming messages from the server
    socket.on('message', (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message,
          sentTime: "just now",
          sender: "Chatbot",
          direction: "incoming"
        }
      ]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleSend = (innerHtml) => {
    const newMessage = {
      message: innerHtml,
      sentTime: "just now",
      sender: "You",
      direction: "outgoing"
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Send message to the server
    socket.emit('message', innerHtml);
  };

  return (
    <div className="chat-wrapper">
      <MainContainer className="chat-container">
        <ChatContainer>
          <ConversationHeader>
            <Avatar name="Chatbot" src={AIImage} />
            <ConversationHeader.Content info="Active Now!" userName="Your chat assistant :)" />
          </ConversationHeader>
          <MessageList className="message-list">
            {messages.map((msg, index) => (
              <Message
                key={index}
                model={{
                  message: msg.message,
                  sentTime: msg.sentTime,
                  sender: msg.sender,
                  direction: msg.direction
                }}
              />
            ))}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleSend} attachButton={false} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chat;
