const { courses } = require("../model/courseModel");
const { applyCourse } = require("../model/applyCourse");
require("dotenv").config();
const PROCESS = process.env;
const stripe = require("stripe")(PROCESS.STRIPE_SECRET_KEY);

const buyCourse = async (req, res) => {
  try {
    const fetchCourse = await courses
      .findOne({ _id: req.body.courseId })
      .select({ _id: 1, price: 1, userId: 1 });
    if (!fetchCourse) {
      return res.status(400).send({
        success: false,
        message: "This Course Does Not Exist",
      });
    }
    if (
      req.body.cardNumber &&
      req.body.expMonth &&
      req.body.expYear &&
      req.body.cvc
    ) {
      const paymentMethodId = await stripe.paymentMethods.create({
        type: "card",
        card: {
          number: req.body.cardNumber,
          exp_month: req.body.expMonth,
          exp_year: req.body.expYear,
          cvc: req.body.cvc,
        },
      });

      await stripe.paymentIntents.create({
        amount: fetchCourse.price * 100,
        currency: "usd",
        payment_method: paymentMethodId.id,
      });
    }

    const courseApply = new applyCourse({
      teacherId: fetchCourse.userId,
      studentId: req.user._id,
      courseId: req.body.courseId,
      price: fetchCourse.price,
    });
    await courseApply.save();
    return res.status(200).send({
      success: true,
      message: "Student Apply on a Course Successfully",
      data: courseApply,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { buyCourse };