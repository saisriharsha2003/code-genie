import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import Nav from "../components/Nav";
import MessageRenderer from "../components/MessageRender";
import "../assets/styles/ChatPage.css";
import { BASE_URL } from "../config";
import axios from "axios";

import userImage from "../assets/images/user.jpg"; 
import botImage from "../assets/images/bot.jpg"; 

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello, I'm CodeGenie, your AI Code Tutor! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/user/chat`, { message: input });

      console.log("Bot reply:", response.data.reply);

      const botReply = response.data?.reply || "Sorry, I didn't understand that.";

      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong.", sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container fullscreen">
      <Nav />
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`message-wrapper ${msg.sender}`}
          >
            <img
              src={msg.sender === "user" ? userImage : botImage}
              alt={`${msg.sender} avatar`}
              className="chat-avatar"
            />
            <div className={`message ${msg.sender}`}>
              <MessageRenderer message={msg.text || ""} />
            </div>
          </motion.div>
        ))}
        {isTyping && <motion.div className="typing-indicator">I'm Thinking...</motion.div>}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="send-button">
          <Send className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
