import { useState, useMemo } from "react";
import useApi from "../hooks/useApi";
import { getMyBookings } from "../api/bookings";
import { createPaymentOrder, failPayment, verifyPayment } from "../api/payments";
import { assets, dummyCarData } from "../assets/assets";
import carHero from "../assets/main_car.png";
import PaymentModal from "../components/PaymentModal";

const MyBookings = () => {
  const [actionError, setActionError] = useState("");
  const {
    data: bookings,
    loading,
    error,
    run,
    setData
  } = useApi(getMyBookings, []);
  const [activeBooking, setActiveBooking] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handlePay = async (booking) => {
    setActionError("");
    setPaymentLoading(true);
    setActiveBooking(booking);
    try {
      const order = await createPaymentOrder(booking._id);
      setPaymentOrder(order);
    } catch (err) {
      setActionError(err?.response?.data?.message || "Payment failed.");
      setActiveBooking(null);
      setPaymentOrder(null);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (paymentLoading) return;
    setActiveBooking(null);
    setPaymentOrder(null);
  };

  const handlePaymentSuccess = async () => {
    if (!activeBooking) return;
    setActionError("");
    setPaymentLoading(true);
    try {
      await verifyPayment({
        bookingId: activeBooking._id,
        paymentId: `pay_${Date.now()}`,
        paymentMethod: "card"
      });
      const updated = await run();
      setData(updated);
      setActiveBooking(null);
      setPaymentOrder(null);
    } catch (err) {
      setActionError(err?.response?.data?.message || "Payment failed.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentFailure = async () => {
    if (!activeBooking) return;
    setActionError("");
    setPaymentLoading(true);
    try {
      await failPayment(activeBooking._id);
      const updated = await run();
      setData(updated);
      setActiveBooking(null);
      setPaymentOrder(null);
    } catch (err) {
      setActionError(err?.response?.data?.message || "Payment failed.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-red-200 text-white";
      case "confirmed":
        return "bg-blue-100 text-blue-600";
      case "completed":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPaymentBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-600";
      case "failed":
        return "bg-red-100 text-red-600";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  const getCarImage = (carId) => {
    if (!carId) return carHero;
    const carIdStr = carId._id?.toString() || carId.toString();
    const fallbackCar = dummyCarData.find((car) => car._id === carIdStr);
    
    if (carId.images?.[0]) return carId.images[0];
    if (carId.image) return carId.image;
    if (fallbackCar?.image) return fallbackCar.image;
    return carHero;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">My Bookings</h1>
        <p className="mt-2 text-sm text-slate-500">
          View and manage your all car bookings.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-silky">
          Loading bookings...
        </div>
      )}
      {error && (
        <div className="rounded-2xl bg-white p-6 text-sm text-red-500 shadow-silky">
          {error}
        </div>
      )}
      {actionError && (
        <div className="rounded-2xl bg-white p-6 text-sm text-red-500 shadow-silky">
          {actionError}
        </div>
      )}
      {!loading && bookings?.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-silky">
          You have no bookings yet.
        </div>
      )}

      {/* Booking Cards */}
      <div className="grid gap-6">
        {bookings?.map((booking, index) => {
          const car = booking.carId || {};
          const carImage = getCarImage(car);
          const pickupDate = booking.pickupDate
            ? new Date(booking.pickupDate).toISOString().slice(0, 10)
            : "";
          const returnDate = booking.returnDate
            ? new Date(booking.returnDate).toISOString().slice(0, 10)
            : "";
          const bookedDate = booking.createdAt
            ? new Date(booking.createdAt).toISOString().slice(0, 10)
            : "";

          return (
            <div
              key={booking._id}
              className="rounded-3xl bg-white p-6 shadow-silky"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                {/* Left Section - Car Image and Details */}
                <div className="flex flex-col gap-4 lg:w-64">
                  <img
                    src={carImage}
                    alt={`${car.brand || "Car"} ${car.model || ""}`}
                    className="h-48 w-full rounded-2xl object-cover"
                  />
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {car.brand || "Car"} {car.model || ""}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {car.year || "2021"} • {car.category || "Sedan"} •{" "}
                      {car.location || "New York"}
                    </p>
                  </div>
                </div>

                {/* Right Section - Booking Details */}
                <div className="flex-1 space-y-4">
                  {/* Booking ID and Status */}
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-slate-900">
                      Booking #{index + 1}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(
                        booking.bookingStatus
                      )}`}
                    >
                      {booking.bookingStatus || "pending"}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentBadgeColor(
                        booking.paymentStatus
                      )}`}
                    >
                      {booking.paymentStatus || "unpaid"}
                    </span>
                  </div>

                  {/* Rental Period */}
                  <div className="flex items-start gap-3">
                    <img
                      src={assets.calendar_icon_colored}
                      alt=""
                      className="mt-0.5 h-5 w-5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs text-slate-500">Rental Period</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {pickupDate} To {returnDate}
                      </p>
                    </div>
                  </div>

                  {/* Pick-up Location */}
                  <div className="flex items-start gap-3">
                    <img
                      src={assets.location_icon_colored}
                      alt=""
                      className="mt-0.5 h-5 w-5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs text-slate-500">Pick-up Location</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {car.location || "New York"}
                      </p>
                    </div>
                  </div>

                  {/* Total Price and Booking Date */}
                  <div className="flex items-end justify-end pt-2">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Total Price</p>
                      <p className="mt-1 text-2xl font-bold text-brand-blue">
                        ${booking.totalPrice || 0}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Booked on {bookedDate}
                      </p>
                    </div>
                  </div>

                  {/* Booking Timeline */}
                  <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Booking Created</span>
                      <span className="font-semibold text-slate-700">Done</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span>Payment Completed</span>
                      <span className="font-semibold text-slate-700">
                        {booking.paymentStatus === "paid" ? "Done" : "Pending"}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span>Booking Confirmed</span>
                      <span className="font-semibold text-slate-700">
                        {["confirmed", "completed"].includes(booking.bookingStatus)
                          ? "Done"
                          : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  {["unpaid", "failed"].includes(booking.paymentStatus) && (
                    <button
                      onClick={() => handlePay(booking)}
                      className="mt-4 w-full rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-silky hover:bg-blue-600"
                    >
                      {booking.paymentStatus === "failed"
                        ? "Retry Payment"
                        : "Pay Now"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <PaymentModal
        isOpen={Boolean(activeBooking)}
        booking={activeBooking}
        order={paymentOrder}
        onClose={handleCloseModal}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
        loading={paymentLoading}
      />
    </div>
  );
};

export default MyBookings;
