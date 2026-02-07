const { z } = require("zod");

const createBookingSchema = z.object({
  body: z.object({
    carId: z.string().min(1),
    pickupDate: z.string().min(1),
    returnDate: z.string().min(1)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const statusSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    status: z.enum(["confirmed", "cancelled"])
  }),
  query: z.object({}).optional()
});

const revenueSchema = z.object({
  params: z.object({}).optional(),
  body: z.object({}).optional(),
  query: z.object({
    year: z.string().regex(/^\d{4}$/).optional()
  })
});

module.exports = {
  createBookingSchema,
  statusSchema,
  revenueSchema
};
