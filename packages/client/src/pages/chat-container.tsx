import React from "react";
import styles from "../components/chat.module.css";
// type ChatContainerProps = {

// }

const ChatContainer = () => {
  return (
    <div id="wrapper" className={styles.wrapper}>
      <div id="chat-container" className={styles.chatContainer}>
        <div id="search-container" className={styles.searchContainer}>
          This si the conversation search.
        </div>
        <div id="conversation-list" className={styles.conversationList}>
          This si teh conversation list
        </div>
        <div id="new-message-container" className={styles.newMessageContainer}>
          This is the new message section
        </div>
        {/* RIGHT SIDE */}

        <div id="chat-title" className={styles.chatTitle}>
          This is the title.
        </div>
        <div id="chat-message-list" className={styles.chatMessageList}>
          This is the chat message list
        </div>
        <div id="chat-form" className={styles.chatForm}>
          This is the new message input
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
