import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./GroupChatBox.css";

function GroupChatBox({ group, onClose, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (group) {
      fetchMessages();
      // Poll for new messages every 2 seconds
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [group]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/groups/${group._id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data);
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
        `http://localhost:5001/api/groups/${group._id}/messages`,
        {
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
    <div className="group-chat-box">
      <div className="group-chat-header">
        <div className="group-chat-header-info">
          <div className="group-chat-icon">👥</div>
          <div className="group-chat-details">
            <div className="group-chat-name">{group.name}</div>
            <div 
              className="group-chat-members-count"
              onClick={() => setShowMembers(!showMembers)}
              title="View members"
            >
              {group.members.length} member{group.members.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        <button className="group-chat-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {showMembers && (
        <div className="group-members-list">
          {group.members.map((member) => (
            <div key={member._id} className="group-member-item">
              <div className="group-member-avatar">
                {member.profilePhoto ? (
                  <img
                    src={member.profilePhoto}
                    alt={member.name}
                    className="group-member-avatar-img"
                  />
                ) : (
                  getInitials(member.name)
                )}
              </div>
              <div className="group-member-info">
                <div className="group-member-name">{member.name}</div>
                {member.position && (
                  <div className="group-member-position">{member.position}</div>
                )}
              </div>
              {member._id === group.creator && (
                <span className="group-creator-badge">Creator</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="group-chat-messages">
        {loading ? (
          <div className="group-chat-loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="group-chat-empty">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.sender._id === currentUser?._id;
            return (
              <div
                key={index}
                className={`group-chat-message ${isOwn ? "own" : "other"}`}
              >
                {!isOwn && (
                  <div className="group-message-avatar">
                    {message.sender.profilePhoto ? (
                      <img
                        src={message.sender.profilePhoto}
                        alt={message.sender.name}
                        className="group-message-avatar-img"
                      />
                    ) : (
                      getInitials(message.sender.name)
                    )}
                  </div>
                )}
                <div className="group-message-content">
                  {!isOwn && (
                    <div className="group-message-sender">
                      {message.sender.name}
                    </div>
                  )}
                  <div className="group-message-bubble">
                    {message.content}
                  </div>
                  <div className="group-message-time">
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="group-chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="group-chat-input"
        />
        <button
          type="submit"
          className="group-chat-send-btn"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default GroupChatBox;
