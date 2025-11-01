import Message from "../models/Message.js";
import User from "../models/User.js";

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.userId; // from auth middleware

        if (!receiverId || !content || !content.trim()) {
            return res.status(400).json({ message: "Receiver and content are required" });
        }

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content: content.trim()
        });

        await newMessage.save();

        // Populate sender info for response
        const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "name profilePhoto")
            .populate("receiver", "name profilePhoto");

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get conversation between two users
export const getConversation = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.userId; // from auth middleware

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Get all messages between the two users
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        })
            .populate("sender", "name profilePhoto")
            .populate("receiver", "name profilePhoto")
            .sort({ createdAt: 1 }); // oldest first

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.userId;

        await Message.updateMany(
            { sender: userId, receiver: currentUserId, read: false },
            { read: true }
        );

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all conversations for current user
export const getConversations = async (req, res) => {
    try {
        const currentUserId = req.userId;

        // Get unique users the current user has chatted with
        const messages = await Message.find({
            $or: [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        })
            .populate("sender", "name profilePhoto")
            .populate("receiver", "name profilePhoto")
            .sort({ createdAt: -1 });

        // Extract unique users
        const userMap = new Map();
        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === currentUserId 
                ? msg.receiver 
                : msg.sender;
            
            if (!userMap.has(otherUser._id.toString())) {
                userMap.set(otherUser._id.toString(), {
                    user: otherUser,
                    lastMessage: msg
                });
            }
        });

        const conversations = Array.from(userMap.values());
        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
