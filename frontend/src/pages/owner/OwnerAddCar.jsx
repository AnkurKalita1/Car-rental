import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createCar } from "../../api/cars";
import { assets, cityList } from "../../assets/assets";

const OwnerAddCar = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: 0,
    pricePerDay: 0,
    category: "",
    transmission: "",
    fuelType: "",
    seats: 0,
    location: "",
    description: ""
  });
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    // Convert images to base64 for storage (in production, upload to cloud storage)
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result); // Base64 string
        };
        reader.readAsDataURL(file);
      });
    });
    const base64Images = await Promise.all(imagePromises);
    setImages([...images, ...base64Images]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: "" });
    try {
      const carData = {
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        pricePerDay: Number(form.pricePerDay),
        location: form.location.trim(),
        isAvailable: true, // Ensure car is available by default
        images: images.length > 0 ? images : [] // Store image URLs
      };

      // Add optional fields only if they have values
      if (form.category) carData.category = form.category;
      if (form.transmission) carData.transmission = form.transmission;
      if (form.fuelType) carData.fuelType = form.fuelType;
      if (form.seats && Number(form.seats) > 0) carData.seats = Number(form.seats);
      if (form.description.trim()) carData.description = form.description.trim();

      const newCar = await createCar(carData);
      
      setStatus({ loading: false, message: "Car listed successfully!" });
      
      // Reset form
      setForm({
        brand: "",
        model: "",
        year: 0,
        pricePerDay: 0,
        category: "",
        transmission: "",
        fuelType: "",
        seats: 0,
        location: "",
        description: ""
      });
      setImages([]);

      // Optionally navigate to the car details page or manage cars page
      setTimeout(() => {
        navigate("/owner/manage-cars");
      }, 1500);
    } catch (err) {
      setStatus({
        loading: false,
        message: err?.response?.data?.message || "Failed to list car. Please try again."
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white p-6 shadow-glossy"
    >
      <h2 className="text-2xl font-semibold text-slate-900">Add New Car</h2>
      <p className="mt-1 text-sm text-slate-500">
        Fill in details to list a new car for booking, including pricing, availability, and car specifications.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Image Upload Section */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Upload a picture of your car
          </h3>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition hover:border-brand-blue hover:bg-slate-100">
            <img src={assets.upload_icon} alt="Upload" className="mb-2 h-12 w-12 opacity-60" />
            <span className="text-sm font-medium text-slate-600">Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {images.map((imageData, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageData}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Brand */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Brand
            </label>
            <input
              type="text"
              value={form.brand}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, brand: event.target.value }))
              }
              placeholder="e.g. BMW, Mercedes, Audi..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              required
            />
          </div>

          {/* Model */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Model
            </label>
            <input
              type="text"
              value={form.model}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, model: event.target.value }))
              }
              placeholder="e.g. X5, E-Class, M4..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              required
            />
          </div>

          {/* Year */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Year
            </label>
            <input
              type="number"
              value={form.year || ""}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, year: event.target.value }))
              }
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              required
            />
          </div>

          {/* Daily Price */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Daily Price ($)
            </label>
            <input
              type="number"
              value={form.pricePerDay || ""}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, pricePerDay: event.target.value }))
              }
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              value={form.category}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, category: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            >
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Wagon">Wagon</option>
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Transmission
            </label>
            <select
              value={form.transmission}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, transmission: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            >
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Fuel Type
            </label>
            <select
              value={form.fuelType}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, fuelType: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            >
              <option value="">Select a fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          {/* Seating Capacity */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Seating Capacity
            </label>
            <input
              type="number"
              value={form.seats || ""}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, seats: event.target.value }))
              }
              min="1"
              max="10"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Location
            </label>
            <select
              value={form.location}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, location: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              required
            >
              <option value="">Select a location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine."
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={status.loading}
            className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-glossy transition hover:bg-blue-600 disabled:opacity-60"
          >
            {status.loading ? "Listing..." : "List car"}
          </button>
        </div>

        {status.message && (
          <p className={`text-sm ${status.message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {status.message}
          </p>
        )}
      </form>
    </motion.div>
  );
};

export default OwnerAddCar;
