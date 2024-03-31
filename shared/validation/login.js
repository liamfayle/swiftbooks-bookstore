const yup = require("yup");

const schema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
});

module.exports = { schema };
