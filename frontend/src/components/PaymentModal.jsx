const PaymentModal = ({
  isOpen = false,
  booking = null,
  order = null,
  onClose,
  onSuccess,
  onFailure,
  loading = false
}) => {
  if (!isOpen || !booking) return null;

  const car = booking.carId || {};
  const carName = car.brand && car.model ? `${car.brand} ${car.model}` : "Car";
  const pickupDate = booking.pickupDate?.slice(0, 10) || "N/A";
  const returnDate = booking.returnDate?.slice(0, 10) || "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-glossy">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">
            Complete Payment
          </h3>
          <button
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{carName}</p>
            <p className="mt-1">
              {pickupDate} → {returnDate}
            </p>
            <p className="mt-1">Booking ID: {booking._id}</p>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
            <span className="text-sm text-slate-500">Amount</span>
            <span className="text-lg font-semibold text-slate-900">
              ${booking.totalPrice || 0}
            </span>
          </div>

          {order && (
            <div className="rounded-2xl bg-brand-lightBlue/40 px-4 py-3 text-xs text-slate-600">
              <p>Order ID: {order.orderId}</p>
              <p>
                {order.currency} {order.amount}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <button
            onClick={onSuccess}
            disabled={loading}
            className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Simulate Success"}
          </button>
          <button
            onClick={onFailure}
            disabled={loading}
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Simulate Failure"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
