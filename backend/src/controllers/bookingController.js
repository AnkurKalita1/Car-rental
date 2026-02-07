const asyncHandler = require("../utils/asyncHandler");
const bookingService = require("../services/bookingService");

const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(
    req.user,
    req.validated.body
  );
  res.status(201).json(booking);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getMyBookings(req.user.id);
  res.json(bookings);
});

const getOwnerBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getOwnerBookings(req.user.id);
  res.json(bookings);
});

const getOwnerRevenue = asyncHandler(async (req, res) => {
  const year = req.validated.query.year
    ? Number(req.validated.query.year)
    : new Date().getUTCFullYear();
  const revenue = await bookingService.getOwnerRevenue(req.user.id, year);
  res.json({ year, ...revenue });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBookingStatus(
    req.user.id,
    req.params.id,
    req.validated.body.status
  );
  res.json(booking);
});

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getOwnerRevenue,
  updateBookingStatus
};
