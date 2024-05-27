import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, ConversationHeader, Avatar, InfoButton } from '@chatscope/chat-ui-kit-react';
import './chat.css'; // Import the CSS file
import AIImage from './AI.jpg'; // Import the local image

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello! This is your chatbot assistant. How can I help you today?",
      sentTime: "just now",
      sender: "Chatbot",
      direction: "incoming"
    }
  ]);

  const handleSend = (innerHtml) => {
    const newMessage = {
      message: innerHtml,
      sentTime: "just now",
      sender: "You",
      direction: "outgoing"
    };

    setMessages([...messages, newMessage]);

    // Auto-reply after a short delay
    setTimeout(() => {
      const replyMessage = {
        message: "This is an automatic reply!",
        sentTime: "just now",
        sender: "Bot",
        direction: "incoming"
      };
      setMessages(prevMessages => [...prevMessages, replyMessage]);
    }, 1000);
  };

  return (
    <div className="chat-wrapper">
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <Avatar
              name="Chatbot"
              src={AIImage}
            />
            <ConversationHeader.Content
              info="Active Now!"
              userName="Your chat assistant :)"
            />
            <ConversationHeader.Actions>
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList>
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
