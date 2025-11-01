import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
    // frontend sends { name, email, password }
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "name, email și password sunt obligatorii" });
        }

        // check by email uniqueness
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({ message: "Error registering user", error: err?.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "email și password sunt obligatorii" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        if (!process.env.JWT_SECRET) {
            console.warn("JWT_SECRET is missing from .env");
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev_secret", {
            expiresIn: "1h",
        });

        // Optionally set cookie if you want to use cookie auth on the frontend
        // res.cookie('token', token, { httpOnly: true });

        return res.json({ token });
    } catch (err) {
        console.error("Error logging in:", err);
        return res.status(500).json({ message: "Error logging in", error: err?.message });
    }
};

export const getUsers = async (_, res) => {
    try {
        const users = (await User.find().sort({ createdAt: -1 })); // newest first
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsers");
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Dynamically import Post model to avoid circular dependency
        const Post = (await import("../models/Post.js")).default;
        
        // Get user info
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Get user's posts
        const posts = await Post.find({ author: userId })
            .populate("author", "name email profilePhoto tag position")
            .populate("comments.author", "name email profilePhoto tag position")
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            user,
            posts
        });
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, about, tag, position } = req.body;
        
        // Verify the user is updating their own profile
        if (req.userId !== userId) {
            return res.status(403).json({ message: "You can only update your own profile" });
        }
        
        const updateData = {};
        if (name) updateData.name = name;
        if (about !== undefined) updateData.about = about;
        if (tag !== undefined) updateData.tag = tag || null;
        if (position !== undefined) updateData.position = position || null;
        
        // Handle profile photo upload (Cloudinary URL)
        if (req.files?.profilePhoto) {
            updateData.profilePhoto = req.files.profilePhoto[0].path; // Cloudinary URL
        }
        
        // Handle cover photo upload (Cloudinary URL)
        if (req.files?.coverPhoto) {
            updateData.coverPhoto = req.files.coverPhoto[0].path; // Cloudinary URL
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select("-password");
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error in updateUserProfile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getCurrentUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
