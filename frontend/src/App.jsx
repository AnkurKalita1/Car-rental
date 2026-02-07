import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import Auth from "./pages/Auth";
import MyBookings from "./pages/MyBookings";
import OwnerLayout from "./components/OwnerLayout";
import OwnerHome from "./pages/owner/OwnerHome";
import OwnerAddCar from "./pages/owner/OwnerAddCar";
import OwnerManageCars from "./pages/owner/OwnerManageCars";
import OwnerManageBookings from "./pages/owner/OwnerManageBookings";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="cars" element={<Cars />} />
        <Route path="cars/:id" element={<CarDetails />} />
        <Route path="auth" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path="bookings" element={<MyBookings />} />
          <Route element={<RoleRoute role="owner" />}>
            <Route path="owner" element={<OwnerLayout />}>
              <Route index element={<OwnerHome />} />
              <Route path="add-car" element={<OwnerAddCar />} />
              <Route path="manage-cars" element={<OwnerManageCars />} />
              <Route path="manage-bookings" element={<OwnerManageBookings />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
