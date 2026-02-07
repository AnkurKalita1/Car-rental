const Subscribe = () => (
  <section className="rounded-3xl bg-white px-6 py-12 text-center shadow-glossy">
    <h3 className="text-3xl font-semibold text-slate-900">
      Never Miss a Deal!
    </h3>
    <p className="mt-2 text-sm text-slate-500">
      Subscribe to get the latest offers, new arrivals, and exclusive discounts
    </p>
    <div className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm md:flex-row">
      <input
        type="email"
        placeholder="Enter your email id"
        className="w-full flex-1 px-4 py-2 text-sm text-slate-600 outline-none"
      />
      <button className="rounded-xl bg-brand-blue px-6 py-2 text-sm font-semibold text-sky-500">
        Subscribe
      </button>
    </div>
  </section>
);

export default Subscribe;
