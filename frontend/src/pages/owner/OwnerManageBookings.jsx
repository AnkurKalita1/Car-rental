import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useApi from "../../hooks/useApi";
import { getOwnerBookings, updateBookingStatus } from "../../api/bookings";

const OwnerManageBookings = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const { data: bookings, loading, run, setData, error } = useApi(
    getOwnerBookings,
    []
  );
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsStuck(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsStuck(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [loading]);

  const handleStatus = async (id, status) => {
    setErrorMessage("");
    setUpdatingId(id);
    try {
      const updatedBooking = await updateBookingStatus(id, status);
      setData((prev) =>
        (prev || []).map((item) =>
          item._id === updatedBooking._id ? { ...item, ...updatedBooking } : item
        )
      );
    } catch (err) {
      console.error("OwnerManageBookings update failed:", {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
        url: err?.config?.url,
        baseURL: err?.config?.baseURL,
        method: err?.config?.method,
        requestData: err?.config?.data
      });
      const apiMessage = err?.response?.data?.message;
      const statusCode = err?.response?.status;
      const fallbackMessage = err?.message || "Update failed.";
      const requestUrl = err?.config?.baseURL
        ? `${err.config.baseURL}${err.config.url || ""}`
        : err?.config?.url || "unknown";
      setErrorMessage(
        apiMessage ||
          (statusCode
            ? `Update failed (${statusCode}). ${requestUrl}`
            : `${fallbackMessage} ${requestUrl}`)
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white p-6 shadow-glossy"
    >
      <h2 className="text-2xl font-semibold text-slate-900">
        Manage Bookings
      </h2>
      <p className="text-sm text-slate-500">
        Approve or cancel customer requests.
      </p>

      {loading && (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
          Loading bookings...
        </div>
      )}
      {isStuck && (
        <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">
          Loading is taking longer than expected. Please click Retry.
          <button
            onClick={() => run()}
            className="ml-3 rounded-full bg-brand-blue px-3 py-1 text-xs text-white"
          >
            Retry
          </button>
        </div>
      )}
      {error && !loading && (
        <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
      )}
      {errorMessage && (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-500">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {bookings?.map((booking) => {
          const car = booking.carId || {};
          const carName = car.brand && car.model 
            ? `${car.brand} ${car.model}` 
            : "Car";
          const canConfirm = booking.paymentStatus === "paid";
          return (
            <div
              key={booking._id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {carName}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {booking.pickupDate?.slice(0, 10)} →{" "}
                  {booking.returnDate?.slice(0, 10)}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Booked on {booking.createdAt?.slice(0, 10) || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-800">
                  ${booking.totalPrice || 0}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  booking.bookingStatus === "confirmed" 
                    ? "bg-green-100 text-green-600" 
                    : booking.bookingStatus === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}>
                  {booking.bookingStatus || "pending"}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  booking.paymentStatus === "paid"
                    ? "bg-green-100 text-green-600"
                    : booking.paymentStatus === "failed"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}>
                  {booking.paymentStatus || "unpaid"}
                </span>
                {booking.bookingStatus === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatus(booking._id, "confirmed")}
                      disabled={updatingId === booking._id || !canConfirm}
                      className="rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                    >
                      {updatingId === booking._id
                        ? "Updating..."
                        : canConfirm
                        ? "Accept"
                        : "Awaiting Payment"}
                    </button>
                    <button
                      onClick={() => handleStatus(booking._id, "cancelled")}
                      disabled={updatingId === booking._id}
                      className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {!loading && bookings?.length === 0 && (
          <p className="text-sm text-slate-400">No bookings available.</p>
        )}
      </div>
    </motion.div>
  );
};

export default OwnerManageBookings;
