import mongoose from 'mongoose';

const GroupMessageSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

// Index for efficient querying
GroupMessageSchema.index({ group: 1, createdAt: -1 });

const GroupMessageModel = mongoose.model("groupmessages", GroupMessageSchema);

export default GroupMessageModel;
