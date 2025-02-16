"use client";

import { getRoutesLists } from "@/services/routesLists";
import PageHeader from "@/components/atoms/layout/PageHeader";
import RouteListsTable from "@/components/molecules/tables/RouteListsTable";
import { useEffect, useState } from "react";
import { RoutesList } from "@/types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Calendar } from "lucide-react";
import { format, getDate } from "date-fns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Lists() {
  const [routesLists, setRoutesLists] = useState<RoutesList[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: format(new Date(), "MM"),
    year: format(new Date(), "yyyy"),
    period:
      getDate(new Date()) <= 15 ? ("first" as const) : ("second" as const),
    route: "",
    date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRoutesLists({
          period: filters.period,
          month: filters.month,
          year: filters.year,
        });
        setRoutesLists(data);
      } catch (error) {
        console.error("Failed to fetch routes lists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.period, filters.month, filters.year]);

  // Filter routes by selected route and date (if any)
  const filteredRoutes = routesLists.filter((route) => {
    const routeMatches = !filters.route || route.route === filters.route;
    const dateMatches =
      !filters.date ||
      format(new Date(route.date), "yyyy-MM-dd") === filters.date;
    return routeMatches && dateMatches;
  });

  // Calculate statistics based on filtered routes
  const totalStops = filteredRoutes.reduce(
    (sum, route) => sum + route.number_of_stops,
    0
  );
  const totalPackages = filteredRoutes.reduce(
    (sum, route) => sum + route.number_of_packages,
    0
  );
  const averageStopsPerRoute =
    filteredRoutes.length > 0
      ? Math.round(totalStops / filteredRoutes.length)
      : 0;
  const averagePackagesPerStop =
    totalStops > 0 ? Math.round((totalPackages / totalStops) * 100) / 100 : 0;

  // Prepare data for route distribution pie chart
  const routeDistributionData = Object.values(
    filteredRoutes.reduce((acc, route) => {
      if (!acc[route.route]) {
        acc[route.route] = {
          name: route.route,
          stops: 0,
          packages: 0,
        };
      }
      acc[route.route].stops += route.number_of_stops;
      acc[route.route].packages += route.number_of_packages;
      return acc;
    }, {} as Record<string, { name: string; stops: number; packages: number }>)
  );

  // Prepare data for packages per route bar chart
  const packagesPerRouteData = routeDistributionData.map((route) => ({
    name: route.name,
    packages: route.packages,
    stops: route.stops,
  }));

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-0">
        <PageHeader title="Listy" />
        <div className="flex gap-4">
          <select
            value={filters.period}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                period: e.target.value as "first" | "second",
              }))
            }
            className="px-4 py-2 bg-bg-800 border border-bg-700 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="first">Pierwsza połowa</option>
            <option value="second">Druga połowa</option>
          </select>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 stroke-white" />
            <input
              type="month"
              value={`${filters.year}-${filters.month}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split("-");
                setFilters((prev) => ({ ...prev, year, month }));
              }}
              className="pl-10 pr-4 py-2 bg-bg-800 border border-bg-700 rounded-lg text-sm text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-bg-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-neutral-400 mb-2">
            {filters.route
              ? `Przystanki - ${filters.route}`
              : "Łączna liczba przystanków"}
          </h3>
          <p className="text-3xl font-bold text-foreground">{totalStops}</p>
        </div>
        <div className="bg-bg-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-neutral-400 mb-2">
            {filters.route
              ? `Paczki - ${filters.route}`
              : "Łączna liczba paczek"}
          </h3>
          <p className="text-3xl font-bold text-foreground">{totalPackages}</p>
        </div>
        <div className="bg-bg-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-neutral-400 mb-2">
            Średnia przystanków na trasę
          </h3>
          <p className="text-3xl font-bold text-foreground">
            {averageStopsPerRoute}
          </p>
        </div>
        <div className="bg-bg-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-neutral-400 mb-2">
            Średnia paczek na przystanek
          </h3>
          <p className="text-3xl font-bold text-foreground">
            {averagePackagesPerStop}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Distribution Pie Chart */}
        <div className="bg-bg-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Rozkład przystanków na trasach
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={routeDistributionData}
                  dataKey="stops"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.name}
                >
                  {routeDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "#9CA3AF" }}
                  itemStyle={{ color: "#9CA3AF" }}
                  formatter={(value) => [
                    `${value} przystanków`,
                    "Liczba przystanków",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Packages per Route Bar Chart */}
        <div className="bg-bg-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Paczki i przystanki na trasach
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={packagesPerRouteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "#9CA3AF" }}
                />
                <Bar dataKey="packages" name="Paczki" fill="#0088FE" />
                <Bar dataKey="stops" name="Przystanki" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <RouteListsTable routesLists={filteredRoutes} loading={loading} />
    </div>
  );
}
