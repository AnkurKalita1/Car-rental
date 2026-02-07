const Booking = require("../models/Booking");
const Car = require("../models/Car");
const ApiError = require("../utils/ApiError");
const availabilityService = require("./availabilityService");

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const BOOKING_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed"],
  completed: [],
  cancelled: []
};

const assertBookingTransition = (currentStatus, nextStatus) => {
  const allowed = BOOKING_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(nextStatus)) {
    throw new ApiError(
      400,
      `Invalid booking status transition: ${currentStatus} -> ${nextStatus}`
    );
  }
};

const autoCompleteBookings = async () => {
  const now = new Date();
  await Booking.updateMany(
    {
      bookingStatus: "confirmed",
      returnDate: { $lt: now }
    },
    { bookingStatus: "completed" }
  );
};

const createBooking = async (user, payload) => {
  const car = await Car.findById(payload.carId);
  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  if (car.ownerId.toString() === user.id) {
    throw new ApiError(400, "Owners cannot book their own cars");
  }

  const pickupDate = new Date(payload.pickupDate);
  const returnDate = new Date(payload.returnDate);
  if (Number.isNaN(pickupDate.getTime()) || Number.isNaN(returnDate.getTime())) {
    throw new ApiError(400, "Invalid pickup or return date");
  }
  if (returnDate <= pickupDate) {
    throw new ApiError(400, "Return date must be after pickup date");
  }

  const available = await availabilityService.isRangeAvailable(
    car._id,
    pickupDate,
    returnDate
  );
  if (!available) {
    throw new ApiError(400, "Car is not available for selected dates");
  }

  const days = Math.ceil((returnDate - pickupDate) / MS_PER_DAY);
  const totalPrice = days * car.pricePerDay;

  const booking = await Booking.create({
    userId: user.id,
    carId: car._id,
    pickupDate,
    returnDate,
    totalPrice,
    bookingStatus: "pending",
    paymentStatus: "unpaid"
  });

  return booking;
};

const getMyBookings = async (userId) => {
  await autoCompleteBookings();
  return Booking.find({ userId })
    .populate("carId")
    .sort({ createdAt: -1 });
};

const getOwnerBookings = async (ownerId) => {
  await autoCompleteBookings();
  const cars = await Car.find({ ownerId }).select("_id");
  const carIds = cars.map((car) => car._id);
  return Booking.find({ carId: { $in: carIds } })
    .populate("carId")
    .sort({ createdAt: -1 });
};

const getOwnerRevenue = async (ownerId, year) => {
  await autoCompleteBookings();
  const cars = await Car.find({ ownerId }).select("_id");
  const carIds = cars.map((car) => car._id);

  const now = new Date();
  const match = {
    carId: { $in: carIds },
    bookingStatus: "confirmed",
    paymentStatus: "paid",
    pickupDate: { $lte: now }
  };

  if (year) {
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));
    match.pickupDate = { $gte: start, $lt: end, $lte: now };
  }

  const rows = await Booking.aggregate([
    { $match: match },
    {
      $group: {
        _id: { month: { $month: "$pickupDate" } },
        revenue: { $sum: "$totalPrice" },
        bookings: { $sum: 1 }
      }
    },
    { $sort: { "_id.month": 1 } }
  ]);

  const months = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    revenue: 0,
    bookings: 0
  }));

  rows.forEach((row) => {
    const idx = row._id.month - 1;
    months[idx] = {
      month: row._id.month,
      revenue: row.revenue,
      bookings: row.bookings
    };
  });

  const totalRevenue = months.reduce((sum, m) => sum + m.revenue, 0);
  const totalBookings = months.reduce((sum, m) => sum + m.bookings, 0);

  return { totalRevenue, totalBookings, months };
};

const updateBookingStatus = async (ownerId, bookingId, status) => {
  await autoCompleteBookings();
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const car = await Car.findById(booking.carId);
  if (!car) {
    throw new ApiError(404, "Car not found");
  }
  if (car.ownerId.toString() !== ownerId) {
    throw new ApiError(403, "Forbidden");
  }

  if (!["confirmed", "cancelled"].includes(status)) {
    throw new ApiError(400, "Invalid booking status");
  }
  assertBookingTransition(booking.bookingStatus, status);

  if (status === "confirmed") {
    if (booking.paymentStatus !== "paid") {
      throw new ApiError(400, "Payment must be completed before confirming");
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
  }

  booking.bookingStatus = status;
  await booking.save();
  return booking;
};

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getOwnerRevenue,
  updateBookingStatus
};
