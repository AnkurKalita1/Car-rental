const asyncHandler = require("../utils/asyncHandler");
const carService = require("../services/carService");
const availabilityService = require("../services/availabilityService");

const listCars = asyncHandler(async (req, res) => {
  const cars = await carService.listCars(req.query);
  res.json(cars);
});

const listOwnerCars = asyncHandler(async (req, res) => {
  const cars = await carService.getOwnerCars(req.user.id);
  res.json(cars);
});

const getCar = asyncHandler(async (req, res) => {
  const car = await carService.getCar(req.params.id);
  res.json(car);
});

const createCar = asyncHandler(async (req, res) => {
  const car = await carService.createCar(req.user.id, req.validated.body);
  res.status(201).json(car);
});

const updateCarStatus = asyncHandler(async (req, res) => {
  const car = await carService.updateCarStatus(
    req.user.id,
    req.params.id,
    req.validated.body.isAvailable
  );
  res.json(car);
});

const deleteCar = asyncHandler(async (req, res) => {
  const result = await carService.deleteCar(req.user.id, req.params.id);
  res.json(result);
});

const getAvailability = asyncHandler(async (req, res) => {
  const { from, to } = req.validated.query;
  const start = from ? new Date(from) : new Date();
  const end = to ? new Date(to) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ message: "Invalid date range" });
  }

  const unavailableDates = await availabilityService.getUnavailableDates(
    req.params.id,
    start,
    end
  );

  res.json({
    carId: req.params.id,
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
    unavailableDates
  });
});

module.exports = {
  listCars,
  listOwnerCars,
  getCar,
  createCar,
  updateCarStatus,
  deleteCar,
  getAvailability
};
