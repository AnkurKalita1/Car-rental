const asyncHandler = require("../utils/asyncHandler");
const paymentService = require("../services/paymentService");

const createOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.validated.body;
  const order = await paymentService.createPaymentOrder(req.user.id, bookingId);
  res.status(201).json(order);
});

const verifyPayment = asyncHandler(async (req, res) => {
  const booking = await paymentService.verifyPayment(req.user.id, req.validated.body);
  res.json(booking);
});

const failPayment = asyncHandler(async (req, res) => {
  const { bookingId } = req.validated.body;
  const booking = await paymentService.failPayment(req.user.id, bookingId);
  res.json(booking);
});

module.exports = {
  createOrder,
  verifyPayment,
  failPayment
};
