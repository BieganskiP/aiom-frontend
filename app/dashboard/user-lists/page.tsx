"use client";

import { getRoutesLists } from "@/services/routesLists";
import PageHeader from "@/components/atoms/layout/PageHeader";
import RouteListsTable from "@/components/molecules/tables/RouteListsTable";
import { useEffect, useState } from "react";
import { RoutesList } from "@/types";
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

export default function UserLists() {
  const { user } = useAuth();
  const [routesLists, setRoutesLists] = useState<RoutesList[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRoutesLists();
        setRoutesLists(data);
      } catch (error) {
        console.error("Failed to fetch routes lists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user?.route) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <PageHeader title="Moje listy" />
        <div className="bg-bg-800 p-6 rounded-lg mt-6">
          <p className="text-lg text-center text-neutral-400">
            Nie masz przypisanej trasy. Skontaktuj się z administratorem lub
            liderem.
          </p>
        </div>
      </div>
    );
  }

  // Filter routes by selected month and user's route
  const filteredRoutes = routesLists.filter((route) => {
    const routeDate = new Date(route.date);
    const monthStart = startOfMonth(new Date(selectedMonth));
    const monthEnd = endOfMonth(new Date(selectedMonth));
    const dateMatches = isWithinInterval(routeDate, {
      start: monthStart,
      end: monthEnd,
    });
    return dateMatches && route.route === user.route?.name;
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

  // Prepare data for daily distribution chart
  const dailyDistributionData = Object.values(
    filteredRoutes.reduce((acc, route) => {
      const date = format(new Date(route.date), "dd.MM");
      if (!acc[date]) {
        acc[date] = {
          name: date,
          stops: 0,
          packages: 0,
        };
      }
      acc[date].stops += route.number_of_stops;
      acc[date].packages += route.number_of_packages;
      return acc;
    }, {} as Record<string, { name: string; stops: number; packages: number }>)
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-0">
        <PageHeader title={`Moje listy - Trasa ${user.route.name}`} />
        <div className="flex gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 stroke-white" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-10 pr-4 py-2 bg-bg-800 border border-bg-700 rounded-lg text-sm text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-bg-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-neutral-400 mb-2">
            Łączna liczba przystanków
          </h3>
          <p className="text-3xl font-bold text-foreground">{totalStops}</p>
        </div>
        <div className="bg-bg-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-neutral-400 mb-2">
            Łączna liczba paczek
          </h3>
          <p className="text-3xl font-bold text-foreground">{totalPackages}</p>
        </div>
        <div className="bg-bg-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-neutral-400 mb-2">
            Średnia przystanków na dzień
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
        {/* Daily Distribution Bar Chart */}
        <div className="bg-bg-800 p-6 rounded-lg lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">
            Rozkład dzienny przystanków i paczek
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyDistributionData}>
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
