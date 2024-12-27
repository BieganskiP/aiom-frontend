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
    <div className="bg-white rounded-lg shadow">
      {error && (
        <div className="bg-error-50 text-error-500 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Data
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Przystanki
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Trasa
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Samochód
            </th>
            <th className="text-right p-4 text-sm font-medium text-neutral-600">
              Zarobek
            </th>
            <th className="w-20"></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="border-b border-neutral-200 last:border-0"
            >
              <td className="p-4 text-neutral-600">
                {format(new Date(entry.workDate), "d MMMM yyyy", {
                  locale: pl,
                })}
              </td>
              <td className="p-4 text-neutral-600">{entry.stopsCompleted}</td>
              <td className="p-4 text-neutral-600">
                {entry.route?.name || "Brak"}
              </td>
              <td className="p-4 text-neutral-600">
                {entry.car
                  ? `${entry.car.name} (${entry.car.licensePlate})`
                  : "Brak"}
              </td>
              <td className="p-4 text-neutral-600 text-right">
                {(
                  entry.stopsCompleted * (entry.user?.paidPerStop || 0)
                ).toFixed(2)}{" "}
                zł
              </td>
              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingEntry(entry)}
                    className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-600"
                    title="Edytuj wpis"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-error-600"
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
              <td colSpan={6} className="p-4 text-center text-neutral-500">
                Brak wpisów dla wybranego miesiąca
              </td>
            </tr>
          )}
        </tbody>
        <tfoot className="bg-neutral-50 border-t border-neutral-200 font-medium">
          <tr>
            <td className="p-4">Suma</td>
            <td className="p-4">
              {entries.reduce((sum, entry) => sum + entry.stopsCompleted, 0)}
            </td>
            <td colSpan={2}></td>
            <td className="p-4 text-right">
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
