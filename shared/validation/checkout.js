const yup = require("yup");
const validCard = require("card-validator");

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("First name is required"),
  email: yup.string().required("Email name is required").email("Invalid email address"),
  phone: yup.string().required("Phone name is required"),
  address1: yup.string().required("Address is required"),
  address2: yup.string(),
  country: yup.string().required("Country is required"),
  province: yup.string().required("Province is required"),
  city: yup.string().required("City is required"),
  postalCode: yup.string().required("Postal code is required"),
  cardName: yup.string().required("Card name is required"),
  cardNumber: yup
    .string()
    .required("Card number is required")
    .test(
      "test-card-num",
      "Invalid credit card number",
      (value) => validCard.number(value).isValid,
    ),
  cardExpiry: yup
    .string()
    .required("Card expiry is required")
    .matches(/^\d{6}$/, "Card expiry must be in format DDMMYY"),
  cardCvc: yup
    .string()
    .required("CVC is required")
    .matches(/^\d{3}$/, "CVC must be 3 digits"),
});

module.exports = { schema };
