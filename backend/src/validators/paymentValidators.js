const { z } = require("zod");

const createOrderSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const verifyPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1),
    paymentId: z.string().min(1),
    paymentMethod: z.string().min(1)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const failPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

module.exports = {
  createOrderSchema,
  verifyPaymentSchema,
  failPaymentSchema
};
