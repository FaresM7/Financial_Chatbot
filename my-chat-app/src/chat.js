import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, ConversationHeader, Avatar, StarButton, VideoCallButton, VoiceCallButton, InfoButton } from '@chatscope/chat-ui-kit-react';

const Chat = () => {
  return (
    <div style={{ position: "relative", height: "600px" }}>
      <MainContainer>
        <ChatContainer>
        <ConversationHeader>
  <ConversationHeader.Back />
  <Avatar
    name="Emily"
    src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
  />
  <ConversationHeader.Content
    info="Active 10 mins ago"
    userName="Emily"
  />
  <ConversationHeader.Actions>
    <StarButton title="Add to favourites" />
    <VoiceCallButton title="Start voice call" />
    <VideoCallButton title="Start video call" />
    <InfoButton title="Show info" />
  </ConversationHeader.Actions>
</ConversationHeader>
          <MessageList>
            <Message model={{
              message: "Hello my friend",
              sentTime: "just now",
              sender: "Joe"
            }} />
          </MessageList>
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chat;
