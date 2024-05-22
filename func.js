const app = document.getElementById("app");
  
const ck = ChatUiKitReact;

const Messages = [
  React.createElement(ck.MessageSeparator, { key: "separator1", content: "Saturday, 30 November 2019" }),
  React.createElement(ck.Message, { key: "msg1", model: { message: "Hi", sender: "Akane", sentTime: "10:00" } })
];

const ChatContainer = React.createElement(ck.ChatContainer,{}, [
  React.createElement(ck.ConversationHeader, { key: "conversation-header"}, [
    React.createElement(ck.ConversationHeader.Back, { key: "back" }),
    React.createElement(ck.ConversationHeader.Content, { key: "content", userName: "Emily", info: "Active 10 mins ago" })
  ]),
  React.createElement(ck.MessageList, { key: "message-list" }, Messages),
  React.createElement(ck.MessageInput, { key:"message-input", placeholder: "Type message here"} )
]);

const Main = React.createElement("div", { style: { position: "relative", height:"500px" } }, ChatContainer );

ReactDOM.render(Main, app);