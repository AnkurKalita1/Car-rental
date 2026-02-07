import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-blue-500" : "text-slate-600 hover:text-blue-500"
  }`;

const Navbar = () => {
  const { isAuthenticated, isOwner, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-brand-gray/30">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="text-lg font-semibold text-slate-900">
          Car<span className="text-brand-blue">Rental</span>
        </NavLink>
        <div className="flex items-center gap-6">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/cars" className={linkClass}>
            Cars
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/bookings" className={linkClass}>
              My Bookings
            </NavLink>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-500">
                Hi, {user?.name?.split(" ")[0]}
              </span>
              {isOwner && (
                <NavLink
                  to="/owner"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                >
                  Dashboard
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/auth?mode=login"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
              >
                Log in
              </NavLink>
              <NavLink
                to="/auth?mode=register"
                className="rounded-full bg-brand-blue px-4 py-2 text-sm font-medium text-white shadow-silky"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
