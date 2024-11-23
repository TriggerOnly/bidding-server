import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    nameOrganization: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true, 
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    }
})

export default mongoose.model("User", UserSchema)