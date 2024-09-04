import mongoose from "mongoose";


const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        require:[true,"Please provide unique Username"],
        unique:[true,"Username Exit"]
    },
    password:{
        type:String,
        require:[true,"Please provide a password"],
        unique:false
    },
    email:{
        type:String,
        require:[true,"Please provide a unique email"],
        unique:[true,"Email Exit"]
    },
    firstName:{type:String},
    lastName:{type:String},
    mobile:{type:Number},
    address:{type:String},
    profile:{type:String}
});
export default mongoose.model("User",UserSchema);
