const yup = require("yup");

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

module.exports = { schema };
