"use client";

import { useEffect, useState } from "react";
import { WorkEntry } from "@/types";
import { getMyWorkEntries } from "@/services/workEntries";
import { Button } from "@/components/atoms/Button";
import { WorkEntryModal } from "@/components/molecules/WorkEntryModal";
import { WorkEntriesList } from "@/components/molecules/WorkEntriesList";
import { Plus } from "lucide-react";

export default function WorkEntriesPage() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyWorkEntries(`${selectedMonth}-01`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Wpisy pracy</h1>
          <div className="flex gap-4 items-center">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-lg border bg-bg-700 border-bg-700 px-3 py-2 text-sm text-foreground"
            />
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Dodaj wpis
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
