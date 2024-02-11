const { users } = require("../model/userModel");
const { courses } = require("../model/courseModel");

const getAllTeacher = async (req, res) => {
  try {
    const fetchTeacher = await users
      .find({
        role: "Teacher",
      })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Fetch All teachers Successfully",
      totalUser: fetchTeacher.length,
      data: fetchTeacher,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllStudent = async (req, res) => {
  try {
    const findAllStudent = await users
      .find({
        role: "Student",
      })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Fetch All Students Successfully",
      totalUser: findAllStudent.length,
      data: findAllStudent,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const verifyTeacher = async (req, res) => {
  try {
    const getTeacher = await users
      .findOne({ _id: req.query.teacherId })
      .select({ isVerified: 1, role: 1 });
    if (getTeacher.role !== "Teacher") {
      return res.status(400).send({
        success: false,
        message: "This User Is Not A Teacher",
      });
    }
    if (getTeacher.isVerified === true) {
      return res.status(400).send({
        success: false,
        message: "This Teacher is Aleady Verified",
      });
    }

    await users.findOneAndUpdate(
      {
        _id: req.query.teacherId,
      },
      { isVerified: true }
    );

    return res.status(200).send({
      success: true,
      message: "User Verified Successfuly",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllCourse = async (req, res) => {
  try {
    const findAllCourse = await courses.find().sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Fetch All Courses Successfully",
      totalUser: findAllCourse.length,
      data: findAllCourse,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const dashboardKPI = async (req, res) => {
  try {
    const fetchAllTeacher = await users
      .find({
        role: "Teacher",
      })
      .select({ _id: 1 });
    const fetchAllStudent = await users
      .find({
        role: "Student",
      })
      .select({ _id: 1 });
    const fetchAllCourses = await courses.find().select({ _id: 1 });

    return res.status(200).send({
      success: true,
      message: "Fetch Dashboard KPI Successfully",
      data: {
        totalTeacher: fetchAllTeacher.length,
        totalStudent: fetchAllStudent.length,
        totalCourse: fetchAllCourses.length,
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

module.exports = {
  getAllTeacher,
  verifyTeacher,
  getAllStudent,
  getAllCourse,
  dashboardKPI,
};