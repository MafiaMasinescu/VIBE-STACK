import express from "express";
import upload from "../config/multer.js";
import { 
    getPosts, 
    createPost, 
    toggleLike, 
    addComment, 
    deletePost,
    verifyToken 
} from "../controllers/postController.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// GET /api/posts - Get all posts
router.get("/", getPosts);

// POST /api/posts - Create a new post (with optional file upload)
router.post("/", upload.single("media"), createPost);

// POST /api/posts/:postId/like - Toggle like on a post
router.post("/:postId/like", toggleLike);

// POST /api/posts/:postId/comment - Add a comment to a post
router.post("/:postId/comment", addComment);

// DELETE /api/posts/:postId - Delete a post
router.delete("/:postId", deletePost);

export default router;
