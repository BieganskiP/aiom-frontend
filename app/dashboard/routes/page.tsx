"use client";

import { useEffect, useState } from "react";
import { Route } from "@/types";
import { getRoutes } from "@/services/routes";
import { getMyRegions } from "@/services/regions";
import { Button } from "@/components/atoms/Button";
import { RoutesList } from "@/components/molecules/RoutesList";
import { RouteModal } from "@/components/molecules/RouteModal";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/atoms/PageHeader";

export default function RoutesPage() {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const canManageRoutes = user?.role === "admin" || user?.role === "owner";

  const fetchRoutes = async () => {
    try {
      setError("");
      setLoading(true);

      if (user?.role === "leader") {
        // For leaders, get routes from their regions
        const myRegions = await getMyRegions();
        const allRoutes = myRegions.flatMap((region) => region.routes || []);
        // Remove duplicates (in case a route is in multiple regions)
        const uniqueRoutes = Array.from(
          new Map(allRoutes.map((route) => [route.id, route])).values()
        );
        setRoutes(uniqueRoutes);
      } else {
        // For admin/owner, get all routes
        const data = await getRoutes();
        setRoutes(data);
      }
    } catch (error) {
      setError("Nie udało się pobrać listy tras");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="h-8 w-48 bg-bg-700 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          <div className="h-12 bg-bg-700 rounded animate-pulse" />
          <div className="h-12 bg-bg-700 rounded animate-pulse" />
          <div className="h-12 bg-bg-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <PageHeader title="Trasy" />
        {canManageRoutes && (
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Dodaj trasę</span>
            <span className="sm:hidden">Dodaj</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20 mb-6">
          {error}
        </div>
      )}

      <RoutesList
        routes={routes}
        onUpdate={fetchRoutes}
        onEdit={setEditingRoute}
      />

      <RouteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchRoutes}
      />

      {editingRoute && (
        <RouteModal
          isOpen={true}
          onClose={() => setEditingRoute(null)}
          onSuccess={fetchRoutes}
          route={editingRoute}
        />
      )}
    </div>
  );
}
