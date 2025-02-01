"use client";

import { useEffect, useState } from "react";
import { WorkEntry, User, Route, Car } from "@/types";
import { getAllWorkEntries } from "@/services/workEntries";
import { getUsers } from "@/services/users";
import { getRoutes } from "@/services/routes";
import { getCars } from "@/services/cars";
import { WorkEntriesList } from "@/components/molecules/tables/WorkEntriesList";
import { Button } from "@/components/atoms/buttons/Button";
import { Plus } from "lucide-react";
import { WorkEntryModal } from "@/components/molecules/modals/WorkEntryModal";
import PageHeader from "@/components/atoms/layout/PageHeader";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <PageHeader title="Wszystkie wpisy pracy" />
          <Button
            onClick={() => setIsModalOpen(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Dodaj wpis</span>
            <span className="sm:hidden">Dodaj</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-bg-800 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-200 mb-1 block">
                Kierowca
              </label>
              <select
                className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground"
                value={filters.userId || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    userId: e.target.value,
                  })
                }
              >
                <option value="">Wszyscy</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-200 mb-1 block">
                Trasa
              </label>
              <select
                className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground"
                value={filters.routeId || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    routeId: e.target.value,
                  })
                }
              >
                <option value="">Wszystkie</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-200 mb-1 block">
                Samochód
              </label>
              <select
                className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground"
                value={filters.carId || ""}
                onChange={(e) =>
                  setFilters({ ...filters, carId: e.target.value })
                }
              >
                <option value="">Wszystkie</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-200 mb-1 block">
                  Data od
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-200 mb-1 block">
                  Data do
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground"
                  value={filters.endDate || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20 mb-4">
            {error}
          </div>
        )}

        <WorkEntriesList
          entries={entries}
          onUpdate={fetchData}
          loading={loading}
        />
      </div>

      <WorkEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />
    </main>
  );
}
