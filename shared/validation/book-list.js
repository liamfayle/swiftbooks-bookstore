const yup = require("yup");
const validCard = require("card-validator");

const schema = yup.object({
  name: yup.string().required("Book list name is required"),
  description: yup.string(),
  isPublic: yup.boolean().required("Public is required"),
});

module.exports = { schema };
