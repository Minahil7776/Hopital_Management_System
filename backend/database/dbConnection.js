import mongoose from "mongoose";

export const dbconnection = ()=>{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("Database connection successful!");
    }).catch((error)=>{
        console.log(`onnection faild with database ${error}`);
    })
}
