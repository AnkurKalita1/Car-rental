import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { assets } from "../assets/assets";

const navItemClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-brand-blue/10 text-brand-blue"
      : "text-slate-600 hover:bg-slate-100"
  }`;

const OwnerSidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-full space-y-6 rounded-3xl bg-white p-6 shadow-glossy lg:w-64">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-semibold text-lg">
          {user?.name?.[0]?.toUpperCase() || "O"}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {user?.name || "Owner"}
          </p>
          <p className="text-xs text-slate-500">Owner Panel</p>
        </div>
      </div>

      <nav className="space-y-2">
        <NavLink to="/owner" end className={navItemClass}>
          <img 
            src={assets.dashboardIconColored} 
            alt="" 
            className="h-5 w-5" 
          />
          Dashboard
        </NavLink>
        <NavLink to="/owner/add-car" className={navItemClass}>
          <img 
            src={assets.addIconColored} 
            alt="" 
            className="h-5 w-5" 
          />
          Add car
        </NavLink>
        <NavLink to="/owner/manage-cars" className={navItemClass}>
          <img 
            src={assets.carIconColored} 
            alt="" 
            className="h-5 w-5" 
          />
          Manage cars
        </NavLink>
        <NavLink to="/owner/manage-bookings" className={navItemClass}>
          <img 
            src={assets.listIconColored} 
            alt="" 
            className="h-5 w-5" 
          />
          Manage bookings
        </NavLink>
      </nav>
    </aside>
  );
};

export default OwnerSidebar;
