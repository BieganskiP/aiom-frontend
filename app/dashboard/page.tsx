"use client";

import { useEffect, useState } from "react";
import { WorkEntry, UserRole } from "@/types";
import { getMyWorkEntries, getAllWorkEntries } from "@/services/workEntries";
import { getMyRegions } from "@/services/regions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { pl } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import PageHeader from "@/components/atoms/layout/PageHeader";
import { Clock, MapPin, Truck, Wallet, Building2 } from "lucide-react";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"];

export default function DashboardPage() {
  const { user } = useAuth();
  const [personalEntries, setPersonalEntries] = useState<WorkEntry[]>([]);
  const [managedEntries, setManagedEntries] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const isAdmin =
    user?.role === UserRole.ADMIN || user?.role === UserRole.OWNER;
  const isLeader = user?.role === UserRole.LEADER;

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch personal entries for all users
        const personalData = await getMyWorkEntries(`${currentMonth}-01`);
        setPersonalEntries(personalData);

        // Fetch managed entries for leaders and admins
        if (isAdmin || isLeader) {
          let managedData: WorkEntry[] = [];
          if (isAdmin) {
            managedData = await getAllWorkEntries({
              month: `${currentMonth}-01`,
            });
          } else if (isLeader) {
            const myRegions = await getMyRegions();
            const regionIds = myRegions.map((region) => region.id);
            managedData = await getAllWorkEntries({
              month: `${currentMonth}-01`,
              regionId: regionIds[0], // For now, just use the first region
            });
          }
          setManagedEntries(managedData);
        }
      } catch (error) {
        console.error("Failed to fetch entries:", error);
        setError("Nie udało się pobrać danych");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [currentMonth, isAdmin, isLeader]);

  if (loading) return <DashboardSkeleton />;

  // Calculate personal statistics
  const personalTotalStops = personalEntries.reduce(
    (sum, entry) => sum + entry.stopsCompleted,
    0
  );
  const personalTotalRevenue = personalEntries.reduce(
    (sum, entry) => sum + (entry.totalRevenue || 0),
    0
  );
  const personalTotalPay = personalEntries.reduce(
    (sum, entry) => sum + (entry.driverPay || 0),
    0
  );
  const personalAverageStopsPerDay =
    personalEntries.length > 0
      ? Math.round(personalTotalStops / personalEntries.length)
      : 0;

  // Calculate managed statistics
  const managedTotalStops = managedEntries.reduce(
    (sum, entry) => sum + entry.stopsCompleted,
    0
  );
  const managedTotalRevenue = managedEntries.reduce(
    (sum, entry) => sum + (entry.totalRevenue || 0),
    0
  );
  const managedTotalProfit = managedEntries.reduce(
    (sum, entry) => sum + (entry.companyProfit || 0),
    0
  );
  const managedAverageStopsPerDay =
    managedEntries.length > 0
      ? Math.round(managedTotalStops / managedEntries.length)
      : 0;

  // Prepare data for personal daily stats chart
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  const personalDailyStatsData = daysInMonth.map((date) => {
    const dayEntries = personalEntries.filter(
      (e) => e.workDate.split("T")[0] === format(date, "yyyy-MM-dd")
    );
    return {
      date: format(date, "d MMM", { locale: pl }),
      stops: dayEntries.reduce((sum, entry) => sum + entry.stopsCompleted, 0),
      revenue: dayEntries.reduce(
        (sum, entry) => sum + (entry.totalRevenue || 0),
        0
      ),
      pay: dayEntries.reduce((sum, entry) => sum + (entry.driverPay || 0), 0),
    };
  });

  // Prepare data for managed daily stats chart
  const managedDailyStatsData = daysInMonth.map((date) => {
    const dayEntries = managedEntries.filter(
      (e) => e.workDate.split("T")[0] === format(date, "yyyy-MM-dd")
    );
    return {
      date: format(date, "d MMM", { locale: pl }),
      stops: dayEntries.reduce((sum, entry) => sum + entry.stopsCompleted, 0),
      revenue: dayEntries.reduce(
        (sum, entry) => sum + (entry.totalRevenue || 0),
        0
      ),
      driverPay: dayEntries.reduce(
        (sum, entry) => sum + (entry.driverPay || 0),
        0
      ),
      profit: dayEntries.reduce(
        (sum, entry) => sum + (entry.companyProfit || 0),
        0
      ),
    };
  });

  // Prepare data for user performance chart (admin/owner only)
  const userPerformanceData = isAdmin
    ? Object.values(
        managedEntries.reduce((acc, entry) => {
          if (!entry.user) return acc;
          const userId = entry.user.id;
          if (!acc[userId]) {
            acc[userId] = {
              name: `${entry.user.firstName} ${entry.user.lastName}`,
              stops: 0,
            };
          }
          acc[userId].stops += entry.stopsCompleted;
          return acc;
        }, {} as Record<string, { name: string; stops: number }>)
      )
    : [];

  // Prepare data for routes distribution chart
  const routesData = Object.values(
    managedEntries.reduce((acc, entry) => {
      if (!entry.route) return acc;
      const routeId = entry.route.id;
      if (!acc[routeId]) {
        acc[routeId] = {
          name: entry.route.name,
          value: 0,
        };
      }
      acc[routeId].value += entry.stopsCompleted;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  return (
    <div className="p-6 space-y-8">
      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      <PageHeader title="Panel główny" />

      {/* Personal Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Truck className="w-6 h-6 text-primary-500" />
          Twoje statystyki
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-bg-800 p-6 rounded-lg border border-bg-700">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">
                  Przystanki
                </h3>
                <p className="text-3xl font-bold text-foreground">
                  {personalTotalStops}
                </p>
              </div>
              <MapPin className="w-6 h-6 text-primary-500" />
            </div>
            <p className="text-sm text-neutral-500 mt-2">
              Średnio {personalAverageStopsPerDay} dziennie
            </p>
          </div>

          <div className="bg-bg-800 p-6 rounded-lg border border-bg-700">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">
                  Przychód
                </h3>
                <p className="text-3xl font-bold text-foreground">
                  {personalTotalRevenue.toFixed(2)} zł
                </p>
              </div>
              <Wallet className="w-6 h-6 text-accent-500" />
            </div>
            <p className="text-sm text-neutral-500 mt-2">W tym miesiącu</p>
          </div>

          <div className="bg-bg-800 p-6 rounded-lg border border-bg-700">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">
                  Wypłata
                </h3>
                <p className="text-3xl font-bold text-foreground">
                  {personalTotalPay.toFixed(2)} zł
                </p>
              </div>
              <Wallet className="w-6 h-6 text-primary-500" />
            </div>
            <p className="text-sm text-neutral-500 mt-2">Do wypłaty</p>
          </div>

          <div className="bg-bg-800 p-6 rounded-lg border border-bg-700">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">
                  Czas pracy
                </h3>
                <p className="text-3xl font-bold text-foreground">
                  {personalEntries.length} dni
                </p>
              </div>
              <Clock className="w-6 h-6 text-accent-500" />
            </div>
            <p className="text-sm text-neutral-500 mt-2">W tym miesiącu</p>
          </div>
        </div>

        <div className="mt-6 bg-bg-800 p-6 rounded-lg border border-bg-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" />
            Twoje dzienne statystyki
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={personalDailyStatsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ color: "#9CA3AF" }}
                />
                <Line
                  type="monotone"
                  dataKey="stops"
                  name="Przystanki"
                  stroke={COLORS[0]}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Przychód"
                  stroke={COLORS[1]}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="pay"
                  name="Wypłata"
                  stroke={COLORS[2]}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Managed Statistics Section */}
      {(isAdmin || isLeader) && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary-500" />
            {isAdmin ? "Statystyki firmy" : "Statystyki regionu"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-bg-800 p-6 rounded-lg border border-bg-700">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">
                    Łączne przystanki
                  </h3>
                  <p className="text-3xl font-bold text-foreground">
                    {managedTotalStops}
                  </p>
                </div>
                <MapPin className="w-6 h-6 text-primary-500" />
              </div>
              <p className="text-sm text-neutral-500 mt-2">
                Średnio {managedAverageStopsPerDay} dziennie
              </p>
            </div>

            <div className="bg-bg-800 p-6 rounded-lg border border-bg-700">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">
                    Przychód
                  </h3>
                  <p className="text-3xl font-bold text-foreground">
                    {managedTotalRevenue.toFixed(2)} zł
                  </p>
                </div>
                <Wallet className="w-6 h-6 text-accent-500" />
              </div>
              <p className="text-sm text-neutral-500 mt-2">W tym miesiącu</p>
            </div>

            <div className="bg-bg-800 p-6 rounded-lg border border-bg-700">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">
                    Zysk firmy
                  </h3>
                  <p className="text-3xl font-bold text-foreground">
                    {managedTotalProfit.toFixed(2)} zł
                  </p>
                </div>
                <Wallet className="w-6 h-6 text-primary-500" />
              </div>
              <p className="text-sm text-neutral-500 mt-2">Do rozliczenia</p>
            </div>

            <div className="bg-bg-800 p-6 rounded-lg border border-bg-700">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">
                    Aktywni kierowcy
                  </h3>
                  <p className="text-3xl font-bold text-foreground">
                    {userPerformanceData.length}
                  </p>
                </div>
                <Truck className="w-6 h-6 text-accent-500" />
              </div>
              <p className="text-sm text-neutral-500 mt-2">W tym miesiącu</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-bg-800 p-6 rounded-lg border border-bg-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                {isAdmin
                  ? "Dzienne statystyki firmy"
                  : "Dzienne statystyki regionu"}
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={managedDailyStatsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF" }}
                    />
                    <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      labelStyle={{ color: "#9CA3AF" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="stops"
                      name="Przystanki"
                      stroke={COLORS[0]}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Przychód"
                      stroke={COLORS[1]}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      name="Zysk"
                      stroke={COLORS[2]}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {routesData.length > 0 && (
              <div className="bg-bg-800 p-6 rounded-lg border border-bg-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  Rozkład przystanków na trasach
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={routesData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => entry.name}
                      >
                        {routesData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        labelStyle={{ color: "#9CA3AF" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* User Performance Chart (admin/owner only) */}
            {isAdmin && userPerformanceData.length > 0 && (
              <div className="bg-bg-800 p-6 rounded-lg border border-bg-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary-500" />
                  Wydajność kierowców
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userPerformanceData}>
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
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        labelStyle={{ color: "#9CA3AF" }}
                      />
                      <Bar dataKey="stops" name="Przystanki" fill={COLORS[0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
