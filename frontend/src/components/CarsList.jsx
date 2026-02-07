import { Link } from "react-router-dom";
import carHero from "../assets/main_car.png";
import { assets, dummyCarData } from "../assets/assets";

// Helper function to get car image
const getCarImage = (car) => {
  if (!car) return carHero;
  const carIdStr = car._id?.toString() || car._id;
  const fallbackCar = dummyCarData.find((item) => item._id === carIdStr);
  
  // Check if car has images array with valid image data (base64 or URL)
  if (car?.images?.length > 0) {
    const firstImage = car.images[0];
    // Handle both base64 data URLs and regular URLs
    if (firstImage && (firstImage.startsWith('data:image') || firstImage.startsWith('http'))) {
      return firstImage;
    }
  }
  if (car?.image) return car.image;
  if (fallbackCar?.image) return fallbackCar.image;
  return carHero;
};

const CarsList = ({ cars }) => (
  <section className="space-y-4">
    <p className="text-sm text-slate-500">Showing {cars.length} cars</p>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <Link
          key={car._id}
          to={`/cars/${car._id}`}
          className="group block overflow-hidden rounded-3xl bg-white shadow-glossy transition hover:-translate-y-1"
        >
          <div className="relative">
            <img
              src={getCarImage(car)}
              alt={`${car.brand} ${car.model}`}
              className="h-44 w-full object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-brand-blue px-3 py-1 text-xs font-semibold text-white">
              Available Now
            </span>
            <span className="absolute right-3 bottom-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
              ${car.pricePerDay} / day
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-slate-900">
              {car.brand} {car.model}
            </h3>
            <p className="text-xs text-slate-500">
              {car.category || "Sedan"} · {car.year || "2021"}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <img src={assets.car_icon} alt="" className="h-4 w-4" />
                {car.seating_capacity || car.seats || 4} Seats
              </div>
              <div className="flex items-center gap-2">
                <img src={assets.fuel_icon} alt="" className="h-4 w-4" />
                {car.fuel_type || car.fuelType || "Hybrid"}
              </div>
              <div className="flex items-center gap-2">
                <img src={assets.car_icon} alt="" className="h-4 w-4" />
                {car.transmission || "Automatic"}
              </div>
              <div className="flex items-center gap-2">
                <img src={assets.location_icon} alt="" className="h-4 w-4" />
                {car.location || "New York"}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default CarsList;
