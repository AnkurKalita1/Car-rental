import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import { getCars } from "../api/cars";
import { dummyCarData } from "../assets/assets";
import AvailableCarsSearch from "../components/AvailableCarsSearch";
import CarsList from "../components/CarsList";

const Cars = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  
  // Get URL params for filtering
  const urlLocation = searchParams.get("location") || "";
  const urlPickupDate = searchParams.get("pickupDate") || "";
  const urlReturnDate = searchParams.get("returnDate") || "";

  const apiParams = useMemo(() => {
    const params = {};
    if (urlLocation) params.location = urlLocation;
    if (urlPickupDate) params.pickupDate = urlPickupDate;
    if (urlReturnDate) params.returnDate = urlReturnDate;
    return params;
  }, [urlLocation, urlPickupDate, urlReturnDate]);

  const { data: cars, loading, error } = useApi(
    () => (Object.keys(apiParams).length > 0 ? getCars(apiParams) : getCars()),
    [apiParams]
  );

  const list = useMemo(() => {
    if (cars && cars.length) return cars;
    return dummyCarData;
  }, [cars]);

  const filteredCars = useMemo(() => {
    if (!search.trim()) return list;
    const term = search.toLowerCase();
    return list.filter(
      (car) =>
        car.brand?.toLowerCase().includes(term) ||
        car.model?.toLowerCase().includes(term)
    );
  }, [list, search]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AvailableCarsSearch value={search} onChange={setSearch} />

      {loading && (
        <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-silky">
          Loading cars...
        </div>
      )}
      {!loading && filteredCars.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-silky">
          No cars found. Try a different search term.
        </div>
      )}
      <CarsList cars={filteredCars} />
    </div>
  );
};

export default Cars;
