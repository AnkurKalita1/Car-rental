import { Outlet } from "react-router-dom";
import OwnerSidebar from "./OwnerSidebar";

const OwnerLayout = () => (
  <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row">
    <OwnerSidebar />
    <div className="flex-1 min-w-0">
      <Outlet />
    </div>
  </div>
);

export default OwnerLayout;
