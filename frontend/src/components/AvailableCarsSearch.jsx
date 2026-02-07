const AvailableCarsSearch = ({ value, onChange }) => (
  <section className="rounded-3xl bg-white p-8 text-center shadow-glossy">
    <h2 className="text-3xl font-semibold text-slate-900">Available Cars</h2>
    <p className="mt-2 text-sm text-slate-500">
      Browse our selection of premium vehicles available for your next
      adventure.
    </p>
    <div className="mt-6 flex justify-center">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by brand or model"
        className="w-full max-w-md rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-700 focus:border-brand-blue focus:outline-none"
      />
    </div>
  </section>
);

export default AvailableCarsSearch;
