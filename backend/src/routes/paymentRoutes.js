const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const paymentController = require("../controllers/paymentController");
const {
  createOrderSchema,
  verifyPaymentSchema,
  failPaymentSchema
} = require("../validators/paymentValidators");

const router = express.Router();

router.post(
  "/create-order",
  auth,
  validate(createOrderSchema),
  paymentController.createOrder
);
router.post(
  "/verify",
  auth,
  validate(verifyPaymentSchema),
  paymentController.verifyPayment
);
router.post(
  "/fail",
  auth,
  validate(failPaymentSchema),
  paymentController.failPayment
);

module.exports = router;
