const express = require("express");
const adminRouter = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");

const {
  getAllTeacher,
  verifyTeacher,
  getAllStudent,
  getAllCourse,
  dashboardKPI,
} = require("../controller/adminController");

adminRouter.get("/api/getAllTeacher", [verifyAdmin], getAllTeacher);
adminRouter.get("/api/getAllStudent", [verifyAdmin], getAllStudent);
adminRouter.patch("/api/verifyTeacher", [verifyAdmin], verifyTeacher);
adminRouter.get("/api/getAllCourse", [verifyAdmin], getAllCourse);
adminRouter.get("/api/dashboardKPI", [verifyAdmin], dashboardKPI);

module.exports = adminRouter;