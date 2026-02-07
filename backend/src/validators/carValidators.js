const { z } = require("zod");

const idParams = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional()
});

const availabilitySchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  query: z.object({
    from: z.string().optional(),
    to: z.string().optional()
  }),
  body: z.object({}).optional()
});

const createCarSchema = z.object({
  body: z.object({
    brand: z.string().min(1),
    model: z.string().min(1),
    year: z.number().int().min(1900),
    pricePerDay: z.number().positive(),
    category: z.string().optional(),
    transmission: z.string().optional(),
    fuelType: z.string().optional(),
    seats: z.number().int().positive().optional(),
    location: z.string().min(1),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    images: z.array(z.string()).optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    isAvailable: z.boolean()
  }),
  query: z.object({}).optional()
});

module.exports = {
  idParams,
  createCarSchema,
  updateStatusSchema,
  availabilitySchema
};
