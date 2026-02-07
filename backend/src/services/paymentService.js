const crypto = require("crypto");
const Booking = require("../models/Booking");
const Car = require("../models/Car");
const ApiError = require("../utils/ApiError");
const availabilityService = require("./availabilityService");

const generateOrderId = () => `order_${crypto.randomUUID()}`;

const ensureBookingOwner = (booking, userId) => {
  if (booking.userId.toString() !== userId) {
    throw new ApiError(403, "Forbidden");
  }
};

const ensurePayableBooking = (booking) => {
  if (booking.bookingStatus === "cancelled") {
    throw new ApiError(400, "Cannot pay for a cancelled booking");
  }
  if (booking.bookingStatus !== "pending") {
    throw new ApiError(400, "Only pending bookings can be paid");
  }
  if (booking.paymentStatus === "paid") {
    throw new ApiError(400, "Booking is already paid");
  }
};

const createPaymentOrder = async (userId, bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  ensureBookingOwner(booking, userId);
  ensurePayableBooking(booking);

  if (!["unpaid", "failed"].includes(booking.paymentStatus)) {
    throw new ApiError(400, "Payment cannot be initiated for this booking");
  }

  return {
    orderId: generateOrderId(),
    amount: booking.totalPrice,
    currency: "USD"
  };
};

const verifyPayment = async (userId, payload) => {
  const { bookingId, paymentId, paymentMethod } = payload;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  ensureBookingOwner(booking, userId);
  ensurePayableBooking(booking);

  if (!["unpaid", "failed"].includes(booking.paymentStatus)) {
    throw new ApiError(400, "Payment is not allowed for this booking");
  }

  const car = await Car.findById(booking.carId);
  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  const available = await availabilityService.isRangeAvailable(
    booking.carId,
    booking.pickupDate,
    booking.returnDate,
    booking._id
  );
  if (!available) {
    throw new ApiError(400, "Car is not available for selected dates");
  }

  booking.paymentStatus = "paid";
  booking.bookingStatus = "confirmed";
  booking.paidAt = new Date();
  booking.paymentId = paymentId;
  booking.paymentMethod = paymentMethod;

  await booking.save();
  return booking;
};

const failPayment = async (userId, bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  ensureBookingOwner(booking, userId);

  if (booking.bookingStatus === "cancelled") {
    throw new ApiError(400, "Cannot pay for a cancelled booking");
  }
  if (booking.paymentStatus === "paid") {
    throw new ApiError(400, "Booking is already paid");
  }

  booking.paymentStatus = "failed";
  await booking.save();
  return booking;
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  failPayment
};
