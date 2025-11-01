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
  const { userId } = useParams();
  const navigate = useNavigate();

  // Get token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
  }, [userId, token, navigate]);

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
      </div>

      {/* Cover Photo */}
      <div className="cover-photo-container">
        {user.coverPhoto ? (
          <img src={user.coverPhoto} alt="Cover" className="cover-photo" />
        ) : (
          <div className="cover-photo-placeholder"></div>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="profile-info-section">
        <div className="profile-photo-container">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
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
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-friends">{posts.length} posts</p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="profile-tabs">
        <div className="tab active">Posts</div>
        <div className="tab">About</div>
        <div className="tab">Friends</div>
        <div className="tab">Photos</div>
      </div>

      {/* Posts Section */}
      <div className="profile-content">
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
                    {getInitials(post.author?.name)}
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
                            {getInitials(comment.author?.name)}
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
                    <div className="comment-avatar">{getInitials("You")}</div>
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
      </div>
    </div>
  );
}

export default Profile;
