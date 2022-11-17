import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    }
})

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
