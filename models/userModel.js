import mongoose from "mongoose";
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: "Not Selected"
    },
    mobile: {
        type: String,
        default: "0123456789"
    }
})

const userModel = mongoose.model('User', userSchema)

export default userModel