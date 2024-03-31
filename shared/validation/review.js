const yup = require("yup");

const schema = yup.object({
  content: yup.string().required("Review content is required"),
  rating: yup.number().min(1, "Rating is required").max(5, "Rating cannot be greater than five").required("Rating is required"),
});

module.exports = { schema };
