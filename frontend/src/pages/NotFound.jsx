import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-silky">
    <h2 className="text-3xl font-semibold text-slate-900">
      Page not found
    </h2>
    <p className="mt-3 text-sm text-slate-500">
      The page you are looking for doesn’t exist.
    </p>
    <Link
      to="/"
      className="mt-6 inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-silky"
    >
      Back to home
    </Link>
  </div>
);

export default NotFound;
