import { Message } from "../models/messageSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import {errorMidleware} from "../middlewares/errorMidleware.js";

export const sendMessage =catchAsyncError(async (req,res,next)=>{
    

    const {firstName,lastName,email,phone,message} = req.body;
    // console.log('Request body:', req.body);
    if(!firstName || !lastName || !email || !phone || !message){
        return next(new errorMidleware("Please Fill All the Fields!",400));
    }
    await Message.create({firstName,lastName,email,phone,message});
    res.status(200).json({
        success:true,
        message:"Message sent successfully!"
    });
});

export const getAllMessage = catchAsyncError(async(req,res,next)=>{
    const message = await Message.find();
    res.status(200).json({
        success:true,
        message,
    })
})