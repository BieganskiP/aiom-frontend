"use client";

import { useEffect, useState } from "react";
import ComplaintsList from "@/components/molecules/tables/ComplaintsList";
import { getComplaintsStats } from "@/services/complaints";
import { ComplaintStatus } from "@/types";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface ComplaintStats {
  total: number;
  totalCompensation: number;
  byStatus: Record<ComplaintStatus, number>;
  compensationByStatus: Record<ComplaintStatus, number>;
}

export default function ComplaintsPage() {
  const [stats, setStats] = useState<ComplaintStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const [year, month] = selectedMonth.split("-").map(Number);

      const data = await getComplaintsStats({
        year,
        month,
        userId: user.id,
      });

      setStats(data);
    } catch (error) {
      setError("Nie udało się pobrać statystyk");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, user]);

  if (!user?.id) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-neutral-400">
            Ładowanie...
          </div>
          <div className="text-sm text-neutral-500">
            Trwa wczytywanie danych użytkownika
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Moje reklamacje</h1>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="pl-10 pr-4 py-2 bg-bg-800 border border-bg-700 rounded-lg text-sm text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-bg-800 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">
              Wszystkie reklamacje
            </h3>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-bg-800 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">
              Łączna wartość reklamacji
            </h3>
            <p className="text-3xl font-bold">{stats.totalCompensation} zł</p>
          </div>

          <div className="bg-bg-800 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">
              Zaakceptowane
            </h3>
            <div className="flex justify-between items-end">
              <p className="text-3xl font-bold">
                {stats.byStatus[ComplaintStatus.APPROVED]}
              </p>
              <p className="text-lg font-medium text-error-500">
                {stats.compensationByStatus[ComplaintStatus.APPROVED]} zł
              </p>
            </div>
          </div>

          <div className="bg-bg-800 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">
              Odrzucone
            </h3>
            <div className="flex justify-between items-end">
              <p className="text-3xl font-bold">
                {stats.byStatus[ComplaintStatus.REJECTED]}
              </p>
              <p className="text-lg font-medium text-success-500">
                {stats.compensationByStatus[ComplaintStatus.REJECTED]} zł
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      {/* Complaints List */}
      <ComplaintsList userId={user.id} selectedMonth={selectedMonth} />
    </div>
  );
}
