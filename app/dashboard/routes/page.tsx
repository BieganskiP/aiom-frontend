"use client";

import { useEffect, useState } from "react";
import { Route } from "@/types";
import { getRoutes } from "@/services/routes";
import { Button } from "@/components/atoms/Button";
import { RoutesList } from "@/components/molecules/RoutesList";
import { RouteModal } from "@/components/molecules/RouteModal";
import { Plus } from "lucide-react";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getRoutes();
      setRoutes(data);
    } catch (error) {
      setError("Nie udało się pobrać listy tras");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRoute(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-neutral-600">Ładowanie...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-800">Trasy</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Dodaj trasę
          </Button>
        </div>

        {error && (
          <div className="bg-error-50 text-error-500 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <RoutesList
          routes={routes}
          onUpdate={fetchRoutes}
          onEdit={handleEdit}
        />

        <RouteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={fetchRoutes}
          route={editingRoute}
        />
      </div>
    </main>
  );
}
