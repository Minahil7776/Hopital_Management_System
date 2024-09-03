import errorHandler from "../middlewares/errorMidleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import { generateToken } from '../utils/jwtToken.js';
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, email, phone, nic, dob, gender, password, role } = req.body;
    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !role) {
        return next(new errorHandler("Please Fill All the Required Fields!", 400))
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new errorHandler("User Already Registered!", 400));
    }

    user = await User.create({
        firstName, lastName, email, phone, nic, dob, gender, password, role
    });
    generateToken(user, "User Registered!", 200, res);
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword || !role) {
        return next(new errorHandler("Please Fill All the Required Fields!", 400));
    }
    if (password != confirmPassword) {
        return next(new errorHandler("Password and Confirm does not Match!", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new errorHandler("Invalid Email or Password!", 400));
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new errorHandler("Invalid Email or Password!", 400));
    }
    if (role !== user.role) {
        return next(new errorHandler("User With This Role Not Round!", 400))
    }
    generateToken(user, `${user.role} Logged in Successfully!`, 200, res);
});

export const addNewAdmin = catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, email, phone, nic, dob, gender, password, role } = req.body;
    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !role) {
        return next(new errorHandler("Please Fill All the Required Fields!", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new errorHandler(`${isRegistered.role} with this Email Already Exist!`, 400));
    }
    const admin = await User.create({ firstName, lastName, email, phone, nic, dob, gender, password, role: "Admin" });
    res.status(200).json({
        success: true,
        message: "Admin Registered Successfully"
    })
});

export const getDoctors = catchAsyncError(async(req,res,next)=>{
    const doctors = await User.find({role:"Doctor"});
    res.status(200).json({
        success: true,
        doctors,
    });
});


export const getUserDetails = catchAsyncError(async(req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const logoutAdmin =catchAsyncError(async (req,res,next)=>{
    res.status(200).cookie("adminToken",'',{
        httpOnly:true,
        expires: new Date(Date.now()),
    }).json({
        success:true,
        message:"Admin Logout Successfully!"
    });
});

export const logoutPatient =catchAsyncError(async (req,res,next)=>{
    res.status(200).cookie("patientToken",'',{
        httpOnly:true,
        expires: new Date(Date.now()),
    }).json({
        success:true,
        message:"Patient Logout Successfully!"
    });
});

export const addNewDoctor = catchAsyncError(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new errorHandler("Doctor Avator Required!",400));
    }
    const {docAvator} = req.files;
    const allowdFormats = ["/image/png","/image/jpeg","/image/webp"];
    if(!allowdFormats.includes(docAvator.mimetype)){
        return next(new errorHandler("Fil Format Not Supported!",400))
    }
    const {firstName, lastName, email, phone, nic, dob, gender, password, role, doctorDepartment} = req.body;
    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !role || !doctorDepartment) {
        return next(new errorHandler("Please Fill All the Required Fields!", 400));
    }
    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new errorHandler(`${isRegistered.role} already registered!`,400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(docAvator.tempFilePath);
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error(
            "Cloudinary Error:",cloudinaryResponse.error || "Unknown Cloudinary Error!"
        );
    }
    const doctor =  await User.create({firstName, lastName, email, phone, nic, dob, gender, password, doctorDepartment,
        role:"Doctor", 
        docAvator:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_id
        },
    });
    res.status(200).json({
        success:true,
        message:"New Doctor Registered!"
    })
})
