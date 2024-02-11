const express = require("express");
const authRouter = express.Router();
const multer = require("multer");
const upload = multer();
const verifyToken = require("../middleware/verifyToken");

const {
  userSignUp,
  userLogin,
  getUserProfile,
} = require("../controller/authController");

authRouter.post(
  "/api/userSignUp",
  upload.fields([{ name: "cvImage", maxCount: 1 }]),
  userSignUp
);

authRouter.post("/api/userLogin", userLogin);
authRouter.get("/api/getUserProfile", [verifyToken], getUserProfile);

module.exports = authRouter;