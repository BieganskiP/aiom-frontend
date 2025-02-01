"use client";

import { WorkEntry } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteWorkEntry } from "@/services/workEntries";
import { WorkEntryModal } from "@/components/molecules/modals/WorkEntryModal";
import { useAuth } from "@/contexts/AuthContext";

interface WorkEntriesListProps {
  entries: WorkEntry[];
  onUpdate: () => void;
  loading?: boolean;
}

export function WorkEntriesList({
  entries,
  onUpdate,
  loading,
}: WorkEntriesListProps) {
  const { user: authUser } = useAuth();
  const [error, setError] = useState<string>("");
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten wpis?")) return;

    try {
      setError("");
      await deleteWorkEntry(id);
      await onUpdate();
    } catch (error) {
      setError("Nie udało się usunąć wpisu");
      console.error(error);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      <div className="bg-bg-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-700">
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Data
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Kierowca
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Trasa
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Samochód
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Przystanki
                </th>
                <th className="text-right p-4 text-sm font-medium text-neutral-400">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="relative">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-neutral-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                    </div>
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-neutral-400">
                    Brak wpisów
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="group">
                    <td className="p-4 text-foreground whitespace-nowrap">
                      {new Date(entry.workDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-foreground truncate">
                      {entry.user?.firstName && entry.user?.lastName
                        ? `${entry.user.firstName} ${entry.user.lastName}`
                        : authUser?.firstName && authUser?.lastName
                        ? `${authUser.firstName} ${authUser.lastName}`
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <WorkEntryModal
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        onSuccess={onUpdate}
        entry={editingEntry}
      />
    </>
  );
}
