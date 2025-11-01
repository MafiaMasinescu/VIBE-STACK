import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    description: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const GroupModel = mongoose.model("groups", GroupSchema);

export default GroupModel;
