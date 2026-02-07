const Car = require("../models/Car");
const Booking = require("../models/Booking");
const ApiError = require("../utils/ApiError");
const availabilityService = require("./availabilityService");

const listCars = async (query) => {
  const filter = {};
  if (query.brand) filter.brand = query.brand;
  if (query.model) filter.model = query.model;
  if (query.location) filter.location = query.location;
  if (query.availableOnly !== "false") {
    filter.isAvailable = true;
  }

  let cars = await Car.find(filter).sort({ createdAt: -1 });

  // Filter by availability dates if provided
  if (query.pickupDate && query.returnDate) {
    const pickupDate = new Date(query.pickupDate);
    const returnDate = new Date(query.returnDate);

    if (!Number.isNaN(pickupDate.getTime()) && !Number.isNaN(returnDate.getTime())) {
      const availableCars = [];
      for (const car of cars) {
        const isAvailable = await availabilityService.isRangeAvailable(
          car._id,
          pickupDate,
          returnDate
        );
        if (isAvailable) {
          availableCars.push(car);
        }
      }
      cars = availableCars;
    }
  }

  return cars;
};

const getOwnerCars = async (ownerId) =>
  Car.find({ ownerId }).sort({ createdAt: -1 });

const getCar = async (id) => {
  const car = await Car.findById(id);
  if (!car) {
    throw new ApiError(404, "Car not found");
  }
  return car;
};

const createCar = async (ownerId, payload) => {
  // Ensure isAvailable is set to true by default for new cars
  const carData = {
    ...payload,
    ownerId,
    isAvailable: payload.isAvailable !== undefined ? payload.isAvailable : true
  };
  const car = await Car.create(carData);
  return car;
};

const updateCarStatus = async (ownerId, id, isAvailable) => {
  const car = await Car.findById(id);
  if (!car) {
    throw new ApiError(404, "Car not found");
  }
  if (car.ownerId.toString() !== ownerId) {
    throw new ApiError(403, "Forbidden");
  }
  car.isAvailable = isAvailable;
  await car.save();
  return car;
};

const deleteCar = async (ownerId, id) => {
  const car = await Car.findById(id);
  if (!car) {
    throw new ApiError(404, "Car not found");
  }
  if (car.ownerId.toString() !== ownerId) {
    throw new ApiError(403, "Forbidden");
  }

  const now = new Date();
  const activeBooking = await Booking.findOne({
    carId: id,
    bookingStatus: { $in: ["pending", "confirmed"] },
    returnDate: { $gte: now }
  });
  if (activeBooking) {
    throw new ApiError(400, "Cannot delete car with active bookings");
  }

  await car.deleteOne();
  return { deleted: true };
};

module.exports = {
  listCars,
  getOwnerCars,
  getCar,
  createCar,
  updateCarStatus,
  deleteCar
};
