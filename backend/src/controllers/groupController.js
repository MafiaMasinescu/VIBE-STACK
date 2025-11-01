import Group from "../models/Group.js";
import GroupMessage from "../models/GroupMessage.js";
import User from "../models/User.js";

// Create a new group
export const createGroup = async (req, res) => {
    try {
        const { name, memberIds, description } = req.body;
        const creatorId = req.userId; // from auth middleware

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Group name is required" });
        }

        // Create group with creator as first member
        const members = [creatorId, ...(memberIds || [])];
        // Remove duplicates
        const uniqueMembers = [...new Set(members)];

        const newGroup = new Group({
            name: name.trim(),
            creator: creatorId,
            members: uniqueMembers,
            description: description || ""
        });

        await newGroup.save();

        // Populate members info
        const populatedGroup = await Group.findById(newGroup._id)
            .populate("creator", "name profilePhoto")
            .populate("members", "name profilePhoto tag position");

        res.status(201).json(populatedGroup);
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all groups for current user
export const getUserGroups = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const groups = await Group.find({
            members: currentUserId
        })
            .populate("creator", "name profilePhoto")
            .populate("members", "name profilePhoto tag position")
            .sort({ updatedAt: -1 });

        res.status(200).json(groups);
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get group details
export const getGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const currentUserId = req.userId;

        const group = await Group.findById(groupId)
            .populate("creator", "name profilePhoto")
            .populate("members", "name profilePhoto tag position");

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if user is a member
        if (!group.members.some(member => member._id.toString() === currentUserId)) {
            return res.status(403).json({ message: "Not a member of this group" });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error("Error fetching group:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add members to group
export const addMembers = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { memberIds } = req.body;
        const currentUserId = req.userId;

        if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({ message: "Member IDs are required" });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Only creator can add members
        if (group.creator.toString() !== currentUserId) {
            return res.status(403).json({ message: "Only group creator can add members" });
        }

        // Add new members (avoid duplicates)
        const currentMemberIds = group.members.map(id => id.toString());
        const newMemberIds = memberIds.filter(id => !currentMemberIds.includes(id));

        if (newMemberIds.length > 0) {
            group.members.push(...newMemberIds);
            await group.save();
        }

        const updatedGroup = await Group.findById(groupId)
            .populate("creator", "name profilePhoto")
            .populate("members", "name profilePhoto tag position");

        res.status(200).json(updatedGroup);
    } catch (error) {
        console.error("Error adding members:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove member from group
export const removeMember = async (req, res) => {
    try {
        const { groupId, memberId } = req.params;
        const currentUserId = req.userId;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Only creator can remove members
        if (group.creator.toString() !== currentUserId) {
            return res.status(403).json({ message: "Only group creator can remove members" });
        }

        // Cannot remove creator
        if (memberId === group.creator.toString()) {
            return res.status(400).json({ message: "Cannot remove group creator" });
        }

        group.members = group.members.filter(id => id.toString() !== memberId);
        await group.save();

        const updatedGroup = await Group.findById(groupId)
            .populate("creator", "name profilePhoto")
            .populate("members", "name profilePhoto tag position");

        res.status(200).json(updatedGroup);
    } catch (error) {
        console.error("Error removing member:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete group
export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const currentUserId = req.userId;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Only creator can delete group
        if (group.creator.toString() !== currentUserId) {
            return res.status(403).json({ message: "Only group creator can delete group" });
        }

        await Group.findByIdAndDelete(groupId);
        // Also delete all messages in the group
        await GroupMessage.deleteMany({ group: groupId });

        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Send message to group
export const sendGroupMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { content } = req.body;
        const senderId = req.userId;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: "Message content is required" });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if user is a member
        if (!group.members.some(member => member.toString() === senderId)) {
            return res.status(403).json({ message: "Not a member of this group" });
        }

        const newMessage = new GroupMessage({
            group: groupId,
            sender: senderId,
            content: content.trim()
        });

        await newMessage.save();

        const populatedMessage = await GroupMessage.findById(newMessage._id)
            .populate("sender", "name profilePhoto");

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error("Error sending group message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get group messages
export const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const currentUserId = req.userId;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if user is a member
        if (!group.members.some(member => member.toString() === currentUserId)) {
            return res.status(403).json({ message: "Not a member of this group" });
        }

        const messages = await GroupMessage.find({ group: groupId })
            .populate("sender", "name profilePhoto")
            .sort({ createdAt: 1 }); // oldest first

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching group messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
