const express = require("express");
const bookingController = require("../controllers/bookingController");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/rbac");
const validate = require("../middlewares/validate");
const {
  createBookingSchema,
  statusSchema,
  revenueSchema
} = require("../validators/bookingValidators");

const router = express.Router();

router.post("/", auth, validate(createBookingSchema), bookingController.createBooking);
router.get("/my", auth, bookingController.getMyBookings);
router.get(
  "/owner",
  auth,
  requireRole("owner"),
  bookingController.getOwnerBookings
);
router.get(
  "/owner/revenue",
  auth,
  requireRole("owner"),
  validate(revenueSchema),
  bookingController.getOwnerRevenue
);
router.patch(
  "/:id/status",
  auth,
  requireRole("owner"),
  validate(statusSchema),
  bookingController.updateBookingStatus
);
module.exports = router;
