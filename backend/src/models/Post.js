import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        enum: ['HR', 'Developer', 'Design', null],
        default: null
    },
    image: {
        type: String,
        default: null
    },
    video: {
        type: String,
        default: null
    },
    mediaType: {
        type: String,
        enum: ['none', 'image', 'video'],
        default: 'none'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    comments: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        content: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, 
{ timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;
