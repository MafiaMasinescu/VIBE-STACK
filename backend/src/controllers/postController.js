import Post from "../models/Post.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Get all posts (feed)
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email")
            .populate("comments.author", "name email")
            .sort({ createdAt: -1 }); // newest first
        
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getPosts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;
        
        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const newPost = new Post({
            author: req.userId,
            content,
            image: image || null
        });

        await newPost.save();
        
        // Populate author info before sending response
        await newPost.populate("author", "name email");
        
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error in createPost:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Like/Unlike a post
export const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const likeIndex = post.likes.indexOf(req.userId);
        
        if (likeIndex > -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Like
            post.likes.push(req.userId);
        }

        await post.save();
        
        // Populate author and comments author before sending response
        await post.populate("author", "name email");
        await post.populate("comments.author", "name email");
        
        res.status(200).json(post);
    } catch (error) {
        console.error("Error in toggleLike:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add a comment
export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ message: "Comment content is required" });
        }

        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({
            author: req.userId,
            content
        });

        await post.save();
        
        // Populate both author and comments author before sending response
        await post.populate("author", "name email");
        await post.populate("comments.author", "name email");
        
        res.status(201).json(post);
    } catch (error) {
        console.error("Error in addComment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the user is the author
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error in deletePost:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
