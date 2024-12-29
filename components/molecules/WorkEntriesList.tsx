"use client";

import { WorkEntry } from "@/types";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteWorkEntry } from "@/services/workEntries";
import { WorkEntryModal } from "./WorkEntryModal";

interface WorkEntriesListProps {
  entries: WorkEntry[];
  onUpdate: () => void;
}

export const WorkEntriesList = ({
  entries,
  onUpdate,
}: WorkEntriesListProps) => {
  const [error, setError] = useState<string>("");
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten wpis?")) return;

    try {
      setError("");
      await deleteWorkEntry(id);
      onUpdate();
    } catch (error) {
      setError("Nie udało się usunąć wpisu");
      console.error(error);
    }
  };

  return (
    <div className="bg-bg-800 rounded-lg">
      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20 mb-4">
          {error}
        </div>
      )}

      <table className="w-full">
        <thead className="border-b border-bg-700">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-neutral-400">
              Data
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-400">
              Przystanki
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-400">
              Trasa
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-400">
              Samochód
            </th>
            <th className="text-right p-4 text-sm font-medium text-neutral-400">
              Zarobek
            </th>
            <th className="w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bg-700">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="p-4 text-foreground">
                {format(new Date(entry.workDate), "d MMMM yyyy", {
                  locale: pl,
                })}
              </td>
              <td className="p-4 text-foreground">{entry.stopsCompleted}</td>
              <td className="p-4 text-foreground">
                {entry.route?.name || "Brak"}
              </td>
              <td className="p-4 text-foreground">
                {entry.car
                  ? `${entry.car.name} (${entry.car.licensePlate})`
                  : "Brak"}
              </td>
              <td className="p-4 text-foreground text-right">
                {(
                  entry.stopsCompleted * (entry.user?.paidPerStop || 0)
                ).toFixed(2)}{" "}
                zł
              </td>
              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingEntry(entry)}
                    className="p-1 hover:bg-bg-700 rounded-lg text-neutral-400 hover:text-neutral-200"
                    title="Edytuj wpis"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 hover:bg-bg-700 rounded-lg text-neutral-400 hover:text-error-500"
                    title="Usuń wpis"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-neutral-400">
                Brak wpisów dla wybranego miesiąca
              </td>
            </tr>
          )}
        </tbody>
        <tfoot className="border-t border-bg-700 font-medium">
          <tr>
            <td className="p-4 text-foreground">Suma</td>
            <td className="p-4 text-foreground">
              {entries.reduce((sum, entry) => sum + entry.stopsCompleted, 0)}
            </td>
            <td colSpan={2}></td>
            <td className="p-4 text-right text-foreground">
              {entries
                .reduce(
                  (sum, entry) =>
                    sum + entry.stopsCompleted * (entry.user?.paidPerStop || 0),
                  0
                )
                .toFixed(2)}{" "}
              zł
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <WorkEntryModal
        isOpen={Boolean(editingEntry)}
        onClose={() => setEditingEntry(null)}
        onSuccess={onUpdate}
        entry={editingEntry}
      />
    </div>
  );
};
