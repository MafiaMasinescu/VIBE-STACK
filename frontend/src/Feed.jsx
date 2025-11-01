import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const navigate = useNavigate();

  // Get token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPosts();
  }, [token, navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5001/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching posts:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to load posts");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const formData = new FormData();
      formData.append("content", newPostContent);
      
      if (selectedFile) {
        formData.append("media", selectedFile);
      }

      const response = await axios.post(
        "http://localhost:5001/api/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPosts([response.data, ...posts]);
      setNewPostContent("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setError("");
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      const validVideoTypes = ["video/mp4", "video/mov", "video/avi", "video/mkv", "video/webm"];
      
      if (![...validImageTypes, ...validVideoTypes].includes(file.type)) {
        setError("Please select a valid image or video file");
        return;
      }

      // Validate file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        setError("File size must be less than 100MB");
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
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
      setPosts(
        posts.map((post) => (post._id === postId ? response.data : post))
      );
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
      setPosts(
        posts.map((post) => (post._id === postId ? response.data : post))
      );
      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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

  // Get current user name from token
  const getCurrentUserName = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.name;
    } catch {
      return null;
    }
  };

  const currentUserName = getCurrentUserName();

  const goToMyProfile = () => {
    if (currentUserId) {
      navigate(`/profile/${currentUserId}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading feed...</div>;
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>🌟 Connect & Share</h1>
        <div className="header-actions">
          <button className="btn-profile" onClick={goToMyProfile}>
            <div className="profile-avatar-btn">
              {currentUserName ? getInitials(currentUserName) : "U"}
            </div>
            <span>Profile</span>
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Create Post */}
      <div className="create-post-card">
        <form className="create-post-form" onSubmit={handleCreatePost}>
          <textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          
          {/* Preview selected media */}
          {previewUrl && (
            <div className="media-preview">
              {selectedFile?.type.startsWith("image/") ? (
                <img src={previewUrl} alt="Preview" className="preview-image" />
              ) : (
                <video src={previewUrl} controls className="preview-video" />
              )}
              <button
                type="button"
                className="btn-remove-media"
                onClick={handleRemoveFile}
              >
                ✕ Remove
              </button>
            </div>
          )}
          
          <div className="create-post-actions">
            <label className="btn-add-media">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              📷 Photo/Video
            </label>
            <button
              type="submit"
              className="btn-post"
              disabled={!newPostContent.trim()}
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="feed-posts">
        {posts.length === 0 ? (
          <div className="post-card" style={{ textAlign: "center" }}>
            <p style={{ color: "#65676b" }}>
              No posts yet. Be the first to share something!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                {post.author?._id ? (
                  <Link to={`/profile/${post.author._id}`} className="post-avatar-link">
                    <div className="post-avatar">
                      {getInitials(post.author?.name)}
                    </div>
                  </Link>
                ) : (
                  <div className="post-avatar">
                    {getInitials(post.author?.name)}
                  </div>
                )}
                <div className="post-author-info">
                  {post.author?._id ? (
                    <Link to={`/profile/${post.author._id}`} className="post-author-name">
                      {post.author?.name || "Unknown User"}
                    </Link>
                  ) : (
                    <div className="post-author-name">
                      {post.author?.name || "Unknown User"}
                    </div>
                  )}
                  <div className="post-date">{formatDate(post.createdAt)}</div>
                </div>
                {currentUserId === post.author?._id && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    🗑️ Delete
                  </button>
                )}
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
                    {/* Show only first 3 comments if not expanded */}
                    {(expandedComments[post._id]
                      ? post.comments
                      : post.comments.slice(0, 3)
                      ).map((comment, index) => (
                        <div key={index} className="comment">
                          {comment.author?._id ? (
                            <Link to={`/profile/${comment.author._id}`} className="comment-avatar-link">
                              <div className="comment-avatar">
                                {getInitials(comment.author?.name)}
                              </div>
                            </Link>
                          ) : (
                            <div className="comment-avatar">
                              {getInitials(comment.author?.name)}
                            </div>
                          )}
                          <div className="comment-content">
                            {comment.author?._id ? (
                              <Link to={`/profile/${comment.author._id}`} className="comment-author">
                                {comment.author?.name || "Unknown User"}
                              </Link>
                            ) : (
                              <div className="comment-author">
                                {comment.author?.name || "Unknown User"}
                              </div>
                            )}
                            <div className="comment-text">{comment.content}</div>
                          </div>
                        </div>
                      ))}                    {/* Show More/Less Button */}
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
  );
}

export default Feed;
