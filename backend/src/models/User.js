import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "visitor"
    },
    tag: {
        type: String,
        enum: ['HR', 'Developer', 'Design', null],
        default: null
    },
    position: {
        type: String,
        default: null
    },
    profilePhoto: {
        type: String,
        default: null
    },
    coverPhoto: {
        type: String,
        default: null
    },
    about: {
        type: String,
        default: ""
    }
}, { timestamps: true })

const UserModel = mongoose.model("users", UserSchema)

export default UserModel