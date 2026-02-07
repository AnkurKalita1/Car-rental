import { useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCars } from "../api/cars";
import carHero from "../assets/main_car.png";
import carIcon from "../assets/icons/car.svg";
import calendarIcon from "../assets/icons/calendar.svg";
import locationIcon from "../assets/icons/location.svg";
import moneyIcon from "../assets/icons/money.svg";
import { assets, dummyCarData } from "../assets/assets";
import Subscribe from "../components/Subscribe";

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    location: "",
    pickupDate: "",
    returnDate: ""
  });
  const [hasSearched, setHasSearched] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const returnMinDate = search.pickupDate || today;

  // State for cars data
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cars function - wrapped in useCallback to ensure it uses latest search state
  const fetchCars = useCallback(async () => {
    const params = {};
    if (search.location) params.location = search.location;
    if (search.pickupDate) params.pickupDate = search.pickupDate;
    if (search.returnDate) params.returnDate = search.returnDate;
    
    setLoading(true);
    try {
      const result = await getCars(params);
      setCars(result || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [search.location, search.pickupDate, search.returnDate]);

  // Helper function to get car image from dummyCarData or fallback
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

  // Featured cars: use API search results when user has searched,
  // otherwise fall back to static demo cars
  const featuredCars = useMemo(() => {
    if (hasSearched) {
      return (cars || []).slice(0, 6);
    }
    return dummyCarData.slice(0, 6);
  }, [hasSearched, cars]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // If all fields are filled, search on home page
    if (search.location && search.pickupDate && search.returnDate) {
      setHasSearched(true);
      // Trigger the API call manually
      await fetchCars();
    } else {
      // Otherwise navigate to cars page with params
      const params = new URLSearchParams();
      if (search.location) params.set("location", search.location);
      if (search.pickupDate) params.set("pickupDate", search.pickupDate);
      if (search.returnDate) params.set("returnDate", search.returnDate);
      navigate(`/cars?${params.toString()}`);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-16">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-24 shadow-glossy"
      >
        <div className="space-y-6 text-center">
          
          <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
            Luxury cars on rent
          </h1>
          <p className="text-base text-slate-500">
            Browse verified inventory, pick dates, and reserve with confidence.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6">
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-3xl flex-col gap-3 rounded-full bg-white px-8 py-8 shadow-lg md:flex-row md:items-center md:justify-between"
          >
            <div className="flex-1 text-left">
              <p className="text-xs font-semibold text-slate-500">
                Pickup location
              </p>
              <select
                value={search.location}
                onChange={(event) =>
                  setSearch((prev) => ({
                    ...prev,
                    location: event.target.value
                  }))
                }
                className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
              >
                <option value="">Select location</option>
                {["New York", "Los Angeles", "Houston", "Chicago"].map(
                  (city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-semibold text-slate-500">Pickup date</p>
              <input
                type="date"
                value={search.pickupDate}
                onChange={(event) =>
                  setSearch((prev) => ({
                    ...prev,
                    pickupDate: event.target.value
                  }))
                }
                min={today}
                className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
              />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-semibold text-slate-500">Return date</p>
              <input
                type="date"
                value={search.returnDate}
                onChange={(event) =>
                  setSearch((prev) => ({
                    ...prev,
                    returnDate: event.target.value
                  }))
                }
                min={returnMinDate}
                className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-brand-blue px-12 py-3 text-sm font-semibold text-white bg-blue-500 shadow-glossy"
            >
              Search
            </button>
          </form>
          {!hasSearched && (
            <div className="flex w-full max-w-4xl items-center justify-center rounded-3xl bg-brand-lightBlue/60 p-6">
              <img
                src={carHero}
                alt="Car"
                className="w-full max-w-4xl rounded-3xl shadow-glossy"
              />
            </div>
          )}
        </div>
      </motion.section>

      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-slate-900">
            {hasSearched ? "Available Cars" : "Featured Vehicles"}
          </h2>
          <p className="text-sm text-slate-500">
            {hasSearched
              ? "Cars available for your selected dates and location."
              : "Explore our selection of premium vehicles for your next adventure."}
          </p>
        </div>
        {hasSearched && loading && (
          <div className="text-center text-sm text-slate-500">
            Searching for available cars...
          </div>
        )}
        {hasSearched && !loading && (!cars || cars.length === 0) && (
          <div className="text-center text-sm text-slate-500">
            No cars available for the selected dates and location. Try different filters.
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCars.map((car) => (
            <Link
              key={car._id}
              to={`/cars/${car._id}`}
              className="group rounded-3xl bg-white p-4 shadow-glossy transition hover:-translate-y-1"
            >
              <div className="relative overflow-hidden rounded-2xl bg-brand-lightBlue/60">
                <img
                  src={getCarImage(car)}
                  alt={`${car.brand} ${car.model}`}
                  className="h-40 w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-brand-blue px-3 py-1 text-xs font-semibold text-white">
                  Available Now
                </span>
                <span className="absolute right-3 bottom-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                  ${car.pricePerDay} / day
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  {car.brand} {car.model}
                </h3>
                <p className="text-xs text-slate-500">
                  {car.category || "Sedan"} · {car.year || "2021"}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <img src={assets.car_icon} alt="" className="h-4 w-4" />
                  {car.seating_capacity || 4} Seats
                </div>
                <div className="flex items-center gap-2">
                  <img src={assets.fuel_icon} alt="" className="h-4 w-4" />
                  {car.fuel_type || "Hybrid"}
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
            </Link>
          ))}
        </div>
        <div className="flex justify-center">
          <Link
            to="/cars"
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700"
          >
            Explore all cars →
          </Link>
        </div>
      </section>

      <section className="space-y-12">
        <div className="rounded-3xl bg-gradient-to-r from-sky-700 to-sky-100 p-8 text-white shadow-glossy md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">
                Do You Own a Luxury Car?
              </h3>
              <p className="text-sm text-white/90">
                Monetize your vehicle effortlessly by listing it on CarRental.
                We take care of insurance, driver verification and secure
                payments — so you can earn passive income, stress-free.
              </p>
              <Link
                to="/owner/add-car"
                className="inline-flex rounded-lg text-sky-500 bg-white px-5 py-2 text-sm font-semibold shadow-glossy"
              >
                List your car
              </Link>
            </div>
            <div className="flex justify-center">
              <img
                src={assets.banner_car_image}
                alt="Luxury car"
                className="h-40 w-full max-w-sm object-contain"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-semibold text-slate-900">
            What Our Customers Say
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Discover why discerning travelers choose CarRental for their next
            journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Emma Rodriguez",
              location: "Barcelona, Spain",
              image: assets.testimonial_image_1,
              text: "I've rented cars from various companies, but the experience with CarRental was exceptional."
            },
            {
              name: "John Smith",
              location: "New York, USA",
              image: assets.testimonial_image_2,
              text: "CarRental made my trip so much easier. The car was delivered right to my door, and the service was fantastic!"
            },
            {
              name: "Ava Johnson",
              location: "Sydney, Australia",
              image: assets.user_profile,
              text: "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service."
            }
          ].map((review) => (
            <div
              key={review.name}
              className="rounded-2xl bg-white p-6 shadow-glossy"
            >
              <div className="flex items-center gap-3">
                <img
                  src={review.image}
                  alt={review.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {review.name}
                  </p>
                  <p className="text-xs text-slate-400">{review.location}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <img
                    key={`${review.name}-star-${index}`}
                    src={assets.star_icon}
                    alt=""
                    className="h-4 w-4"
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-500">{review.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Subscribe />

    </div>
  );
};

export default Home;
