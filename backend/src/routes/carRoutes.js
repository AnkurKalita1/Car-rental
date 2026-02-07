const express = require("express");
const carController = require("../controllers/carController");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/rbac");
const validate = require("../middlewares/validate");
const {
  idParams,
  createCarSchema,
  updateStatusSchema,
  availabilitySchema
} = require("../validators/carValidators");

const router = express.Router();

router.get("/", carController.listCars);
router.get("/owner", auth, requireRole("owner"), carController.listOwnerCars);
router.get("/:id", validate(idParams), carController.getCar);
router.get(
  "/:id/availability",
  validate(availabilitySchema),
  carController.getAvailability
);

router.post(
  "/",
  auth,
  requireRole("owner"),
  validate(createCarSchema),
  carController.createCar
);

router.patch(
  "/:id/status",
  auth,
  requireRole("owner"),
  validate(updateStatusSchema),
  carController.updateCarStatus
);

router.delete(
  "/:id",
  auth,
  requireRole("owner"),
  validate(idParams),
  carController.deleteCar
);

module.exports = router;
