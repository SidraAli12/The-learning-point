const mongoose = require("mongoose");

const applyCourseSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "course",
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const applyCourse = new mongoose.model("applyCourse", applyCourseSchema);

module.exports = { applyCourse };