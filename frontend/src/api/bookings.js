import client from "./client";

export const createBooking = async (payload) => {
  const { data } = await client.post("/bookings", payload);
  return data;
};

export const getMyBookings = async () => {
  const { data } = await client.get("/bookings/my");
  return data;
};

export const getOwnerBookings = async () => {
  const { data } = await client.get("/bookings/owner");
  return data;
};

export const getOwnerRevenue = async (params = {}) => {
  const { data } = await client.get("/bookings/owner/revenue", { params });
  return data;
};

export const updateBookingStatus = async (id, status) => {
  const { data } = await client.patch(
    `/bookings/${id}/status`,
    { status },
    { timeout: 20000, __noRetry: true }
  );
  return data;
};
