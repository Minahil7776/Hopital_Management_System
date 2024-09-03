import express from "express"
import { deleteAppointment, getAppointment, postAppointment, updateAppointmentStatus } from "../controller/appointmentController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post",isPatientAuthenticated,postAppointment);
router.get("/getall",isAdminAuthenticated,getAppointment);
router.put("/update/:id",isAdminAuthenticated,updateAppointmentStatus);
router.put("/delete/:id",isAdminAuthenticated,deleteAppointment);

export default router;