"use client";

import { useState, useEffect } from "react";
import { Event } from "@/types";
import { getEvents } from "@/services/events";
import { EventsTable } from "@/components/molecules/EventsTable";
import { EventModal } from "@/components/molecules/EventModal";
import { Button } from "@/components/atoms/Button";
import { Plus } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      setError("Nie udało się pobrać wydarzeń");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Wydarzenia</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Dodaj wydarzenie
        </Button>
      </div>

      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      <EventsTable
        events={events}
        onUpdate={fetchEvents}
        loading={loading}
      />

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
      />
    </div>
  );
} 