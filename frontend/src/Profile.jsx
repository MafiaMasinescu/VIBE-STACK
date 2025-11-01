import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    about: "",
  });
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState(null);
  const [selectedCoverPhoto, setSelectedCoverPhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  // Get token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCurrentUser();
    fetchUserProfile();
  }, [userId, token, navigate]);

  useEffect(() => {
    if (profileData?.user) {
      setEditFormData({
        name: profileData.user.name || "",
        about: profileData.user.about || "",
      });
    }
  }, [profileData]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("http://localhost:5001/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(response.data);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5001/auth/profile/${userId}`
      );
      setProfileData(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:5001/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the post in the profile data
      setProfileData((prev) => ({
        ...prev,
        posts: prev.posts.map((post) =>
          post._id === postId ? response.data : post
        ),
      }));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (postId) => {
    const commentContent = commentInputs[postId];
    if (!commentContent?.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5001/api/posts/${postId}/comment`,
        { content: commentContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileData((prev) => ({
        ...prev,
        posts: prev.posts.map((post) =>
          post._id === postId ? response.data : post
        ),
      }));
      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const toggleCommentsExpansion = (postId) => {
    setExpandedComments({
      ...expandedComments,
      [postId]: !expandedComments[postId],
    });
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProfilePhoto(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCoverPhoto(file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      name: profileData.user.name || "",
      about: profileData.user.about || "",
    });
    setSelectedProfilePhoto(null);
    setSelectedCoverPhoto(null);
    setProfilePhotoPreview(null);
    setCoverPhotoPreview(null);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", editFormData.name);
      formData.append("about", editFormData.about);
      
      if (selectedProfilePhoto) {
        formData.append("profilePhoto", selectedProfilePhoto);
      }
      
      if (selectedCoverPhoto) {
        formData.append("coverPhoto", selectedCoverPhoto);
      }

      const response = await axios.put(
        `http://localhost:5001/auth/profile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update profile data with new info
      setProfileData((prev) => ({
        ...prev,
        user: response.data.user,
      }));

      // Reset edit state
      setIsEditing(false);
      setSelectedProfilePhoto(null);
      setSelectedCoverPhoto(null);
      setProfilePhotoPreview(null);
      setCoverPhotoPreview(null);
      
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  // Get current user ID from token
  const getCurrentUserId = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profileData) {
    return <div className="error">User not found</div>;
  }

  const { user, posts } = profileData;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <button className="btn-back" onClick={() => navigate("/feed")}>
          ← Back to Feed
        </button>
        {currentUserId === userId && !isEditing && (
          <button className="btn-edit-profile" onClick={handleEditClick}>
            ✏️ Edit Profile
          </button>
        )}
        {isEditing && (
          <div className="edit-actions">
            <button className="btn-save-profile" onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving..." : "💾 Save"}
            </button>
            <button className="btn-cancel-edit" onClick={handleCancelEdit} disabled={saving}>
              ❌ Cancel
            </button>
          </div>
        )}
      </div>

      {/* Cover Photo */}
      <div className="cover-photo-container">
        {isEditing && (
          <label className="photo-upload-label cover-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverPhotoChange}
              style={{ display: "none" }}
            />
            📷 Change Cover Photo
          </label>
        )}
        {coverPhotoPreview || user.coverPhoto ? (
          <img 
            src={coverPhotoPreview || `http://localhost:5001${user.coverPhoto}`} 
            alt="Cover" 
            className="cover-photo" 
          />
        ) : (
          <div className="cover-photo-placeholder"></div>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="profile-info-section">
        <div className="profile-photo-container">
          {isEditing && (
            <label className="photo-upload-label profile-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                style={{ display: "none" }}
              />
              📷
            </label>
          )}
          {profilePhotoPreview || user.profilePhoto ? (
            <img
              src={profilePhotoPreview || `http://localhost:5001${user.profilePhoto}`}
              alt={user.name}
              className="profile-photo"
            />
          ) : (
            <div className="profile-photo-placeholder">
              {getInitials(user.name)}
            </div>
          )}
        </div>
        <div className="profile-details">
          {isEditing ? (
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              className="profile-name-input"
              placeholder="Enter your name"
            />
          ) : (
            <h1 className="profile-name">{user.name}</h1>
          )}
          <p className="profile-friends">{posts.length} posts</p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="profile-tabs">
        <div 
          className={`tab ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </div>
        <div 
          className={`tab ${activeTab === "about" ? "active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          About
        </div>
        <div className="tab">Friends</div>
        <div className="tab">Photos</div>
      </div>

      {/* Content Section */}
      <div className="profile-content">
        {activeTab === "about" && (
          <div className="about-section">
            <div className="about-card">
              <h2 className="about-heading">About</h2>
              {isEditing ? (
                <textarea
                  value={editFormData.about}
                  onChange={(e) => setEditFormData({ ...editFormData, about: e.target.value })}
                  className="about-textarea"
                  placeholder="Tell people about yourself..."
                  rows="6"
                />
              ) : (
                <div className="about-content">
                  {user.about || "No information added yet."}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="profile-posts">
            <h2 className="posts-heading">Posts</h2>
            {posts.length === 0 ? (
              <div className="post-card" style={{ textAlign: "center" }}>
                <p style={{ color: "#65676b" }}>No posts yet.</p>
              </div>
            ) : (
              posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <div className="post-avatar">
                    {post.author?.profilePhoto ? (
                      <img 
                        src={`http://localhost:5001${post.author.profilePhoto}`} 
                        alt={post.author.name}
                        className="avatar-img"
                      />
                    ) : (
                      getInitials(post.author?.name)
                    )}
                  </div>
                  <div className="post-author-info">
                    <div className="post-author-name">
                      {post.author?.name || "Unknown User"}
                    </div>
                    <div className="post-date">
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="post-content">{post.content}</div>

                {post.image && (
                  <img
                    src={`http://localhost:5001${post.image}`}
                    alt="Post content"
                    className="post-image"
                  />
                )}

                {post.video && (
                  <video
                    src={`http://localhost:5001${post.video}`}
                    controls
                    className="post-video"
                  />
                )}

                <div className="post-stats">
                  <span>👍 {post.likes?.length || 0} likes</span>
                  <span>💬 {post.comments?.length || 0} comments</span>
                </div>

                <div className="post-actions">
                  <button
                    className={`post-action-btn ${
                      post.likes?.includes(currentUserId) ? "liked" : ""
                    }`}
                    onClick={() => handleLike(post._id)}
                  >
                    👍 Like
                  </button>
                  <button className="post-action-btn">💬 Comment</button>
                </div>

                {/* Comments Section */}
                <div className="comments-section">
                  {post.comments && post.comments.length > 0 && (
                    <>
                      {(expandedComments[post._id]
                        ? post.comments
                        : post.comments.slice(0, 3)
                      ).map((comment, index) => (
                        <div key={index} className="comment">
                          <div className="comment-avatar">
                            {comment.author?.profilePhoto ? (
                              <img 
                                src={`http://localhost:5001${comment.author.profilePhoto}`} 
                                alt={comment.author.name}
                                className="avatar-img"
                              />
                            ) : (
                              getInitials(comment.author?.name)
                            )}
                          </div>
                          <div className="comment-content">
                            <div className="comment-author">
                              {comment.author?.name || "Unknown User"}
                            </div>
                            <div className="comment-text">
                              {comment.content}
                            </div>
                          </div>
                        </div>
                      ))}

                      {post.comments.length > 3 && (
                        <button
                          className="btn-show-comments"
                          onClick={() => toggleCommentsExpansion(post._id)}
                        >
                          {expandedComments[post._id]
                            ? `▲ Show less`
                            : `▼ Show ${post.comments.length - 3} more comment${
                                post.comments.length - 3 === 1 ? "" : "s"
                              }`}
                        </button>
                      )}
                    </>
                  )}

                  {/* Add Comment */}
                  <div className="add-comment">
                    <div className="comment-avatar">
                      {currentUser?.profilePhoto ? (
                        <img 
                          src={`http://localhost:5001${currentUser.profilePhoto}`} 
                          alt="You"
                          className="avatar-img"
                        />
                      ) : (
                        getInitials(currentUser?.name || "You")
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) =>
                        setCommentInputs({
                          ...commentInputs,
                          [post._id]: e.target.value,
                        })
                      }
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleComment(post._id);
                        }
                      }}
                    />
                    {commentInputs[post._id] && (
                      <button
                        className="btn-comment"
                        onClick={() => handleComment(post._id)}
                      >
                        Post
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
