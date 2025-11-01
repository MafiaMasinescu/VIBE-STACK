import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "visitor"
    },
    profilePhoto: {
        type: String,
        default: null
    },
    coverPhoto: {
        type: String,
        default: null
    }
}, { timestamps: true })

const UserModel = mongoose.model("users", UserSchema)

export default UserModel