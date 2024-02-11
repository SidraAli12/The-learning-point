const express = require("express");
const applyCourseRouter = express.Router();
const verifyToken = require("../middleware/verifyToken");

const { buyCourse } = require("../controller/applyCourseController");

applyCourseRouter.post("/api/buyCourse", [verifyToken], buyCourse);

module.exports = applyCourseRouter;