import client from "./client";

export const createPaymentOrder = async (bookingId) => {
  const { data } = await client.post("/payments/create-order", { bookingId });
  return data;
};

export const verifyPayment = async (payload) => {
  const { data } = await client.post("/payments/verify", payload);
  return data;
};

export const failPayment = async (bookingId) => {
  const { data } = await client.post("/payments/fail", { bookingId });
  return data;
};
