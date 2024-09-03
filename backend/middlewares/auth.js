import { User } from "../models/userSchema.js"
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import errorHandler from "../middlewares/errorMidleware.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return next(new errorHandler("Admin is not Authenticated", 400));
    }
    let decode;
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        return next(new errorHandler("Invalid or expired token", 401));
    }

    req.user = await User.findById(decode.id);
    if (req.user.role !== "Admin") {
        return next(new errorHandler(`${req.user.role} not authenticated for this resource!`, 403))
    }
    next();
});

export const isPatientAuthenticated = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
        return next(new errorHandler("Patient is not Authenticated", 400));
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decode.id);
    if (req.user.role !== "Patient") {
        return next(new errorHandler(`${req.user.role} not authenticated for this resource!`, 403))
    }
    next();
});