import { useState } from "react";
import { motion } from "framer-motion";
import useApi from "../../hooks/useApi";
import { deleteCar, getOwnerCars, updateCarStatus } from "../../api/cars";
import carHero from "../../assets/car-hero.svg";

const OwnerManageCars = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { data: cars, loading, run, setData } = useApi(getOwnerCars, []);

  const handleToggle = async (car) => {
    setErrorMessage("");
    try {
      await updateCarStatus(car._id, !car.isAvailable);
      const updated = await run();
      setData(updated);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Update failed.");
    }
  };

  const handleDelete = async (carId) => {
    setErrorMessage("");
    try {
      await deleteCar(carId);
      const updated = await run();
      setData(updated);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white p-6 shadow-glossy"
    >
      <h2 className="text-2xl font-semibold text-slate-900">Manage Cars</h2>
      <p className="text-sm text-slate-500">
        View all listed cars and update availability.
      </p>

      {loading && (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
          Loading cars...
        </div>
      )}
      {errorMessage && (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-500">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {cars?.map((car) => (
          <div
            key={car._id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <img
                src={car.images?.[0] || carHero}
                alt={`${car.brand} ${car.model}`}
                className="mb-3 h-20 w-32 rounded-xl object-cover"
              />
              <p className="text-sm font-semibold text-slate-900">
                {car.brand} {car.model}
              </p>
              <p className="text-xs text-slate-500">
                {car.category || "Category"} · ${car.pricePerDay}/day
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  car.isAvailable
                    ? "bg-brand-blue/10 text-brand-blue"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {car.isAvailable ? "Available" : "Unavailable"}
              </span>
              <button
                onClick={() => handleToggle(car)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
              >
                Toggle
              </button>
              <button
                onClick={() => handleDelete(car._id)}
                className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && cars?.length === 0 && (
          <p className="text-sm text-slate-400">No cars listed yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default OwnerManageCars;
