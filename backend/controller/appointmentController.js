import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import errorHandler from "../middlewares/errorMidleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import {User} from "../models/userSchema.js";

export const postAppointment = catchAsyncError(async(req,res,next)=>{
    const {firstName, lastName, email, phone, nic, dob, gender,appointment_Date,department,doctor_firstName,doctor_lastName,hasVisited,address} = req.body;
    if(!firstName  || !lastName  || !email  || !phone  || !nic  || !dob  || !gender || !appointment_Date || !department || !doctor_firstName || !doctor_lastName || !hasVisited || !address){
        return next(new errorHandler("Please Fill All the Required Fields",400));
    }
    const isconflict = await User.find({
        firstName:doctor_firstName,
        lastName:doctor_lastName,
        role:"Doctor",
        doctorDepartment:department
    });
    if(isconflict.length===0){
        return next(new errorHandler("Doctor Not Found!",404))
    }
    if(isconflict.length >1){
        return next(new errorHandler("Doctors Conflict! Please Contact Thorough Email or Phone!",404))
    }
    const doctorId = isconflict[0]._id;
    const patientId = req.user._id;
    const appointment = await Appointment.create({
        firstName, lastName, email, phone, nic, dob, gender,appointment_Date,department,
        doctor:{
            firstName:doctor_firstName,
            lastName:doctor_lastName
        },hasVisited,
        address,
        doctorId,
        patientId
    });
    res.status(200).json({
        success:true,
        message:"Appointment Request Sent Successfully!"
    });
});

export const getAppointment = catchAsyncError(async(req,res,next)=>{
    const appointment = await Appointment.find();
    res.status(200).json({
        success:true,
        appointment,
    });
});

export const updateAppointmentStatus = catchAsyncError(async(req,res,next)=>{
   const {id} = req.params;
   let appointment = await Appointment.findById(id);
   if(!appointment){
    return next(new errorHandler("Appointment Not Found",404));
   }
   appointment = await Appointment.findByIdAndUpdate(id,req.body,{
    new:true,
    runValidators:true,
    useFindAndModify:false
   });
   res.status(200).json({
    success:true,
    message:"Appointment Status Updated!",
    appointment,
});
});

export const deleteAppointment = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
    let appointment = await Appointment.findById(id);
    if(!appointment){
        return next(new errorHandler("Appointment Not Found",404));
    }
    await appointment.deleteOne();
    res.status(200).json({
        success:true,
        message:"Appointment Deleted!"
    });
})