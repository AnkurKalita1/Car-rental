import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import useAuth from "../hooks/useAuth";
import { getAvailability, getCar } from "../api/cars";
import { createBooking } from "../api/bookings";
import carHero from "../assets/main_car.png";
import { assets, dummyCarData } from "../assets/assets";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ pickupDate: "", returnDate: "" });
  const [message, setMessage] = useState("");

  const { data: car, loading, error, run: refetchCar } = useApi(
    () => {
      if (!id) return Promise.resolve(null);
      return getCar(id);
    },
    [id],
    {
      auto: true
    }
  );
  const fallbackCar = dummyCarData.find((item) => item._id === id);
  const resolvedCar = car || fallbackCar;
  const { data: availability } = useApi(
    () => getAvailability(id),
    [id],
    { auto: true, initialData: { unavailableDates: [] } }
  );

  // Resolve car image: prefer backend images (base64 or URL), then fallback car image, then placeholder
  const carImage = useMemo(() => {
    // Check if car has images array with valid image data
    if (car?.images?.length > 0) {
      const firstImage = car.images[0];
      // Handle both base64 data URLs and regular URLs
      if (firstImage && (firstImage.startsWith('data:image') || firstImage.startsWith('http'))) {
        return firstImage;
      }
    }
    if (car?.image) return car.image;
    if (fallbackCar?.image) return fallbackCar.image;
    if (fallbackCar?.images?.[0]) return fallbackCar.images[0];
    return carHero;
  }, [car, fallbackCar]);

  const unavailableSet = useMemo(
    () => new Set(availability?.unavailableDates || []),
    [availability]
  );
  const today = new Date().toISOString().slice(0, 10);
  const returnMinDate = form.pickupDate || today;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await createBooking({
        carId: id,
        pickupDate: form.pickupDate,
        returnDate: form.returnDate
      });
      setMessage("Booking request created. Await owner confirmation.");
      setForm({ pickupDate: "", returnDate: "" });
      navigate("/bookings");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Booking failed.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-silky">
        Loading car details...
      </div>
    );
  }

  // Show error only if we have an error AND no car data AND not loading
  if (error && !car && !fallbackCar && !loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 rounded-2xl bg-white p-6 shadow-silky">
        <p className="text-red-500">Error: {error}</p>
        <p className="text-sm text-slate-500">Car ID: {id}</p>
        <button
          onClick={() => refetchCar()}
          className="rounded-full bg-brand-blue px-4 py-2 text-sm text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  // Only show "not found" if we're sure the car doesn't exist (no error, just no data)
  if (!resolvedCar && !loading && !error) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 text-red-500 shadow-silky">
        Car not found. Please check the car ID: {id}
      </div>
    );
  }

  // If we have resolvedCar, show it even if there was an error (fallback car)
  if (!resolvedCar) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 text-red-500 shadow-silky">
        Unable to load car details. Please try again.
      </div>
    );
  }

  const seats =
    resolvedCar.seating_capacity ?? resolvedCar.seats ?? resolvedCar.seatCount ?? 4;
  const fuel =
    resolvedCar.fuel_type ?? resolvedCar.fuelType ?? resolvedCar.fuel ?? "Hybrid";
  const transmission =
    resolvedCar.transmission ?? resolvedCar.gear ?? "Automatic";
  const location = resolvedCar.location ?? "New York";
  const category = resolvedCar.category ?? "Sedan";
  const features =
    resolvedCar.features || [
      "360 Camera",
      "Bluetooth",
      "GPS",
      "Heated Seats",
      "Rear View Mirror"
    ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Link to="/cars" className="text-sm text-brand-blue">
        ← Back to cars
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-silky">
            <img
              src={carImage}
              alt={`${resolvedCar.brand} ${resolvedCar.model}`}
              className="h-72 w-full rounded-3xl object-cover"
            />
            <div className="mt-6">
              <h2 className="text-3xl font-semibold text-slate-900">
                {resolvedCar.brand} {resolvedCar.model}
              </h2>
              <p className="text-sm text-slate-500">
                {category} · {resolvedCar.year}
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                { label: `${seats} Seats`, icon: assets.users_icon },
                { label: fuel, icon: assets.fuel_icon },
                { label: transmission, icon: assets.car_icon },
                { label: location, icon: assets.location_icon }
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-brand-lightBlue/60 p-3 text-xs font-semibold text-slate-700"
                >
                  <img src={item.icon} alt="" className="h-5 w-5" />
                  {item.label}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Description
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {resolvedCar.description || "No description provided."}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900">Features</h3>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <img src={assets.check_icon} alt="" className="h-4 w-4" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-3xl bg-white p-6 shadow-silky"
        >
          <div className="flex items-center justify-between">
            <p className="text-2xl font-semibold text-slate-900">
              ${resolvedCar.pricePerDay}
            </p>
            <span className="text-xs text-slate-400">per day</span>
          </div>
          <div className="mt-6 space-y-3">
            <label className="text-xs font-semibold text-slate-500">
              Pickup Date
            </label>
            <input
              type="date"
              value={form.pickupDate}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  pickupDate: event.target.value
                }))
              }
              min={today}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand-blue focus:outline-none"
              required
            />
            <label className="text-xs font-semibold text-slate-500">
              Return Date
            </label>
            <input
              type="date"
              value={form.returnDate}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  returnDate: event.target.value
                }))
              }
              min={returnMinDate}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand-blue focus:outline-none"
              required
            />
          </div>
          {!isAuthenticated && (
            <p className="mt-3 text-xs text-slate-400">
              Please sign in to request a booking.
            </p>
          )}
          <button
            type="submit"
            disabled={!isAuthenticated}
            className="mt-5 w-full rounded-full bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-silky disabled:cursor-not-allowed disabled:opacity-50"
          >
            Book Now
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            No credit card required to reserve
          </p>
          {message && (
            <p className="mt-3 text-sm text-slate-500">{message}</p>
          )}
          {form.pickupDate &&
            unavailableSet.has(form.pickupDate) && (
              <p className="mt-2 text-xs text-red-500">
                Pickup date is already unavailable.
              </p>
            )}
        </form>
      </div>
    </div>
  );
};

export default CarDetails;
