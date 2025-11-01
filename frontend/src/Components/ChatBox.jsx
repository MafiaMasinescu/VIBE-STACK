import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatBox.css";

function ChatBox({ selectedUser, onClose, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      // Poll for new messages every 2 seconds
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/messages/conversation/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data);
      
      // Mark messages as read
      await axios.put(
        `http://localhost:5001/api/messages/read/${selectedUser._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5001/api/messages/send",
        {
          receiverId: selectedUser._id,
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <div className="chat-header-user">
          <div className="chat-user-avatar">
            {selectedUser.profilePhoto ? (
              <img
                src={selectedUser.profilePhoto}
                alt={selectedUser.name}
                className="chat-avatar-img"
              />
            ) : (
              getInitials(selectedUser.name)
            )}
          </div>
          <div className="chat-user-info">
            <div className="chat-user-name">{selectedUser.name}</div>
            {selectedUser.position && (
              <div className="chat-user-position">{selectedUser.position}</div>
            )}
          </div>
        </div>
        <button className="chat-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="chat-messages">
        {loading ? (
          <div className="chat-loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.sender._id === currentUser?._id;
            return (
              <div
                key={index}
                className={`chat-message ${isOwn ? "own" : "other"}`}
              >
                {!isOwn && (
                  <div className="chat-message-avatar">
                    {message.sender.profilePhoto ? (
                      <img
                        src={message.sender.profilePhoto}
                        alt={message.sender.name}
                        className="message-avatar-img"
                      />
                    ) : (
                      getInitials(message.sender.name)
                    )}
                  </div>
                )}
                <div className="chat-message-content">
                  <div className="chat-message-bubble">
                    {message.content}
                  </div>
                  <div className="chat-message-time">
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="chat-input"
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
