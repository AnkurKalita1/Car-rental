const Booking = require("../models/Booking");

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const toDateOnlyUtc = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

const addDaysUtc = (date, days) =>
  new Date(date.getTime() + days * MS_PER_DAY);

const findOverlappingConfirmed = async (carId, start, end, excludeId) => {
  const query = {
    carId,
    bookingStatus: "confirmed",
    pickupDate: { $lte: end },
    returnDate: { $gte: start }
  };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return Booking.findOne(query);
};

const isRangeAvailable = async (carId, start, end, excludeId) => {
  const overlap = await findOverlappingConfirmed(carId, start, end, excludeId);
  return !overlap;
};

const getUnavailableDates = async (carId, rangeStart, rangeEnd) => {
  const query = { carId, bookingStatus: "confirmed" };
  if (rangeStart && rangeEnd) {
    query.pickupDate = { $lte: rangeEnd };
    query.returnDate = { $gte: rangeStart };
  }

  const bookings = await Booking.find(query).select("pickupDate returnDate");
  const dates = new Set();

  bookings.forEach((booking) => {
    const start = toDateOnlyUtc(booking.pickupDate);
    const end = toDateOnlyUtc(booking.returnDate);
    for (let d = start; d <= end; d = addDaysUtc(d, 1)) {
      dates.add(d.toISOString().slice(0, 10));
    }
  });

  return Array.from(dates).sort();
};

module.exports = {
  isRangeAvailable,
  getUnavailableDates
};
