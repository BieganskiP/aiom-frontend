"use client";

import { Event } from "@/types";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteEvent } from "@/services/events";
import { Button } from "@/components/atoms/buttons/Button";

interface EventsTableProps {
  events: Event[];
  onUpdate: () => void;
  loading?: boolean;
}

export function EventsTable({ events, onUpdate, loading }: EventsTableProps) {
  const [error, setError] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  const handleDelete = async (id: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć to wydarzenie?")) return;

    try {
      setError("");
      await deleteEvent(id);
      onUpdate();
    } catch (error) {
      setError("Nie udało się usunąć wydarzenia");
      console.error(error);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (!dateFilter) return true;
    return event.date.toString().split("T")[0] === dateFilter;
  });

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <div className="w-48">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground"
            placeholder="Filtruj po dacie"
          />
        </div>
      </div>

      <div className="bg-bg-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-700">
                <th className="text-left p-4 text-sm font-medium text-neutral-400 w-[50%]">
                  Opis
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400 w-[20%]">
                  Użytkownik
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400 w-[20%]">
                  Data
                </th>
                <th className="text-right p-4 text-sm font-medium text-neutral-400 w-[10%]">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="relative">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-neutral-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-neutral-400">
                    Brak wydarzeń
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-bg-700">
                    <td className="p-4 text-foreground">{event.description}</td>
                    <td className="p-4 text-foreground">
                      {event.user
                        ? `${event.user.firstName} ${event.user.lastName}`
                        : "-"}
                    </td>
                    <td className="p-4 text-foreground">
                      {new Date(event.date).toLocaleDateString("pl-PL")}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(event.id)}
                        className="text-error-500 hover:text-error-400"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
