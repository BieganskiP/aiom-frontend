"use client";

import { WorkEntry } from "@/types";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteWorkEntry } from "@/services/workEntries";
import { WorkEntryModal } from "./WorkEntryModal";
import { TableWrapper } from "@/components/atoms/TableWrapper";

interface WorkEntriesListProps {
  entries: WorkEntry[];
  onUpdate: () => void;
  onEdit: (entry: WorkEntry) => void;
}

export const WorkEntriesList = ({
  entries,
  onUpdate,
  onEdit,
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
    <div className="space-y-4">
      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      <TableWrapper>
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-bg-700">
              <th className="text-left p-4 text-sm font-medium text-neutral-400 w-[120px]">
                Data
              </th>
              <th className="text-left p-4 text-sm font-medium text-neutral-400 w-[200px]">
                Kierowca
              </th>
              <th className="text-left p-4 text-sm font-medium text-neutral-400 w-[200px]">
                Trasa
              </th>
              <th className="text-left p-4 text-sm font-medium text-neutral-400 w-[200px]">
                Samochód
              </th>
              <th className="text-left p-4 text-sm font-medium text-neutral-400 w-[120px]">
                Przystanki
              </th>
              <th className="w-[80px] p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-700">
            {entries.map((entry) => (
              <tr key={entry.id} className="group">
                <td className="p-4 text-foreground whitespace-nowrap">
                  {new Date(entry.workDate).toLocaleDateString()}
                </td>
                <td className="p-4 text-foreground truncate">
                  {entry.user
                    ? `${entry.user.firstName} ${entry.user.lastName}`
                    : "-"}
                </td>
                <td className="p-4 text-foreground truncate">
                  {entry.route?.name || "-"}
                </td>
                <td className="p-4 text-foreground truncate">
                  {entry.car?.name || "-"}
                </td>
                <td className="p-4 text-foreground whitespace-nowrap">
                  {entry.stopsCompleted}
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
                  Brak wpisów dla wybranych kryteriów
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableWrapper>

      <WorkEntryModal
        isOpen={Boolean(editingEntry)}
        onClose={() => setEditingEntry(null)}
        onSuccess={onUpdate}
        entry={editingEntry}
      />
    </div>
  );
};
