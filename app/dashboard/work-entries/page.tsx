"use client";

import { useEffect, useState } from "react";
import { WorkEntry } from "@/types";
import { getMyWorkEntries } from "@/services/workEntries";
import { WorkEntriesList } from "@/components/molecules/WorkEntriesList";
import { Button } from "@/components/atoms/Button";
import { Plus } from "lucide-react";
import { WorkEntryModal } from "@/components/molecules/WorkEntryModal";

export default function WorkEntriesPage() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyWorkEntries(selectedMonth);
      setEntries(data);
    } catch (error) {
      setError("Nie udało się pobrać wpisów");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [selectedMonth]);

  if (loading) {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-neutral-400">Ładowanie...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">Wpisy pracy</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full sm:w-auto rounded-lg border bg-bg-700 border-bg-700 px-4 py-2 text-foreground"
            />
            <Button
              onClick={() => setIsModalOpen(true)}
              size="sm"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Dodaj wpis</span>
              <span className="sm:hidden">Dodaj</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20 mb-4">
            {error}
          </div>
        )}

        <WorkEntriesList entries={entries} onUpdate={fetchEntries} />

        <WorkEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchEntries}
        />
      </div>
    </main>
  );
}
