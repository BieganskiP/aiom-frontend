"use client";

import { useEffect, useState, useCallback } from "react";
import { WorkEntry } from "@/types";
import { getMyWorkEntries } from "@/services/workEntries";
import { WorkEntriesList } from "@/components/molecules/WorkEntriesList";
import { Button } from "@/components/atoms/Button";
import { WorkEntryModal } from "@/components/molecules/WorkEntryModal";

export default function WorkEntriesPage() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyWorkEntries(selectedMonth);
      setEntries(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił błąd podczas pobierania wpisów");
      }
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Wpisy pracy</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full sm:w-auto rounded-lg border bg-bg-700 border-bg-700 px-4 py-2 text-foreground"
            />
            <Button
              onClick={() => setIsModalOpen(true)}
              size="sm"
              className="whitespace-nowrap"
            >
              Dodaj wpis
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
            {error}
          </div>
        )}

        <WorkEntriesList
          entries={entries}
          onUpdate={fetchEntries}
          loading={loading}
        />

        <WorkEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchEntries}
        />
      </div>
    </main>
  );
}
