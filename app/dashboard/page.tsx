"use client";

import { useEffect, useState } from "react";
import { WorkEntry, User } from "@/types";
import { getMyWorkEntries } from "@/services/workEntries";
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
} from "recharts";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { pl } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getMyWorkEntries(`${currentMonth}-01`);
        setEntries(data);
      } catch (error) {
        setError("Nie udało się pobrać danych");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [currentMonth]);

  // Calculate statistics
  const totalStops = entries.reduce(
    (sum, entry) => sum + entry.stopsCompleted,
    0
  );
  const totalEarnings = entries.reduce(
    (sum, entry) => sum + entry.stopsCompleted * (user?.paidPerStop || 0),
    0
  );
  const averageStopsPerDay =
    entries.length > 0 ? totalStops / entries.length : 0;

  // Prepare data for daily stops chart
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  const dailyStopsData = daysInMonth.map((date) => {
    const entry = entries.find(
      (e) => e.workDate.split("T")[0] === format(date, "yyyy-MM-dd")
    );
    return {
      date: format(date, "d MMM", { locale: pl }),
      stops: entry?.stopsCompleted || 0,
    };
  });

  // Prepare data for routes usage chart
  const routesData = entries.reduce(
    (acc: { name: string; count: number }[], entry) => {
      if (entry.route) {
        const existingRoute = acc.find((r) => r.name === entry.route!.name);
        if (existingRoute) {
          existingRoute.count += entry.stopsCompleted;
        } else {
          acc.push({ name: entry.route.name, count: entry.stopsCompleted });
        }
      }
      return acc;
    },
    []
  );

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
        <h1 className="text-2xl font-bold text-neutral-800 mb-6">
          Panel główny
        </h1>

        {error && (
          <div className="bg-error-50 text-error-500 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-neutral-600">
              Liczba przystanków
            </div>
            <div className="text-2xl font-bold text-neutral-900 mt-2">
              {totalStops}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-neutral-600">
              Zarobek w tym miesiącu
            </div>
            <div className="text-2xl font-bold text-neutral-900 mt-2">
              {totalEarnings.toFixed(2)} zł
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-neutral-600">
              Średnia przystanków dziennie
            </div>
            <div className="text-2xl font-bold text-neutral-900 mt-2">
              {averageStopsPerDay.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold text-neutral-800 mb-4">
              Przystanki dziennie
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStopsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={2} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="stops"
                    stroke="#6366f1"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold text-neutral-800 mb-4">
              Przystanki na trasach
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={routesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
