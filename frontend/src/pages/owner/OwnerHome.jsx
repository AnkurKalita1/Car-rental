import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import useApi from "../../hooks/useApi";
import { getOwnerCars } from "../../api/cars";
import { getOwnerBookings, getOwnerRevenue } from "../../api/bookings";
import { assets } from "../../assets/assets";

const OwnerHome = () => {
  const year = new Date().getUTCFullYear();
  const month = new Date().getUTCMonth() + 1; // Current month (1-12)
  const { data: cars, loading: carsLoading } = useApi(getOwnerCars, []);
  const { data: bookings, loading: bookingsLoading } = useApi(
    getOwnerBookings,
    []
  );
  const { data: revenue, loading: revenueLoading, run: refreshRevenue } = useApi(
    () => getOwnerRevenue({ year }),
    [year]
  );

  const confirmedCount = useMemo(
    () =>
      bookings?.filter((booking) => booking.bookingStatus === "confirmed")
        .length || 0,
    [bookings]
  );

  useEffect(() => {
    if (bookings) {
      refreshRevenue();
    }
  }, [confirmedCount, year, refreshRevenue, bookings]);

  const metrics = useMemo(() => {
    const totalCars = cars?.length || 0;
    const totalBookings = bookings?.length || 0;
    const pendingBookings =
      bookings?.filter((booking) => booking.bookingStatus === "pending")
        .length || 0;
    const confirmedBookings = confirmedCount;

    return [
      { label: "Total Cars", value: totalCars, icon: assets.car_icon },
      { label: "Total Bookings", value: totalBookings, icon: assets.calendar_icon_colored },
      { label: "Pending", value: pendingBookings, icon: assets.check_icon },
      { label: "Confirmed", value: confirmedBookings, icon: assets.calendar_icon_colored }
    ];
  }, [cars, bookings]);

  const monthlyRevenue = useMemo(() => {
    if (!revenue?.months) return 0;
    const currentMonthData = revenue.months.find((m) => m.month === month);
    return currentMonthData?.revenue || 0;
  }, [revenue, month]);

  const recentBookings = (bookings || []).slice(0, 4);

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white p-6 shadow-glossy"
      >
        <h2 className="text-2xl font-semibold text-slate-900">
          Admin Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Monitor overall platform performance including total cars, bookings, revenue, and recent activities
        </p>
      </motion.header>

      {carsLoading || bookingsLoading || revenueLoading ? (
        <div className="rounded-2xl bg-white p-4 text-sm text-slate-500 shadow-glossy">
          Loading dashboard insights...
        </div>
      ) : (
        <>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl bg-white p-6 shadow-glossy"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {metric.value}
                </p>
              </div>
              {metric.icon && (
                <img src={metric.icon} alt="" className="h-8 w-8 opacity-60" />
              )}
            </div>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-6 shadow-glossy"
        >
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Bookings
          </h3>
          <p className="mt-1 text-sm text-slate-500">Latest customer bookings</p>
          <div className="mt-4 space-y-3">
            {recentBookings.map((booking) => {
              const car = booking.carId || {};
              const carName = car.brand && car.model 
                ? `${car.brand} ${car.model}` 
                : "Car";
              return (
                <div
                  key={booking._id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={assets.calendar_icon_colored} 
                      alt="" 
                      className="h-5 w-5 opacity-60" 
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {carName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {booking.pickupDate?.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900">
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
                  </div>
                </div>
              );
            })}
            {recentBookings.length === 0 && (
              <p className="text-sm text-slate-400">No bookings yet.</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-6 shadow-glossy"
        >
          <h3 className="text-lg font-semibold text-slate-900">
            Monthly Revenue
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Revenue for current month
          </p>
          <div className="mt-6">
            <p className="text-4xl font-bold text-blue-500">
              ${monthlyRevenue}
            </p>
          </div>
        </motion.div>
      </section>
        </>
      )}
    </div>
  );
};

export default OwnerHome;
