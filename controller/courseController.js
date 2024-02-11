// Importing necessary modules and dependencies
const { courses } = require("../model/courseModel");
const { applyCourse } = require("../model/applyCourse");
const cloudinary = require("cloudinary").v2;
const { users } = require("../model/userModel");

// Configuring Cloudinary with API credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 600000,
});

// Importing validation function for course uploads
const { courseUploadValidate } = require("../validations/course");

// Controller function for uploading a new course
const uploadCourse = async (req, res) => {
  try {
    // Validate the request body using the defined validation schema
    const { error } = courseUploadValidate.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).send({
        status: 400,
        message: error.details[0].message,
      });
    }

    // Check if the user uploading the course is a Teacher
    const checkUser = await users.findOne({ _id: req.user._id }).select({ role: 1 });
    if (checkUser.role !== "Teacher") {
      return res.status(400).send({
        success: false,
        message: "Only Teacher can Upload a course",
      });
    }

    // Check if required files are provided in the request
    if (!req.files["courseThumbnail"]) {
      return res.status(400).send({
        success: false,
        message: "Please Upload Course Thumbnail",
      });
    }
    if (!req.files["material_1"]) {
      return res.status(400).send({
        success: false,
        message: "Please Upload Atleast One Video",
      });
    }

    // Upload course thumbnail and video material to Cloudinary
    const courseThumbnail = await cloudinary.uploader.upload(
      `data:image/png;base64,${req.files["courseThumbnail"][0].buffer.toString("base64")}`
    );
    const material1Response = await cloudinary.uploader.upload(
      `data:video/mp4;base64,${req.files["material_1"][0].buffer.toString("base64")}`,
      { resource_type: "video" }
    );

    // Create and save new course with the uploaded information
    const insertCourse = new courses({
      userId: req.user._id,
      courseTitle: req.body.courseTitle,
      courseDescription: req.body.courseDescription,
      material_1: `${material1Response.url}`,
      price: req.body.price,
      courseThumbnail: `${courseThumbnail.url}`,
    });
    await insertCourse.save();

    return res.status(200).send({
      success: true,
      message: "Course Uploaded Successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Controller function for fetching all courses
const fetchAllCourses = async (req, res) => {
  try {
    // Retrieve all courses from the database
    const getAllCourses = await courses.find();

    return res.status(200).send({
      success: true,
      message: "Fetch All Courses Successfully",
      data: getAllCourses,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Controller function for fetching Teacher Key Performance Indicators (KPI)
const fetchTeacherKPI = async (req, res) => {
  try {
    // Retrieve courses and students associated with the teacher
    const getTeacherCourse = await courses.find({ userId: req.user._id }).select({ _id: 1 });
    const getTeacherStudents = await applyCourse.find({ teacherId: req.user._id }).select({ _id: 1 });

    return res.status(200).send({
      success: true,
      message: "Fetch Teacher KPI Successfully",
      data: {
        totalCourse: getTeacherCourse.length,
        totalStudents: getTeacherStudents.length,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Controller function for fetching courses associated with a student
const fetchCourseByStudent = async (req, res) => {
  try {
    // Retrieve courses applied by the student and populate course details
    const fetchCourses = await applyCourse
      .find({ studentId: req.user._id })
      .select({
        teacherId: 0,
        studentId: 0,
        price: 0,
        createdAt: 0,
        updatedAt: 0,
        _id: 0,
      })
      .populate("courseId");

    // Extract course details from populated data
    let finalResponse = [];
    for (var i = 0; i < fetchCourses.length; i++) {
      console.log(fetchCourses[i].courseId);
      finalResponse.push(fetchCourses[i].courseId);
    }

    return res.status(200).send({
      success: true,
      message: "Fetch All Courses Successfully",
      data: finalResponse,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Exporting the controller functions for use in routes
module.exports = {
  uploadCourse,
  fetchAllCourses,
  fetchTeacherKPI,
  fetchCourseByStudent,
};
