import client from "./client";

export const getCars = async (params = {}) => {
  const { data } = await client.get("/cars", { params });
  return data;
};

export const getCar = async (id) => {
  const { data } = await client.get(`/cars/${id}`);
  return data;
};

export const getOwnerCars = async () => {
  const { data } = await client.get("/cars/owner");
  return data;
};

export const createCar = async (payload) => {
  const { data } = await client.post("/cars", payload);
  return data;
};

export const updateCarStatus = async (id, isAvailable) => {
  const { data } = await client.patch(`/cars/${id}/status`, { isAvailable });
  return data;
};

export const deleteCar = async (id) => {
  const { data } = await client.delete(`/cars/${id}`);
  return data;
};

export const getAvailability = async (id, params = {}) => {
  const { data } = await client.get(`/cars/${id}/availability`, { params });
  return data;
};
