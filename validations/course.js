const Joi = require("joi");

const courseUploadValidate = Joi.object({
  courseTitle: Joi.string().required().messages({
    "any.required": "Please Enter Course Title",
    "string.empty": "Please Enter Course Title",
  }),
  courseDescription: Joi.string().required().messages({
    "any.required": "Please Enter Course Description",
    "string.empty": "Please Enter Course Description",
  }),
  price: Joi.number().required().messages({
    "any.required": "Please Enter Course Price",
    "string.empty": "Please Enter Course Price",
  }),
  material_1: Joi.array().allow(null).allow(""),
  courseThumbnail: Joi.array().allow(null).allow(""),
});

module.exports = {
  courseUploadValidate,
};