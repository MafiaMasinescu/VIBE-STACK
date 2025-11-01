import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserList.css";
import ChatBox from "./ChatBox";

function UserList({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, tagFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5001/auth/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by tag
    if (tagFilter && tagFilter !== "All") {
      filtered = filtered.filter((user) => user.tag === tagFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleChatClick = (e, user) => {
    e.stopPropagation(); // Prevent navigation to profile
    setSelectedUser(user);
  };

  const handleCloseChat = () => {
    setSelectedUser(null);
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  const getRoleDisplay = (role) => {
    if (!role) return "Visitor";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (loading) {
    return (
      <div className="user-list-sidebar">
        <div className="user-list-loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="user-list-sidebar">
      <div className={`user-list-section ${selectedUser ? 'with-chat' : ''}`}>
      <div className="user-list-header">
        <h2>👥 Users</h2>
      </div>

      {/* Search Bar */}
      <div className="user-search-bar">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="user-search-input"
        />
      </div>

      {/* Tag Filter */}
      <div className="user-filter-dropdown">
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="user-filter-select"
        >
          <option value="All">All Tags</option>
          <option value="HR">HR</option>
          <option value="Developer">Developer</option>
          <option value="Design">Design</option>
        </select>
      </div>

      {/* User List */}
      <div className="user-list-container">
        {filteredUsers.length === 0 ? (
          <div className="no-users-found">
            <p>No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="user-list-item"
            >
              <div 
                className="user-list-item-content"
                onClick={() => handleUserClick(user._id)}
              >
              <div className="user-list-avatar">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="user-avatar-img"
                  />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="user-list-info">
                <div className="user-list-name">{user.name}</div>
                <div className="user-list-details">
                  {user.tag && (
                    <span className="user-list-tag">{user.tag}</span>
                  )}
                  {user.position && (
                    <span className="user-list-role">{user.position}</span>
                  )}
                </div>
              </div>
              </div>
              <button
                className="user-chat-btn"
                onClick={(e) => handleChatClick(e, user)}
                title="Chat with this user"
              >
                💬
              </button>
            </div>
          ))
        )}
      </div>
      </div>

      {/* Chat Box */}
      {selectedUser && (
        <ChatBox
          selectedUser={selectedUser}
          onClose={handleCloseChat}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default UserList;
