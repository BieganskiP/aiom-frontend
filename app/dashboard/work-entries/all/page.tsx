"use client";

import { useEffect, useState } from "react";
import { WorkEntry, User, Route, Car } from "@/types";
import { getAllWorkEntries } from "@/services/workEntries";
import { getUsers } from "@/services/users";
import { getRoutes } from "@/services/routes";
import { getCars } from "@/services/cars";
import { WorkEntriesList } from "@/components/molecules/WorkEntriesList";

export default function AllWorkEntriesPage() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filters, setFilters] = useState({
    userId: "",
    routeId: "",
    carId: "",
    startDate: "",
    endDate: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [entriesData, usersData, routesData, carsData] = await Promise.all([
        getAllWorkEntries(filters),
        getUsers(),
        getRoutes(),
        getCars(),
      ]);
      setEntries(entriesData);
      setUsers(usersData);
      setRoutes(routesData);
      setCars(carsData);
    } catch (error) {
      setError("Nie udało się pobrać danych");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  if (loading) {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-neutral-600">Ładowanie...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">
            Wszystkie wpisy pracy
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white p-4 rounded-lg shadow mb-4">
            <select
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              value={filters.userId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, userId: e.target.value }))
              }
            >
              <option value="">Wszyscy kierowcy</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              value={filters.routeId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, routeId: e.target.value }))
              }
            >
              <option value="">Wszystkie trasy</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              value={filters.carId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, carId: e.target.value }))
              }
            >
              <option value="">Wszystkie samochody</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name} ({car.licensePlate})
                </option>
              ))}
            </select>

            <input
              type="date"
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
              placeholder="Data początkowa"
            />

            <input
              type="date"
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
              placeholder="Data końcowa"
            />
          </div>
        </div>

        {error && (
          <div className="bg-error-50 text-error-500 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <WorkEntriesList entries={entries} />
      </div>
    </main>
  );
}
