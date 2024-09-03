import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength: [3,"First name must contain at least 3 letters!"] 
    },
    lastName:{
        type:String,
        required:true,
        minLength: [3,"Last name must contain at least 3 letters!"] 
    },
    email:{
        type:String,
        required:true,
        validate: [validator.isEmail, "Please provide a valid email!"]
    },
    phone:{
        type:String,
        required:true,
        minLength:[11,"Phone number must contain exect 11 digits!"],
        maxLength:[11,"Phone number must contain exect 11 digits!"]
    },
    message:{
        type:String,
        required:true,
        minLength:[10,"Message must contain 10 letters!"]
    }
});

export const Message = mongoose.model("Message",messageSchema);