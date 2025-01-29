"use client";

import { RoutesList } from "@/types";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";

export default function RouteListsTable({
  routesLists,
  loading,
}: {
  routesLists: RoutesList[];
  loading?: boolean;
}) {
  const [routeFilter, setRouteFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const uniqueRoutes = useMemo(() => {
    const routes = new Set(routesLists.map((route) => route.route));
    return Array.from(routes).sort();
  }, [routesLists]);

  const filteredRoutes = useMemo(() => {
    return routesLists.filter((routeList) => {
      const matchesRoute = !routeFilter || routeList.route === routeFilter;
      const matchesDate =
        !dateFilter || format(routeList.date, "yyyy-MM-dd") === dateFilter;
      return matchesRoute && matchesDate;
    });
  }, [routesLists, routeFilter, dateFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <select
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            className="w-full px-4 py-2 bg-bg-800 border border-bg-700 rounded-lg text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Wszystkie trasy</option>
            {uniqueRoutes.map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="h-4 w-4 text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-10 pr-4 py-2 bg-bg-800 border border-bg-700 rounded-lg text-sm text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="bg-bg-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-700">
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Trasa
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Liczba przystanków
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Liczba paczek
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="relative">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-neutral-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredRoutes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-neutral-400">
                    {routeFilter || dateFilter
                      ? "Brak wyników dla wybranych filtrów"
                      : "Brak list tras"}
                  </td>
                </tr>
              ) : (
                filteredRoutes.map((routesList) => (
                  <tr key={routesList.id} className="group">
                    <td className="p-4 text-foreground">{routesList.route}</td>
                    <td className="p-4 text-foreground">
                      {routesList.number_of_stops}
                    </td>
                    <td className="p-4 text-foreground">
                      {routesList.number_of_packages}
                    </td>
                    <td className="p-4 text-foreground">
                      {format(routesList.date, "dd.MM.yyyy")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
