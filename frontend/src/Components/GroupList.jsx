import { useState, useEffect } from "react";
import axios from "axios";
import "./GroupList.css";
import GroupChatBox from "./GroupChatBox";

function GroupList({ currentUser }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGroups();
    fetchAllUsers();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5001/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(response.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/auth/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Filter out current user
      setAllUsers(response.data.filter(user => user._id !== currentUser?._id));
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5001/api/groups/create",
        {
          name: newGroupName,
          description: newGroupDescription,
          memberIds: selectedMembers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroups([response.data, ...groups]);
      setNewGroupName("");
      setNewGroupDescription("");
      setSelectedMembers([]);
      setShowCreateModal(false);
      setSearchQuery("");
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  const handleCloseGroupChat = () => {
    setSelectedGroup(null);
    fetchGroups(); // Refresh groups
  };

  const toggleMemberSelection = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "G";
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="group-list-sidebar">
        <div className="group-list-loading">Loading groups...</div>
      </div>
    );
  }

  return (
    <div className="group-list-sidebar">
      <div className={`group-list-section ${selectedGroup ? 'with-chat' : ''}`}>
        <div className="group-list-header">
          <h2>👥 Groups</h2>
          <button
            className="btn-create-group"
            onClick={() => setShowCreateModal(true)}
            title="Create new group"
          >
            +
          </button>
        </div>

        <div className="group-list-container">
          {groups.length === 0 ? (
            <div className="no-groups-found">
              <p>No groups yet</p>
              <p className="create-hint">Click + to create one!</p>
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group._id}
                className="group-list-item"
                onClick={() => handleGroupClick(group)}
              >
                <div className="group-list-avatar">
                  <span className="group-icon">👥</span>
                </div>
                <div className="group-list-info">
                  <div className="group-list-name">{group.name}</div>
                  <div className="group-list-members">
                    {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Group Chat Box */}
      {selectedGroup && (
        <GroupChatBox
          group={selectedGroup}
          onClose={handleCloseGroupChat}
          currentUser={currentUser}
        />
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="group-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="group-modal" onClick={(e) => e.stopPropagation()}>
            <div className="group-modal-header">
              <h3>Create New Group</h3>
              <button
                className="group-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="group-modal-form">
              <div className="form-group">
                <label>Group Name *</label>
                <input
                  type="text"
                  placeholder="Enter group name..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="group-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  placeholder="Enter group description..."
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="group-textarea"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Add Members</label>
                <input
                  type="text"
                  placeholder="🔍 Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="group-search-input"
                />
                <div className="members-selection-list">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className={`member-selection-item ${
                        selectedMembers.includes(user._id) ? "selected" : ""
                      }`}
                      onClick={() => toggleMemberSelection(user._id)}
                    >
                      <div className="member-selection-avatar">
                        {user.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt={user.name}
                            className="member-avatar-img"
                          />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <div className="member-selection-info">
                        <div className="member-selection-name">{user.name}</div>
                        {user.position && (
                          <div className="member-selection-position">
                            {user.position}
                          </div>
                        )}
                      </div>
                      <div className="member-selection-checkbox">
                        {selectedMembers.includes(user._id) && "✓"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="group-modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-create"
                  disabled={!newGroupName.trim()}
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupList;
